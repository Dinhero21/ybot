const config = require('./config.json')
const { createBots } = require('./minecraft')

createBots(config.servers)
