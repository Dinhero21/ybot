const config = require('../../config.json')
const tellraw = require('../../util/command/tellraw')

module.exports = {
  execute (bot) {
    if (!config.advertisements.discord.enabled) return

    bot.core?.run(tellraw('@a', [
      {
        text: 'Join the',
        color: 'white'
      },
      ' ',
      {
        text: 'YBot Discord',
        color: 'yellow'
      },
      ' ',
      {
        text: 'at',
        color: 'white'
      },
      ' ',
      {
        text: config.advertisements.discord.invite,
        color: 'gold'
      }
    ]))
  },
  interval: 60 * 1000
}
