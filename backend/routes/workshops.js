const { Workshop } = require('../models')
const createCrudRouter = require('./crudFactory')
module.exports = createCrudRouter(Workshop)
