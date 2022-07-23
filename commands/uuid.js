module.exports = {
  name: 'uuid',
  minecraft (handler) {
    handler.sendMessage([
      {
        text: 'Your uuid is: ',
        color: 'white'
      },
      {
        text: handler.sender,
        color: 'red'
      }
    ])
  }
}
