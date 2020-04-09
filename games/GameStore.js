const uuid = require('../services/uuid')

module.exports = class GameStore {
  constructor({ id = uuid(), name, host, globalStore }) {
    this.initState({ id, name: name || id, host })
    this.globalStore = globalStore
  }

  initState(initial) {
    this.state = {
      ...initial,
      players: [],
    }
  }

  getId() {
    return this.state.id
  }

  getName() {
    return this.state.name
  }

  getHost() {
    return this.state.host
  }

  static isPlayer({ id, name }) {
    return id && name
  }

  isInPlayers(player) {
    return !!this.getPlayer(player)
  }

  addPlayer(player) {
    if (this.getPlayer(player)) return
    this.state.players.push(player)
    return player
  }

  getPlayers() {
    return this.state.players
  }

  getPlayer(player) {
    return this.state.players.find(({ id }) => player.id === id)
  }

  getPlayerClient(player) {
    return this.globalStore.getPlayerClient(player)
  }

  getPlayerIndex(player) {
    return this.state.players.findIndex(({ id }) => player.id === id)
  }

  getPlayersCount() {
    return this.state.players.length
  }
}