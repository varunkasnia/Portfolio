const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Admin } = require('../models')
const protect = require('../middleware/auth')
const { requireDatabase } = require('../middleware/database')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' })

// POST /api/auth/login
router.post('/login', requireDatabase, async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.json({ token: signToken(admin._id), email: admin.email })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/auth/change-password (protected)
router.put('/change-password', protect, requireDatabase, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const admin = await Admin.findById(req.adminId)

    if (!await admin.comparePassword(currentPassword)) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    admin.password = newPassword
    await admin.save()
    res.json({ message: 'Password changed successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/auth/me (protected)
router.get('/me', protect, requireDatabase, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password')
    res.json(admin)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
