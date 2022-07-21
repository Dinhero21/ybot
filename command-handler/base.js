class BaseCommandHandler {
  constructor (bot, raw, args, prefix) {
    this.bot = bot
    this.raw = raw
    this.args = args
    this.prefix = prefix
  }
}

module.exports = BaseCommandHandler
