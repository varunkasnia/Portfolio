const router = require('express').Router()
const { About } = require('../models')
const protect = require('../middleware/auth')
const { requireDatabase } = require('../middleware/database')

// GET /api/about — public
router.get('/', requireDatabase, async (req, res) => {
  try {
    let about = await About.findOne()
    if (!about) about = await About.create({})
    res.json(about)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/about — protected
router.put('/', protect, requireDatabase, async (req, res) => {
  try {
    let about = await About.findOne()
    if (!about) about = new About()
    Object.assign(about, req.body)
    await about.save()
    res.json(about)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
