const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const protect = require('../middleware/auth')

let upload

// Try Cloudinary if credentials exist
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
) {
  const cloudinary = require('cloudinary').v2
  const { CloudinaryStorage } = require('multer-storage-cloudinary')

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'portfolio',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }],
    },
  })

  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })
} else {
  // Local storage fallback
  const uploadsDir = path.join(__dirname, '..', 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
      cb(null, `${unique}${path.extname(file.originalname)}`)
    },
  })

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp|gif/
      const ext = allowed.test(path.extname(file.originalname).toLowerCase())
      const mime = allowed.test(file.mimetype)
      if (ext && mime) return cb(null, true)
      cb(new Error('Only image files are allowed'))
    },
  })
}

// POST /api/upload — protected
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    // Cloudinary gives req.file.path, local gives filename
    const url = req.file.path || `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`
    res.json({ url, public_id: req.file.filename || req.file.public_id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
