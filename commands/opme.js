module.exports = {
  name: 'opme',
  minecraft (handler) {
    console.log(handler.selector)

    handler.bot.core.run(`/execute run op ${handler.selector}`)
  }
}
