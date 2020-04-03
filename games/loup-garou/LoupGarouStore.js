const { isBad, isGood } = require('./roles')

module.exports = class LoupGarouStore {
  constructor() {
    this.initState()
  }

  initState() {
    this.state = {
      players: [],
    }
  }

  addPlayer(player) {
    if (this.getPlayer(player)) return
    this.state.players.push(player)
    return player
  }

  getPlayer(player) {
    return LoupGarouStore.isPlayer(player)
      && this.state.players.find(({ id }) => player.id === id)
  }

  getPlayersCount() {
    return this.state.players.length
  }

  assignRoles(playerIndex, role) {
    this.state.players[playerIndex].role = role
  }

  static isPlayer({ id, name }) {
    return id && name
  }

  isInPlayers(player) {
    return !!this.getPlayer(player)
  }

  isPlayerRole(player, role) {
    return this.isInPlayers(player)
      && this.getPlayer(player).role === role
  }

  isAlive(player) {
    return this.isInPlayers(player)
      && this.getPlayer(player).alive
  }

  isKillable(player) {
    return this.isAlive(player)
  }

  kill(player) {
    this.getPlayer(player).alive = false
  }

  aTeamIsDead() {
    const goodPlayersAlive = this.state.players.filter(player => this.isAlive(player) && isGood(player.role))
    const badPlayersAlive = this.state.players.filter(player => this.isAlive(player) && isBad(player.role))
    return goodPlayersAlive.length === 0 || badPlayersAlive.length === 0
  }
}