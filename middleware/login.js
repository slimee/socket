const GlobalState = require('../GlobalStore')

module.exports = class Login {
  constructor(store){
    this.store = store
  }
  listenLoginDisconnect(client) {
    client.when('login', user => {
      if (!GlobalState.isUser(user)) return
      if (this.store.getUser(user)) return
      client.setUser(user)
      this.store.addClient(client)
      client.broadcast('user login', user)
      return { users: this.store.getUsers() }
    })
    client.when('disconnect', () => {
      if (this.store.removeClient(client))
        client.broadcast('user logout', client.getUser())
    })
  }
}
