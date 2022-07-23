const { resize } = require('../util/image')
const path = require('path')
const sharp = require('sharp')

module.exports = {
  name: 'draw',
  async minecraft (handler) {
    const name = handler.args.join(' ').replaceAll(/§r/g, '')
    const fullpath = path.join(__dirname, '../images', name)

    const image = await sharp(fullpath)

    const metadata = await image
      .metadata()

    const { width, height } = resize(metadata.width, metadata.height)

    const { data, info } = await image
      .resize({ fit: 'fill', kernel: 'nearest', width, height })
      .raw()
      .toBuffer({ resolveWithObject: true })

    handler.bot.draw(data, info)
  }
}
