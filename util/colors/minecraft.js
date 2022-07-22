const styles = {
  bigint: '\xa76',
  boolean: '\xa76',
  date: '\xa75',
  module: '\xa7n',
  name: undefined,
  null: '\xa7l',
  number: '\xa76',
  regexp: '\xa74',
  special: '\xa73',
  string: '\xa72',
  symbol: '\xa72',
  undefined: '\xa78'
}

function stylize (str, styleType) {
  const style = styles[styleType]
  if (style !== undefined) return `${style}${str}\xa7r`
  return str
}

module.exports = { stylize, styles }
