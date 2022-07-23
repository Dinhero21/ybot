class MissingPlayerError extends Error {
  constructor (message) {
    super(message)

    this.name = 'MissingPlayerError'
  }
}

module.exports = MissingPlayerError
