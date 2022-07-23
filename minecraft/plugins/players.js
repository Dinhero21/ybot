class PlayerList {
  list = []

  addPlayer (player) {
    this.removePlayer(player)

    this.list.push(player)
  }

  hasPlayer (player) {
    return this.getPlayer(player) !== undefined
  }

  getPlayer (player) {
    let identifier

    switch (typeof player) {
      case 'object':
        identifier = player.UUID
        break
      case 'string':
        identifier = player
        break
      default:
        throw new Error(`Get player called with ${player}`)
    }

    return this.list.find(player => [player.UUID, player.name].some(item => item === identifier))
  }

  getPlayers () {
    return Array.from(this.list)
  }

  removePlayer (player) {
    this.list = this.list.filter(({ UUID }) => UUID !== player.UUID)
  }
}

class TabCompletePlayerRequester {
  id = 0
  queue = {}
  bot

  constructor (bot) {
    this.bot = bot

    bot.on('target_packet', (name, data) => {
      if (name !== 'tab_complete') return

      const players = data.matches
        .filter(match => !match.tooltip)
        .map(match => match.match)

      this.returnPlayerList(data.transactionId, players)
    })
  }

  getPlayerList () {
    return new Promise(resolve => {
      this.id++
      this.id %= 256

      this.queue[this.id] = resolve

      setTimeout(() => this.returnPlayerList(this.id, this.getPlayerList()), 1000 * 5)

      this.bot.write('tab_complete', { transactionId: this.id, text: '/scoreboard players add ' })
    })
  }

  returnPlayerList (id, players) {
    if (!this.queue[id]) return

    this.queue[id](players)

    delete this.queue[id]
  }
}

function inject (bot) {
  bot.players = new PlayerList()
  bot.requester = new TabCompletePlayerRequester(bot)

  bot._client.on('player_info', packet => {
    for (const player of packet.data) {
      switch (packet.action) {
        case 0:
          addPlayer(player, packet)
          break
        case 1:
          updateGamemode(player, packet)
          break
        case 2:
          updatePing(player, packet)
          break
        case 3:
          updateDisplayName(player, packet)
          break
        case 4:
          removePlayer(player, packet)
          break
      }
    }
  })

  function addPlayer (player, packet) {
    if (bot.players.getPlayer(player)) bot.emit('player_unvanished', player, packet)
    else bot.emit('player_added', player, packet)

    bot.players.addPlayer(player)
  }

  function updateGamemode (player, packet) {
    const fullPlayer = bot.players.getPlayer(player)

    bot.emit('onPlayerGamemodeUpdate', player, packet)

    if (fullPlayer === undefined) return

    fullPlayer.gamemode = player.gamemode
  }

  function updatePing (player, packet) {
    const fullPlayer = bot.players.getPlayer(player)

    bot.emit('player_ping_updated', player, packet)

    if (fullPlayer === undefined) return

    fullPlayer.ping = player.ping
  }

  function updateDisplayName (player, packet) {
    const fullPlayer = bot.players.getPlayer(player)

    bot.emit('player_display_name_updated', player, packet)

    if (fullPlayer === undefined) return

    fullPlayer.displayName = player.displayName
  }

  async function removePlayer (player, packet) {
    const fullPlayer = bot.players.getPlayer(player)

    const players = await bot.requester.getPlayerList()

    if (fullPlayer && players.some(name => name === fullPlayer.name)) {
      bot.emit('player_vanished', player)

      return
    }

    bot.emit('player_removed')

    bot.players.removePlayer(player)
  }
}

module.exports = { inject }
