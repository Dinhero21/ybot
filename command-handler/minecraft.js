const BaseCommandHandler = require('./base')
const tellraw = require('../util/command/tellraw')

class MinecraftCommandHandler extends BaseCommandHandler {
  sendError (error) {
    if (error instanceof Error) error = error.stack

    this.bot.core.run(tellraw('@a', `Error: ${error}`))
  }
}

module.exports = MinecraftCommandHandler
