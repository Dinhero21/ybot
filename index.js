const config = require('./config.json')
const { createBots } = require('./minecraft')

createBots(config.servers)

process.on('uncaughtException', error => {
  console.error('[Uncaught exception]', error)
})

process.on('unhandledRejection', error => {
  console.error('[Unhandled rejection]', error)
})
