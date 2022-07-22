class MissingChannelError extends Error {
  constructor (message) {
    super(message)
    this.name = 'MissingChannelError'
  }
}

module.exports = MissingChannelError
