module.exports = {
  name: 'restart',
  minecraft (handler) {
    handler.bot.end('restart')
  },
  discord (handler) {
    handler.minecraft.end('restart')
  }
}
