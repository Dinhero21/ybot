module.exports = {
  name: 'run',
  minecraft (handler) {
    const command = handler.args.join(' ')

    handler.bot.core.run(command)
  },
  discord (handler) {
    const command = handler.args.join(' ')

    handler.minecraft.core.run(command)
  }
}
