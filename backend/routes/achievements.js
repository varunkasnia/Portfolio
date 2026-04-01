const { Achievement } = require('../models')
const createCrudRouter = require('./crudFactory')
module.exports = createCrudRouter(Achievement)
