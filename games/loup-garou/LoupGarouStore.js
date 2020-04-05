const { isBad, isGood } = require('./roles')
const GameStore = require('../GameStore')

module.exports = class LoupGarouStore extends GameStore {
  constructor(idNameHost, roles) {
    super(idNameHost)
    this.state.roles = Object.freeze(roles)
  }

  getRoles() {
    return this.state.roles
  }

  assignRoles(playerIndex, role) {
    this.state.players[playerIndex].role = role
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