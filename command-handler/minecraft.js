const BaseCommandHandler = require('./base')
const tellraw = require('../util/command/tellraw')
const { selectUsername } = require('../util/player')

class MinecraftCommandHandler extends BaseCommandHandler {
  constructor (bot, raw, args, prefix, username, sender) {
    super(bot, raw, args)

    this.prefix = prefix
    this.username = username
    this.sender = sender
  }

  sendError (error) {
    if (error instanceof Error) error = error.toString()

    this.sendMessage('@a', { color: 'red', text: error })
  }

  sendMessage (message, selector) {
    selector ??= selectUsername(this.bot, this.sender)

    this.bot.core.run(tellraw(selector, message))
  }
}

module.exports = MinecraftCommandHandler
