const protect = require('../middleware/auth')
const { requireDatabase } = require('../middleware/database')

const MODELS_WITH_IMAGE_COLLECTIONS = new Set(['Project', 'Achievement', 'Workshop'])

const normalizePayload = (modelName, payload) => {
  const data = { ...payload }

  if ('featured' in data) data.featured = data.featured === 'true' || data.featured === true
  if ('attendees' in data) data.attendees = Number(data.attendees) || 0
  if (Array.isArray(data.techStack)) data.techStack = data.techStack.filter(Boolean)
  if (Array.isArray(data.tags)) data.tags = data.tags.filter(Boolean)

  if (MODELS_WITH_IMAGE_COLLECTIONS.has(modelName)) {
    const images = Array.isArray(data.images) ? data.images.filter(Boolean) : []
    const image = typeof data.image === 'string' ? data.image.trim() : ''

    if (images.length > 0) {
      data.images = images
      data.image = images[0]
    } else if (image) {
      data.image = image
      data.images = [image]
    } else if ('images' in data || 'image' in data) {
      data.images = []
      data.image = ''
    }
  }

  return data
}

/**
 * Creates a full CRUD router for a given Mongoose model.
 * GET    /         — public list
 * GET    /:id      — public single
 * POST   /         — protected create
 * PUT    /:id      — protected update
 * DELETE /:id      — protected delete
 */
const createCrudRouter = (Model) => {
  const router = require('express').Router()

  router.use(requireDatabase)

  // List — public
  router.get('/', async (req, res) => {
    try {
      const items = await Model.find().sort({ order: 1, createdAt: -1 })
      res.json(items)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  // Single — public
  router.get('/:id', async (req, res) => {
    try {
      const item = await Model.findById(req.params.id)
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json(item)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  // Create — protected
  router.post('/', protect, async (req, res) => {
    try {
      const data = normalizePayload(Model.modelName, req.body)
      const item = await Model.create(data)
      res.status(201).json(item)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

  // Update — protected
  router.put('/:id', protect, async (req, res) => {
    try {
      const data = normalizePayload(Model.modelName, req.body)
      const item = await Model.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json(item)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

  // Delete — protected
  router.delete('/:id', protect, async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id)
      if (!item) return res.status(404).json({ message: 'Not found' })
      res.json({ message: 'Deleted successfully' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  return router
}

module.exports = createCrudRouter
