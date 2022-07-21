const parse = require('../../util/text_parser')

function inject (bot) {
  bot._client.on('chat', packet => {
    const message = parse(packet.message)
    bot.emit('parsed_chat', message, packet)
  })

  bot.on('parsed_chat', (message, packet) => {
    const { raw } = message

    if (raw.match(/<.*§r> .*/g)) {
      if (packet.sender === '00000000-0000-0000-0000-000000000000') return

      const username = raw.substr(3).split('§r>')[0]
      const message = raw.split('§r> §r')[1]

      bot.emit('message', username, message, packet.sender)
    } else if (raw.match(/<.*> .*/g)) {
      if (packet.sender === '00000000-0000-0000-0000-000000000000') return

      const username = raw.substr(3).split('>')[0]
      const message = raw.split('> ')[1]

      bot.emit('message', username, message, packet.sender)
    } else if (raw.match(/.* .*§r: §.*/g)) {
      if (packet.sender === '00000000-0000-0000-0000-000000000000') return

      const username = raw.split(' ')[1].split('§r:')[0]
      const message = raw.split('§r: ')[1].substr(2)

      bot.emit('message', username, message, packet.sender)
    } else if (raw.match(/§.*§b: \/.*/g)) {
      const username = raw.split('§b: ')[0]
      const command = raw.split('§b: ')[1]

      bot.emit('cspy', username, command)
    }
  })
}

module.exports = { inject }
