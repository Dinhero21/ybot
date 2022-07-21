const config = require('../../config.json')
const MinecraftCommandParserError = require('../../errors/minecraft/command/parsing')
const MinecraftCommandHandler = require('../../command-handler/minecraft')
const loadFiles = require('../../util/load_files')
const path = require('path')

function inject (bot) {
  bot.on('message', async (username, message) => {
    for (const prefix of config.prefixes) {
      if (!message.startsWith(prefix)) continue

      const raw = message.substr(prefix.length)

      const [commandName, ...args] = raw.split(' ')

      const handler = new MinecraftCommandHandler(bot, raw, args, prefix)

      const commands = loadFiles(path.join(__dirname, '../../commands'))

      const command = commands.find(command => command.name === commandName)

      if (command === undefined) {
        handler.sendError(new MinecraftCommandParserError(`Unknown command: ${commandName}`))

        return
      }

      if (command.minecraft === undefined) {
        handler.sendError(new MinecraftCommandParserError(`${commandName} is not supported`))

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
