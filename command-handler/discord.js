const BaseCommandHandler = require('./base')
const { EmbedBuilder } = require('discord.js')

class DiscordCommandHandler extends BaseCommandHandler {
  constructor (bot, raw, args, message) {
    super(bot, raw, args)

    this.message = message
    this.author = message.author
    this.channelId = message.channelId
  }

  sendError (error) {
    let embed

    if (error instanceof Error) {
      embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle(error.message)
        .setDescription(error.stack)
    } else {
      embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle(error)
    }

    return this.sendEmbeds(embed)
  }

  sendEmbeds (...embeds) {
    return this.sendMessage({ embeds })
  }

  sendMessage (message) {
    const channel = this.bot._client.channels.cache.get(this.channelId)

    return channel.send(message)
  }
}

module.exports = DiscordCommandHandler
