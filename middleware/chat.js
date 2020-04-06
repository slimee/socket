let id = 0
module.exports = client => {

  client.when('typing', () => client.getUser() && client.broadcast('typing', client.getUser()))

  client.when('new message', (content) => {
    if (!client.getUser()) return
    const message = {
      id: id++,
      player: client.getUser(),
      content,
    }
    client.broadcast('new message', message)
  })

  client.when('stop typing', () => client.getUser() && client.broadcast('stop typing', client.getUser()))
}