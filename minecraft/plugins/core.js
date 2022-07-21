const config = require('../../config.json')
const Vec3 = require('vec3')

const relativePosition = new Vec3(0, 0, 0)

function inject (bot) {
  bot.createCore = (layers = config.core.layers) => {
    const core = {
      isCore (position) {
        return position.x >= core.start.x && position.x <= core.end.x && position.y >= core.start.y && position.y <= core.end.y && position.z >= core.start.z && position.z <= core.end.z
      },
      run (command) {
        relativePosition.x++

        if (relativePosition.x >= 16) {
          relativePosition.x = 0
          relativePosition.y++
        }

        if (relativePosition.y >= layers) {
          relativePosition.y = 0
          relativePosition.z++
        }

        if (relativePosition.z >= 16) {
          relativePosition.z = 0
        }

        bot.write('update_command_block', {
          location: {
            x: core.start.x + relativePosition.x,
            y: core.start.y + relativePosition.y,
            z: core.start.z + relativePosition.z
          },
          command,
          mode: 1,
          flags: 0b100
        })
      },
      fillCore () {
        bot.chat(`/fill ${core.start.x} ${core.start.y} ${core.start.z} ${core.end.x} ${core.end.y} ${core.end.z} command_block`)

        bot.emit('core_filled')
      }
    }

    bot._client.on('position', position => {
      bot.position = position

      bot.emit('position', position)
    })

    bot.on('position', fillCore)

    fillCore()

    bot.core = core

    return core

    function fillCore () {
      core.start = new Vec3(
        Math.floor(bot.position.x / 16) * 16,
        0 /* bot.position.y */,
        Math.floor(bot.position.z / 16) * 16
      ).floor()
      core.end = core.start.clone().translate(16, layers, 16).subtract(new Vec3(1, 1, 1))

      core.fillCore()
    }
  }
}

module.exports = { inject }
