module.exports = {
  name: 'help',
  minecraft (handler) {
    const message = []

    for (const command of handler.bot.commands) {
      message.push({
        text: command.name,
        color: this.color(command),
        hoverEvent: {
          action: 'show_text',
          contents: [
            {
              text: 'Name',
              color: 'blue'
            },
            {
              text: ': ',
              color: 'white'
            },
            {
              text: command.name,
              color: 'white'
            },
            '\n',
            {
              text: 'Supported',
              color: 'blue'
            },
            {
              text: ': ',
              color: 'white'
            },
            {
              text: command.minecraft ? 'yes' : 'no',
              color: command.minecraft ? 'green' : 'red'
            }
          ]
        }
      })

      message.push(' ')
    }

    message.pop()

    handler.sendMessage('@a', message)
  },
  color (command) {
    let color = 'green'

    if (!command.minecraft) color = 'yellow'

    return color
  }
}
