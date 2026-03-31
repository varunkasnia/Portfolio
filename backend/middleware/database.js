const requireDatabase = (req, res, next) => {
  if (req.app.locals.dbReady) {
    return next()
  }

  return res.status(503).json({
    message: 'Database is unavailable. The API is running in degraded mode.',
    degraded: true,
    database: 'disconnected',
  })
}

module.exports = { requireDatabase }
