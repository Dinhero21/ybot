const config = require('../config.json')
const { createBot } = require('./bot')
const { GatewayIntentBits, Partials } = require('discord.js')

let bot = null

if (config.discord.enabled) {
  bot = createBot({
    token: config.discord.token,
    client: {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ],
      partials: [
        Partials.Channel
      ]
    }
  })
}

module.exports = bot
