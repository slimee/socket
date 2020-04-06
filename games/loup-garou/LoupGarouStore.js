const { isBad, isGood } = require('./roles')
const GameStore = require('../GameStore')

module.exports = class LoupGarouStore extends GameStore {
  constructor(idNameHost, roles) {
    super(idNameHost)
    this.state.roles = Object.freeze(roles)
    this.state.phase = 'created'
  }

  setPhase(value) {
    this.state.phase = value
  }

  getRoles() {
    return this.state.roles
  }

  getPlayerRole(player) {
    if (!this.isInPlayers(player)) return
    return this.state.roles[this.getPlayerIndex(player)]
  }

  hasRole(role) {
    return this.getPlayersByRole(role).length > 0
  }

  getPlayersByRole(role) {
    return this.state.players.filter(player => this.getPlayerRole(player) === role)
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