const { exec } = require('child_process')
const util = require('util')
const execAsync = util.promisify(exec)

module.exports = {
  name: 'version',
  async minecraft (handler) {
    const version = await execAsync('git rev-list --count HEAD')
    const lastUpdate = await execAsync('git log -1  --pretty=%B')

    if (version.stderr) throw new Error(version.stderr)
    if (lastUpdate.stderr) throw new Error(lastUpdate.stderr)

    handler.sendMessage([
      {
        text: 'Current Version: ',
        color: 'white'
      },
      {
        text: 'YBOT ',
        color: 'yellow'
      },
      {
        text: version.stdout,
        color: 'green'
      },
      {
        text: 'Last Update: ',
        color: 'white'
      },
      {
        text: lastUpdate.stdout,
        color: 'blue'
      }
    ])
  }
}
