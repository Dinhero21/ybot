const loadFiles = require('../util/load_files')
const path = require('path')
const { EventEmitter } = require('events')
const { Client } = require('discord.js')

const plugins = loadFiles(path.join(__dirname, './plugins'))

function createBot (options) {
  const bot = new EventEmitter()

  bot._client = new Client(options.client)

  bot._client.login(options.token)

  bot.loadPlugin = plugin => plugin.inject(bot)

  for (const plugin of plugins) bot.loadPlugin(plugin)

  return bot
}

module.exports = { createBot }
