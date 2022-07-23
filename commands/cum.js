const { UUIDToInt } = require('../util/player')

module.exports = {
  name: 'cum',
  minecraft (handler) {
    handler.bot.core.run(`minecraft:give @p[nbt={UUID:[I;${UUIDToInt(handler.sender).value.join()}]}] potion{display:{Name:'{"text":"Cum","italic":false}'},CustomPotionColor:16777215}`)
  }
}
