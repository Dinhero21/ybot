const fs = require('fs')
const path = require('path')

function loadPlugins (directory) {
  const plugins = []

  for (const filename of fs.readdirSync(directory)) {
    if (!filename.endsWith('.js')) continue

    const filepath = path.join(directory, filename)

    const plugin = require(filepath)

    plugins.push(plugin)
  }

  return plugins
}

module.exports = loadPlugins
