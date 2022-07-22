class UnsupportedCommandError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UnsupportedCommandError'
  }
}

module.exports = UnsupportedCommandError
