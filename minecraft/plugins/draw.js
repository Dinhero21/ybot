const convert = require('color-convert')
const tellraw = require('../../util/command/tellraw')

function inject (bot) {
  function draw (data, info, prefix = {}, selector = '@a') {
    const pixels = []

    // Data Buffer -> RGB Array
    for (let i = 0; i < data.length; i += info.channels) {
      pixels.push([
        data[i + 0],
        data[i + 1],
        data[i + 2]
      ])
    }

    const rows = []

    // RGB Array -> Rows Array
    for (let i = 0; i < pixels.length; i += info.width) {
      const row = pixels.slice(i, i + info.width)

      rows.push(row)
    }

    const messages = []

    for (const row of rows) {
      const message = [{ ...prefix, text: '' }]

      for (const rgb of row) {
        message.push({
          text: '⎮',
          color: `#${convert.rgb.hex(rgb)}`
        })
      }

      messages.push(message)
    }

    for (const message of messages) bot.core?.run(tellraw(selector, message))
  }

  bot.draw = draw
}

module.exports = { inject }
