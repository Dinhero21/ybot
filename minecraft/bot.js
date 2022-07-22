const loadFiles = require('../util/load_files')
const path = require('path')
const { EventEmitter } = require('events')
const mc = require('minecraft-protocol')

const plugins = loadFiles(path.join(__dirname, 'plugins'))

function createBot (options) {
  options.username ??= 'YBot'
  options.version ??= false
  options.hideErrors ??= false
  options.logErrors ??= true
  options.brand ??= 'vanilla'

  const bot = new EventEmitter()

  bot.options = options

  if (options.logErrors) {
    bot.on('error', error => {
      if (!options.hideErrors) console.error(error)
    })
  }

  bot._client = mc.createClient({
    host: options.host,
    port: options.port,
    username: options.username,
    version: options.version,
    hideErrors: options.hideErrors,
    brand: options.brand
  })

  bot.write = (name, data) => bot._client.write(name, data)
  bot.chat = message => bot.write('chat', { message })

  bot.loadPlugin = plugin => plugin.inject(bot)

  for (const plugin of plugins) bot.loadPlugin(plugin)

  bot._client.on('connect', () => {
    bot.emit('connect')
  })

  bot._client.on('error', error => {
    bot.emit('error', error)
  })

  bot._client.on('end', reason => {
    bot.emit('end', reason, 'end')
  })

  bot._client.on('kick_disconnect', data => {
    const parsed = JSON.parse(data.reason)

    bot.emit('end', parsed, 'kick_disconnect')
  })

  bot._client.on('disconnect', data => {
    const parsed = JSON.parse(data.reason)

    bot.emit('end', parsed, 'disconnect')
  })

  return bot
}

module.exports = { createBot }
