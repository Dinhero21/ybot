const { resize } = require('../util/image')
const axios = require('axios')
const sharp = require('sharp')
const { RandomPHUB } = require('discord-phub')

const nsfw = new RandomPHUB(true)

module.exports = {
  name: 'hentai',
  async minecraft (handler) {
    let category = handler.args.join(' ')

    if (category.length === '') category = nsfw.getRandomCategory()

    const { url } = nsfw.getRandomInCategory(category, 'png')

    const result = await axios.get(url, {
      responseType: 'arraybuffer'
    })

    const raw = result.data

    const metadata = await sharp(raw)
      .metadata()

    const { width, height } = resize(metadata.width, metadata.height)

    const { data, info } = await sharp(raw)
      .resize({ fit: 'fill', kernel: 'nearest', width, height })
      .raw()
      .toBuffer({ resolveWithObject: true })

    handler.bot.draw(data, info, { strikethrough: true }, handler.selector)

    handler.sendMessage({
      text: 'Click here to see the original image',
      color: 'yellow',
      bold: true,
      clickEvent: {
        action: 'open_url',
        value: url
      }
    })
  }
}
