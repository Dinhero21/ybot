const config = require('../config.json')
const MissingPlayerError = require('../errors/player/missing.js')

module.exports = {
  name: 'player',
  minecraft (handler) {
    const action = handler.args[0]

    switch (action) {
      case 'list':
        this.minecraftList(handler)
        break
      case 'info':
        this.minecraftInfo(handler)
        break
    }
  },
  minecraftList (handler) {
    const players = handler.bot.players.getPlayers()

    const json = []

    for (const [index, player] of Object.entries(players)) {
      const color = index % 2 ? 'green' : 'dark_green'

      json.push({
        text: player.name,
        color,
        hoverEvent: {
          action: 'show_text',
          contents: [
            {
              text: 'Click to see more information',
              color
            }
          ]
        },
        clickEvent: {
          action: 'run_command',
          value: `${config.prefixes[0]}player info ${player.UUID}`
        }
      })

      json.push({
        text: ' - ',
        color: 'gray',
        hoverEvent: {
          action: 'show_text',
          contents: ['']
        }
      })
    }

    json.pop()

    handler.sendMessage(json)
  },
  minecraftInfo (handler) {
    const uuid = handler.args.slice(1).join(' ')

    const player = handler.bot.players.getPlayer(uuid)

    if (player === undefined) throw new MissingPlayerError(`Could not find player ${uuid}`)

    handler.sendMessage([
      {
        text: 'UUID',
        color: 'red'
      },
      {
        text: ': ',
        color: 'white'
      },
      {
        text: player.UUID,
        color: 'blue',
        clickEvent: {
          action: 'copy_to_clipboard',
          value: player.UUID
        }
      },
      '\n',
      {
        text: 'Name',
        color: 'red'
      },
      {
        text: ': ',
        color: 'white'
      },
      {
        text: player.name,
        color: 'blue',
        clickEvent: {
          action: 'copy_to_clipboard',
          value: player.name
        }
      },
      '\n',
      {
        text: 'Gamemode',
        color: 'red'
      },
      {
        text: ': ',
        color: 'white'
      },
      {
        text: player.gamemode,
        color: 'blue',
        clickEvent: {
          action: 'copy_to_clipboard',
          value: player.gamemode
        }
      },
      '\n',
      {
        text: 'Ping',
        color: 'red'
      },
      {
        text: ': ',
        color: 'white'
      },
      {
        text: player.ping,
        color: 'blue',
        clickEvent: {
          action: 'copy_to_clipboard',
          value: player.ping
        }
      }
    ])
  }
}
