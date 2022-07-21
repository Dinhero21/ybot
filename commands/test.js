module.exports = {
  name: 'test',
  minecraft (handler) {
    handler.bot.chat(handler.args.toString())
  }
}
