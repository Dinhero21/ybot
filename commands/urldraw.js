const { resize } = require('../util/image')
const axios = require('axios')
const sharp = require('sharp')

module.exports = {
  name: 'urldraw',
  async minecraft (handler) {
    const url = handler.args.join(' ').replaceAll(/§r/g, '')

    const image = await axios.get('https://http-proxy.dinhero21.repl.co', {
      params: {
        uri: url
      },
      responseType: 'arraybuffer'
    })

    const loaded = sharp(image.data)

    const metadata = await loaded
      .metadata()

    const { width, height } = resize(metadata.width, metadata.height)

    const { data, info } = await loaded
      .resize({ fit: 'fill', kernel: 'nearest', width, height })
      .raw()
      .toBuffer({ resolveWithObject: true })

    handler.bot.draw(data, info)
  }
}
