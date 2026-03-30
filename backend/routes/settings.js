const router = require('express').Router()
const { SiteSettings } = require('../models')
const protect = require('../middleware/auth')
const { requireDatabase } = require('../middleware/database')

// GET /api/settings — public
router.get('/', requireDatabase, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne()
    if (!settings) settings = await SiteSettings.create({})
    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/settings — protected
router.put('/', protect, requireDatabase, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne()
    if (!settings) settings = new SiteSettings()

    if ('backgroundImage' in req.body) {
      settings.backgroundImage = typeof req.body.backgroundImage === 'string'
        ? req.body.backgroundImage.trim()
        : ''
    }

    await settings.save()
    res.json(settings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
