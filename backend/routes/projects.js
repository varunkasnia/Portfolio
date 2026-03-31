const { Project } = require('../models')
const createCrudRouter = require('./crudFactory')
module.exports = createCrudRouter(Project)
