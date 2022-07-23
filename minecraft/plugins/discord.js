const config = require('../../config.json')
const discord = require('../../discord')
const MissingChannelError = require('../../errors/discord/missing-channel')
const tellraw = require('../../util/command/tellraw')
const parseMessage = require('../../util/discord/parse_message')
const util = require('util')
const { EmbedBuilder } = require('discord.js')

function inject (bot) {
  const { host, port } = bot.options

  const server = `${host}:${port}`

  const channelId = config.discord.servers[server]

  if (!channelId) throw new MissingChannelError(`Could not find channel for ${server}`)

  let text = ''

  function handleParsedChat (data, raw) {
    const message = JSON.parse(raw.message)

    // Disable logging of "Command set: "
    if (message.translate === 'advMode.setCommand.success') return

    text += data.clean
    text += '\n'
  }

  bot.on('parsed_chat', handleParsedChat)

  setInterval(() => {
    const channel = discord._client.channels.cache.get(channelId)

    if (!channel) return

    if (text.length === 0) return
    if (text.length > config.discord.spam_size) text = 'Spam detected! Logging disabled!'

    const message = parseMessage(text.slice(0, 1000))

    channel.send(message)

    text = text.slice(1000)
  }, 1000)

  function handleDiscordMessage (message) {
    if (message.channelId !== channelId) return
    if (message.author.id === discord._client.user.id) return
    if (message.content.startsWith(config.discord.prefix)) return

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

    bot.core?.run(tellraw('@a', data))
  }

  discord._client.on('messageCreate', handleDiscordMessage)

  function handleEnd (reason, sender) {
    const channel = discord._client.channels.cache.get(channelId)

    if (!channel) return

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle(sender)
      .setDescription(`\`\`\`ansi\n${util.inspect(reason, { colors: true })}\`\`\``)

    channel.send({ embeds: [embed] })
  }

  bot.on('end', handleEnd)

  function handleError (error) {
    const channel = discord._client.channels.cache.get(channelId)

    if (!channel) return

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle(error.message)
      .setDescription(`\`\`\`text\n${error.stack}\`\`\``)

    channel.send({ embeds: [embed] })
  }

  bot.on('error', handleError)
}

module.exports = { inject }
