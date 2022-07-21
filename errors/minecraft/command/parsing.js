class MinecraftCommandParserError extends Error {
  constructor (message) {
    super(message)

    this.name = 'MinecraftCommandParserError'
  }
}

module.exports = MinecraftCommandParserError
