const config = require('../../config.json')
const UnknownCommandError = require('../../errors/command/unknown')
const UnsupportedCommandError = require('../../errors/command/unsupported')
const DiscordCommandHandler = require('../../command-handler/discord')
const loadFiles = require('../../util/load_files')
const path = require('path')

function inject (bot) {
  bot.commands = loadFiles(path.join(__dirname, '../../commands'))

  bot._client.on('messageCreate', async message => {
    if (message.author.id === bot._client.user.id) return

    const data = message.content

    if (!data.startsWith(config.discord.prefix)) return

    const raw = data.substr(config.discord.prefix.length)

    const [commandName, ...args] = raw.split(' ')

    const handler = new DiscordCommandHandler(bot, raw, args, message)

    const command = bot.commands.find(command => command.name === commandName)

    if (command === undefined) {
      handler.sendError(new UnknownCommandError(`Unknown command: ${commandName}`))

      return
    }

    if (command.discord === undefined) {
      handler.sendError(new UnsupportedCommandError(`${commandName} is not supported`))

      return
    }

    try {
      await command.discord(handler)
    } catch (error) {
      handler.sendError(error)
    }
  })
}

module.exports = { inject }
