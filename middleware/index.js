const GlobalStore = require('../GlobalStore')
const Login = require('./login')
const chat = require('./chat')
const game = require('./game')

module.exports = class Middleware {
  constructor(store = new GlobalStore()) {
    this.store = store
    this.login = new Login(this.store)
  }

  async whenConnect(client) {
    await this.login.listenLoginDisconnect(client)
    await chat(client, this.store)
    await game(client, this.store)
  }
}
