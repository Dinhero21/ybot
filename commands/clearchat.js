module.exports = {
  name: 'clearchat',
  minecraft (handler) {
    handler.sendMessage([
      {
        text: '\n'.repeat(100)
      },
      {
        text: 'Chat has been cleared',
        color: 'green',
        bold: true
      }
    ], '@a')
  }
}
