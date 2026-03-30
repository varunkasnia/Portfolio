const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const protect = require('../middleware/auth')

const DEFAULT_IMAGE_SIZE_LIMIT = 5 * 1024 * 1024
const BACKGROUND_IMAGE_SIZE_LIMIT = 200 * 1024 * 1024
const DRIVE_DIR = path.join(__dirname, '..', 'drive')
const DRIVE_PUBLIC_PATH = '/drive'

if (!fs.existsSync(DRIVE_DIR)) fs.mkdirSync(DRIVE_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DRIVE_DIR),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const imageFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/
  const ext = allowed.test(path.extname(file.originalname).toLowerCase())
  const mime = allowed.test(file.mimetype)
  if (ext && mime) return cb(null, true)
  cb(new Error('Only image files are allowed'))
}

const upload = multer({
  storage,
  limits: { fileSize: DEFAULT_IMAGE_SIZE_LIMIT },
  fileFilter: imageFileFilter,
})

const backgroundUpload = multer({
  storage,
  limits: { fileSize: BACKGROUND_IMAGE_SIZE_LIMIT },
  fileFilter: imageFileFilter,
})

const sendUploadResponse = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const url = `${process.env.BACKEND_URL || 'http://localhost:5000'}${DRIVE_PUBLIC_PATH}/${req.file.filename}`
    return res.json({ url, public_id: req.file.filename })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// POST /api/upload — protected
router.post('/', protect, upload.single('image'), sendUploadResponse)

// POST /api/upload/background — protected
router.post('/background', protect, backgroundUpload.single('image'), sendUploadResponse)

module.exports = router
