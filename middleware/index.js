const GlobalStore = require('../GlobalStore')
const login = require('./login')
const chat = require('./chat')
const game = require('./game')

module.exports = class Middleware {
  constructor(store = new GlobalStore()) {
    this.store = store
  }

  whenConnect(client) {
    login(client, this.store)
    chat(client, this.store)
    game(client, this.store)
  }
}