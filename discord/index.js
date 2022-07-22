const config = require('../config.json')
const { createBot } = require('./bot')
const { GatewayIntentBits, Partials } = require('discord.js')

const bot = createBot({
  token: config.discord.token,
  client: {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ],
    partials: [
      Partials.Channel
    ]
  }
})

module.exports = bot
