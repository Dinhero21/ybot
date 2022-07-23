const { selectUsername } = require('../util/player')

module.exports = {
  name: 'cum',
  minecraft (handler) {
    handler.bot.core.run(`minecraft:give ${selectUsername(handler.bot, handler.sender)} potion{display:{Name:'{"text":"Cum","italic":false}'},CustomPotionColor:16777215}`)
  }
}
