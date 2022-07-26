const { createBot } = require('./bot')
const randomstring = require('randomstring')

const bots = {}

function createBots (servers) {
  for (const server of servers) handleServer(server)

  function handleServer (server) {
    handleBot()

    function handleBot () {
      const bot = createBot({
        host: server.host,
        port: server.port,
        username: randomstring.generate(8)
      })

      bots[`${server.host}:${server.port}`] = bot

      bot.once('end', reason => {
        let timeout = 1000

        if (reason.extra?.find(data => data.text === 'Wait 5 seconds before connecting, thanks! :)')) timeout = 1000 * 6

        delete bots[`${server.host}:${server.port}`]

        setTimeout(() => {
          bot.end()

          handleBot()
        }, timeout)
      })

      bot._client.on('login', () => {
        bot.createCore()
      })
    }
  }
}

module.exports = { createBots, bots }
