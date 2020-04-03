let id = 0
module.exports = client => {

  client.when('typing', () => client.user && client.broadcast('typing', client.user))

  client.when('new message', (content) => {
    if (!client.user) return
    const message = {
      id: id++,
      player: client.user,
      content,
    }
    client.emit('new message', message)
    client.broadcast('new message', message)
  })

  client.when('stop typing', () => client.user && client.broadcast('stop typing', client.user))
}