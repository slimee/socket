const GlobalState = require('../GlobalStore')

module.exports = (client, store) => {
  client.when('login', user => {
    if (!GlobalState.isUser(user)) return
    if (store.getUser(user)) return
    client.setUser(user)
    store.addUser(user)
    client.broadcast('user joined', user)
    return { users: store.getUsers() }
  })
  client.when('disconnect', () => {
    if (store.removeUser(client.user))
      client.broadcast('user left', client.user)
  })
}