require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'
const RECONNECT_DELAY_MS = 10000
const DRIVE_DIR = path.join(__dirname, 'drive')
const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:4173']
const allowedOrigins = Array.from(new Set([
  ...DEFAULT_ALLOWED_ORIGINS,
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
]))

app.locals.dbReady = false
app.locals.dbError = 'Database connection not established yet.'

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`))
  },
  credentials: true,
}))

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 })
app.use('/api', limiter)

// Body parser (limit covers JSON payloads; multipart file uploads are handled by multer)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Static file storage served from the local drive folder
app.use('/drive', express.static(DRIVE_DIR))
app.use('/uploads', express.static(DRIVE_DIR))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/about', require('./routes/about'))
app.use('/api/settings', require('./routes/settings'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/skills', require('./routes/skills'))
app.use('/api/achievements', require('./routes/achievements'))
app.use('/api/workshops', require('./routes/workshops'))
app.use('/api/upload', require('./routes/upload'))

// Health check
app.get('/api/health', (req, res) => {
  const isReady = req.app.locals.dbReady

  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ok' : 'degraded',
    database: isReady ? 'connected' : 'disconnected',
    error: isReady ? null : req.app.locals.dbError,
    timestamp: new Date(),
  })
})

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

let isConnecting = false
let retryTimeout = null

const scheduleReconnect = () => {
  if (retryTimeout) return

  retryTimeout = setTimeout(() => {
    retryTimeout = null
    connectToDatabase()
  }, RECONNECT_DELAY_MS)
}

const connectToDatabase = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) {
    return
  }

  isConnecting = true

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    app.locals.dbReady = true
    app.locals.dbError = null
    console.log('MongoDB connected')
  } catch (err) {
    app.locals.dbReady = false
    app.locals.dbError = err.message
    console.error(`MongoDB connection failed. Retrying in ${RECONNECT_DELAY_MS / 1000}s...`)
    console.error(err.message)
    scheduleReconnect()
  } finally {
    isConnecting = false
  }
}

mongoose.connection.on('connected', () => {
  app.locals.dbReady = true
  app.locals.dbError = null
})

mongoose.connection.on('disconnected', () => {
  app.locals.dbReady = false
  app.locals.dbError = 'MongoDB disconnected.'
  scheduleReconnect()
})

mongoose.connection.on('error', (err) => {
  app.locals.dbReady = false
  app.locals.dbError = err.message
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectToDatabase()
})
