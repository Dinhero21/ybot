const { language } = require('minecraft-data')('1.18.2')

const colormap = {
  black: '§0',
  dark_blue: '§1',
  dark_green: '§2',
  dark_aqua: '§3',
  dark_red: '§4',
  dark_purple: '§5',
  gold: '§6',
  gray: '§7',
  dark_gray: '§8',
  blue: '§9',
  green: '§a',
  aqua: '§b',
  red: '§c',
  light_purple: '§d',
  yellow: '§e',
  white: '§f',
  reset: '§r'
}

const ansimap = {
  '§0': '\x1b[0m\x1b[30m',
  '§1': '\x1b[0m\x1b[34m',
  '§2': '\x1b[0m\x1b[32m',
  '§3': '\x1b[0m\x1b[36m',
  '§4': '\x1b[0m\x1b[31m',
  '§5': '\x1b[0m\x1b[35m',
  '§6': '\x1b[0m\x1b[33m',
  '§7': '\x1b[0m\x1b[37m',
  '§8': '\x1b[0m\x1b[90m',
  '§9': '\x1b[0m\x1b[94m',
  '§a': '\x1b[0m\x1b[92m',
  '§b': '\x1b[0m\x1b[96m',
  '§c': '\x1b[0m\x1b[91m',
  '§d': '\x1b[0m\x1b[95m',
  '§e': '\x1b[0m\x1b[93m',
  '§f': '\x1b[0m\x1b[97m',
  '§r': '\x1b[0m',
  '§l': '\x1b[1m',
  '§o': '\x1b[3m',
  '§n': '\x1b[4m',
  '§m': '\x1b[9m',
  '§k': '\x1b[6m'
}

/**
 * Parses a native minecraft text component in string form.
 * @param {string} json - A text component string, such as the chat packet's "message" property.
 * @returns {object} Parsed message in { raw, clean, ansi } form.
 */
function parseText (json) {
  const parsed = JSON.parse(json)

  let raw = parseJson(parsed, { color: 'reset' })
  if (raw.startsWith('§r')) {
    raw = raw.substring(2)
  }
  const clean = raw.replace(/§[a-f0-9rlonmk]/g, '').replace(/§/g, '')
  const ansi = raw.replace(/§[a-f0-9rlonmk]/g, (m) => {
    return ansimap[m]
  })
  return { raw, clean, ansi }
}

/**
 * Parses a native minecraft text component in JSON form.
 * @param {object} json - The json message.
 * @param {object} parent - The parent json.
 * @returns {string} The parsed raw string.
 */
function parseJson (json, parent) {
  if (typeof json === 'string') {
    json = { text: json }
  }

  json.color = json.color || parent.color
  json.bold = json.bold || parent.bold
  json.italic = json.italic || parent.italic
  json.underlined = json.underlined || parent.underlined
  json.strikethrough = json.strikethrough || parent.strikethrough
  json.obfuscated = json.obfuscated || parent.obfuscated

  let raw = ''
  raw += colormap[json.color] || ''
  if (json.bold) { raw += '§l' }
  if (json.italic) { raw += '§o' }
  if (json.underlined) { raw += '§n' }
  if (json.strikethrough) { raw += '§m' }
  if (json.obfuscated) { raw += '§k' }
  if (json.text) {
    raw += json.text
  }
  if (json.translate) { // I checked with the native minecraft code. This is how Minecraft does the matching and group indexing. -hhhzzzsss
    if (language[json.translate]) {
      const _with = json.with || []
      let i = 0
      raw += language[json.translate].replace(/%(?:(\\d+)\\$)?(s|%)/g, (g0, g1) => {
        if (g0 === '%%') {
          return '%'
        } else {
          const idx = g1 ? parseInt(g1) : i++
          if (_with[idx]) {
            return parseJson(_with[idx], json)
          } else {
            return ''
          }
        }
      })
    } else {
      raw += json.translate
    }
  }
  if (json.extra) {
    json.extra.forEach(function (extra) {
      raw += parseJson(extra, json)
    })
  }
  return raw
}

module.exports = parseText
