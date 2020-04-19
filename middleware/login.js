const GlobalState = require('../GlobalStore')

module.exports = class Login {
  constructor(store) {
    this.store = store
  }

  async listenLoginDisconnect(client) {

    await client.when('login', async user => {
      if (!GlobalState.isUser(user)) return 'not a user'
      if (this.store.getUser(user)) return 'user already in store'
      client.setUser(user)
      this.store.addClient(client)
      return `Welcome, ${client.getUser().name}!`
    })

    client.when('disconnect', () => {
      this.store.removeClient(client)
    })
  }
}
