module.exports = {
  name: 'rc',
  minecraft (handler) {
    handler.bot.core.fillCore()
  },
  discord (handler) {
    handler.minecraft.core.fillCore()
  }
}
