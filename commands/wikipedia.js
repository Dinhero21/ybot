const wikipedia = require('wikipedia')

module.exports = {
  name: 'wikipedia',
  async minecraft (handler) {
    const topic = handler.args.join(' ')

    const page = await wikipedia.page(topic)

    const summary = await page.summary()

    handler.sendMessage('@a', summary.extract)
  }
}
