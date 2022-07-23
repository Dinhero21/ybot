const nbt = require('prismarine-nbt')

function parseUsername (username) {
  return username
    .replace(/§c/, '')
}

function UUIDToInt (uuid) {
  return nbt.intArray(uuid.replace(/-/g, '').match(/.{8}/g).map(string => Number.parseInt(string, 16)).map(number => number & 0x80000000 ? number - 0xffffffff - 1 : number))
}

module.exports = { parseUsername, UUIDToInt }
