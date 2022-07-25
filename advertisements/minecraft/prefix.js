const config = require('../../config.json')
const tellraw = require('../../util/command/tellraw')

module.exports = {
  execute (bot) {
    if (!config.advertisements.prefix.enabled) return

    bot.core?.run(tellraw('@a', [
      {
        text: 'Use',
        color: 'white'
      },
      ' ',
      {
        text: config.advertisements.prefix.command,
        color: 'yellow'
      },
      ' ',
      {
        text: 'for',
        color: 'white'
      },
      ' ',
      {
        text: 'Command List',
        color: 'gold'
      }
    ]))
  },
  interval: 60 * 1000
}
