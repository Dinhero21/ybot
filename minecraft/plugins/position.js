const Vec3 = require('vec3')

function inject (bot) {
  bot.position = new Vec3(null, null, null)

  bot.on('position', position => {
    bot.position = new Vec3(position.x, position.y, position.z)
  })
}

module.exports = { inject }
