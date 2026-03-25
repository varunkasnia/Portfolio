const { Skill } = require('../models')
const createCrudRouter = require('./crudFactory')
module.exports = createCrudRouter(Skill)
