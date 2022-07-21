function tellraw (sender, message) {
  return `tellraw ${sender} ${JSON.stringify(message)}`
}

module.exports = tellraw
