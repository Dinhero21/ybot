const { createBot } = require('./bot')
const randomstring = require('randomstring')

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

      bot.on('end', reason => {
        console.error(reason)

        let timeout = 1000

        if (reason.extra?.find(data => data.text === 'Wait 5 seconds before connecting, thanks! :)')) timeout = 1000 * 6

        setTimeout(handleBot, timeout)
      })

      bot._client.on('login', () => {
        bot.createCore()
      })
    }
  }
}

module.exports = { createBots }
