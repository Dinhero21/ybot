module.exports = {
  name: 'opme',
  minecraft (handler) {
    handler.bot.core?.run(`/execute run op ${handler.selector}`)
  }
}
