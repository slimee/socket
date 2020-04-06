const GlobalState = require('../GlobalStore')

module.exports = (client, store) => {
  client.when('login', user => {
    if (!GlobalState.isUser(user)) return
    if (store.getUser(user)) return
    client.setUser(user)
    store.addUser(user)
    client.broadcast('user login', user)
    return { users: store.getUsers() }
  })
  client.when('disconnect', () => {
    if (store.removeUser(client.getUser()))
      client.broadcast('user logout', client.getUser())
  })
}