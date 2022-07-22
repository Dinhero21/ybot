function parseMessage (message) {
  return message
    .replaceAll(/\*/g, '\\*')
    .replaceAll(/`/g, '\\`')
    .replaceAll(/</g, '\\<')
    .replaceAll(/>/g, '\\>')
    .replaceAll(/\|/g, '\\|')
    .replaceAll(/_/g, '\\_')
    // eslint-disable-next-line no-irregular-whitespace
    // .replaceAll(/@/g, '@​') // Better method, Thanks Ecolipsy#0001
    .replaceAll(/http/g, 'http​')
    .trim()
}

module.exports = parseMessage
