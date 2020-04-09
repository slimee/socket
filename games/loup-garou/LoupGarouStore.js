const shuffle = require('../../util/shuffle')
const { isBad, isGood } = require('./roles')
const GameStore = require('../GameStore')

module.exports = class LoupGarouStore extends GameStore {
  constructor(superConfig, roles) {
    super(superConfig)
    this.state.roles = roles
    this.state.phase = 'created'
  }

  shuffleRoles() {
    this.state.roles = shuffle(this.state.roles)
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

  countByRole(role) {
    return this.getPlayersByRole(role).length
  }

  isPlayerRole(player, role) {
    return this.getPlayerRole(player) === role
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

  live(player) {
    this.getPlayer(player).alive = true
  }

  aTeamIsDead() {
    const goodPlayersAlive = this.state.players.filter(player => this.isAlive(player) && isGood(player.role))
    const badPlayersAlive = this.state.players.filter(player => this.isAlive(player) && isBad(player.role))
    return goodPlayersAlive.length === 0 || badPlayersAlive.length === 0
  }
}