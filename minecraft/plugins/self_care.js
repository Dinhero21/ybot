function inject (bot) {
  let vanish = false
  let cspy = false
  let op = true
  let gameMode = 1

  bot.on('parsed_chat', data => {
    const filters = {
      '^You are now completely invisible to normal users, and hidden from in-game commands.$': () => { vanish = true },
      '^Vanish for (.*): disabled$': () => { vanish = false },
      '^Successfully enabled CommandSpy$': () => { cspy = true },
      '^Successfully disabled CommandSpy$': () => { cspy = false }
    }

    for (const [filter, value] of Object.entries(filters)) {
      // TODO: Use data.raw
      if (new RegExp(filter).test(data.clean)) value()
    }
  })

  bot._client.on('entity_status', data => {
    if (data.entityId !== bot.entityId) return

    switch (data.entityStatus) {
      case 24:
        op = false

        bot.emit('deop')
        break
      case 28:
        op = true

        bot.emit('op')
        break
    }

    bot.emit('entity_status', data)
  })

  bot._client.on('game_state_change', data => {
    if (data.reason !== 3) return

    gameMode = data.gameMode
  })

  bot._client.once('login', data => {
    gameMode = data.gameMode
  })

  setInterval(() => {
    if (!op) {
      bot.chat('/minecraft:op @s[type=player]')
      return
    }

    if (!vanish) bot.chat('/essentials:evanish on')
    if (!cspy) bot.chat('/cspy on')
    if (gameMode !== 1) bot.chat('/minecraft:gamemode creative')
  }, 1000 * 5)
}

module.exports = { inject }
