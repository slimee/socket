const GlobalStore = require('../GlobalStore')
const Login = require('./login')
const chat = require('./chat')
const game = require('./game')

module.exports = class Middleware {
  constructor(store = new GlobalStore()) {
    this.store = store
    this.login = new Login(this.store)
  }

  whenConnect(client) {
    this.login.listenLoginDisconnect(client)
    chat(client, this.store)
    game(client, this.store)
  }
}
