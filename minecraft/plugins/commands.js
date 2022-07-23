const config = require('../../config.json')
const UnknownCommandError = require('../../errors/command/unknown')
const UnsupportedCommandError = require('../../errors/command/unsupported')
const MinecraftCommandHandler = require('../../command-handler/minecraft')
const loadFiles = require('../../util/load_files')
const path = require('path')

function inject (bot) {
  bot.commands = loadFiles(path.join(__dirname, '../../commands'))

  bot.on('message', async (username, message, sender) => {
    for (const prefix of config.prefixes) {
      if (!message.startsWith(prefix)) continue

      const raw = message.substr(prefix.length)

      const [commandName, ...args] = raw.split(' ')

      const handler = new MinecraftCommandHandler(bot, raw, args, prefix, username, sender)

      const command = bot.commands.find(command => command.name === commandName)

      if (command === undefined) {
        handler.sendError(new UnknownCommandError(`Unknown command: ${commandName}`))

        return
      }

      if (command.minecraft === undefined) {
        handler.sendError(new UnsupportedCommandError(`${commandName} is not supported`))

        return
      }

      try {
        await command.minecraft(handler)
      } catch (error) {
        handler.sendError(error)
      }
    }
  })
}

module.exports = { inject }
