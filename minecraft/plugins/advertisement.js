const config = require('../../config.json')
const loadFiles = require('../../util/load_files')
const path = require('path')

function inject (bot) {
  if (!config.advertisements.enabled) return

  const advertisements = loadFiles(path.join(__dirname, '../../advertisements/minecraft/'))

  const intervals = []

  for (const advertisement of advertisements) {
    const interval = setInterval(() => {
      advertisement.execute(bot)
    }, advertisement.interval)

    intervals.push(interval)
  }

  bot.once('end', () => {
    for (const interval of intervals) clearInterval(interval)
  })
}

module.exports = { inject }
