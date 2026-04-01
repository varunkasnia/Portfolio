const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const protect = require('../middleware/auth')
const { isGoogleDriveConfigured, uploadFileToGoogleDrive } = require('../lib/googleDrive')

// All uploads (regular + background) share the same 200 MB ceiling
const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200 MB

// Temp directory — files land here before being streamed to Google Drive
const TEMP_DIR = path.join(__dirname, '..', 'tmp_uploads')
const DRIVE_DIR = path.join(__dirname, '..', 'drive')
const DRIVE_PUBLIC_PATH = '/drive'

for (const dir of [TEMP_DIR, DRIVE_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

// Use temp storage so large files are buffered to disk, not memory
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TEMP_DIR),
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
  cb(new Error('Only image files are allowed (jpeg, jpg, png, webp, gif)'))
}

// Single multer instance — 200 MB for every upload endpoint
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: imageFileFilter,
})

const removeLocalFile = (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) return
  try { fs.unlinkSync(filePath) } catch (_) { /* best-effort */ }
}

const sendUploadResponse = (req, res) => {
  return (async () => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    // Reject if Google Drive is not configured — no silent Cloudinary fallback
    if (!isGoogleDriveConfigured()) {
      removeLocalFile(req.file.path)
      return res.status(500).json({
        message:
          'Google Drive is not configured. Set GOOGLE_DRIVE_CLIENT_EMAIL, ' +
          'GOOGLE_DRIVE_PRIVATE_KEY and GOOGLE_DRIVE_FOLDER_ID in your environment.',
      })
    }

    try {
      const uploadedFile = await uploadFileToGoogleDrive(req.file.path, req.file)
      removeLocalFile(req.file.path)

      return res.json({
        url: uploadedFile.url,
        public_id: uploadedFile.fileId,
        storage: 'google-drive',
      })
    } catch (err) {
      removeLocalFile(req.file?.path)
      return res.status(500).json({ message: err.message })
    }
  })()
}

// Multer error handler — catches file-too-large and bad mime-type errors cleanly
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      message: `File too large. Maximum allowed size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
    })
  }
  if (err) return res.status(400).json({ message: err.message })
  next()
}

// POST /api/upload — regular images, up to 200 MB
router.post(
  '/',
  protect,
  (req, res, next) => upload.single('image')(req, res, (err) => handleMulterError(err, req, res, next)),
  sendUploadResponse,
)

// POST /api/upload/background — background images, up to 200 MB
router.post(
  '/background',
  protect,
  (req, res, next) => upload.single('image')(req, res, (err) => handleMulterError(err, req, res, next)),
  sendUploadResponse,
)

module.exports = router
