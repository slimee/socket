const uuid = require('../services/uuid')

module.exports = class GameStore {
  constructor({ id = uuid(), name, host }) {
    this.initState({ id, name: name || id, host })
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

  getPlayer(player) {
    return this.state.players.find(({ id }) => player.id === id)
  }

  getPlayerIndex(playerId) {
    return this.state.players.findIndex(({ id }) => playerId === id)
  }

  getPlayersCount() {
    return this.state.players.length
  }
}