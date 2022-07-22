const config = require('../../config.json')
const discord = require('../../discord')
const MissingChannelError = require('../../errors/discord/missing-channel')
const tellraw = require('../../util/command/tellraw')
const parseMessage = require('../../util/discord/parse_message')

function inject (bot) {
  const { host, port } = bot.options

  const server = `${host}:${port}`

  const channelId = config.discord.servers[server]

  if (!channelId) throw new MissingChannelError(`Could not find channel for ${server}`)

  let text = ''

  bot.on('parsed_chat', (data, raw) => {
    const message = JSON.parse(raw.message)

    // Disable logging of "Command set: "
    if (message.translate === 'advMode.setCommand.success') return

    text += data.clean
    text += '\n'
  })

  setInterval(() => {
    const channel = discord._client.channels.cache.get(channelId)

    if (!channel) return

    if (text.length === 0) return
    if (text.length > config.discord.spam_size) text = 'Spam detected! Logging disabled!'

    const message = parseMessage(text.slice(0, 1000))

    channel.send(message)

    text = text.slice(1000)
  }, 1000)

  discord._client.on('messageCreate', message => {
    if (message.channelId !== channelId) return
    if (message.author.id === discord._client.user.id) return

    const data = [
      {
        text: '[',
        color: 'dark_gray',
        bold: false
      },
      {
        text: 'DISCORD',
        color: 'blue',
        bold: true
      },
      {
        text: ']',
        color: 'dark_gray',
        bold: false
      },
      ' ',
      {
        text: '[',
        color: 'dark_gray',
        bold: false
      },
      {
        text: 'YBOT',
        color: 'yellow',
        bold: true
      },
      {
        text: ']',
        color: 'dark_gray',
        bold: false
      },
      ' ',
      {
        text: message.author.username,
        color: 'red',
        bold: false,
        hoverEvent: {
          action: 'show_text',
          contents: [
            {
              text: message.author.username,
              color: 'white'
            },
            {
              text: '#',
              color: 'gray'
            },
            {
              text: message.author.discriminator,
              color: 'gray'
            }
          ]
        },
        clickEvent: {
          action: 'copy_to_clipboard',
          value: `${message.author.username}#${message.author.discriminator}`
        }
      },
      {
        text: ': ',
        color: 'white',
        bold: false
      },
      {
        text: message.content,
        color: 'white',
        bold: false
      }
    ]

    bot.core.run(tellraw('@a', data))
  })
}

module.exports = { inject }
