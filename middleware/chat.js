let id = 0
module.exports = client => {

  client.when('typing', () => {
    client.broadcast('typing', client.getUser())
  })

  client.when('stop typing', () => {
    client.broadcast('stop typing', client.getUser())
  })

  client.when('new message', async (content) => {
    if (!client.getUser()) return '!client.getUser()'
    const message = {
      id: id++,
      player: client.getUser(),
      content,
    }
    await client.broadcast('new message', message)
    await client.emit('new message', message)
    return 'message sent to all.'
  })

}