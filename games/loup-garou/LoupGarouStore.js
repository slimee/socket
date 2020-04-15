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

  setPlayerRole(player, role) {
    if (!this.isInPlayers(player)) return
    this.state.roles[this.getPlayerIndex(player)] = role
  }

  hasRole(role) {
    return this.getPlayersByRole(role).length > 0
  }

  getPlayersByRole(role) {
    return this.getPlayers().filter(player => this.getPlayerRole(player) === role)
  }

  hasRoleFilter(role, player) {
    return this.getPlayerRole(player) === role
  }

  isAliveFilter(player){
    return this.isAlive(player)
  }

  getAlivesByRole(role) {
    return this.getPlayersByRole(role).filter((p) => this.isAlive(p))
  }

  countAlivesByRole(role) {
    return this.getAlivesByRole((role)).length
  }

  isPlayerRole(player, role) {
    return this.getPlayerRole(player) === role
  }

  isAlive(player) {
    return this.isInPlayers(player) && this.getPlayer(player).alive
  }

  countAlives() {
    return this.getPlayers().filter((p) => this.isAlive(p)).length
  }

  isKillable(player) {
    return this.isAlive(player)
  }

  live(player) {
    this.getPlayer(player).alive = true
  }

  aTeamIsDead() {
    if (this.getPlayers().length === 0) return false
    const goodPlayersAlive = this.getPlayers().filter(player => this.isAlive(player) && isGood(this.getPlayerRole(player)))
    const badPlayersAlive = this.getPlayers().filter(player => this.isAlive(player) && isBad(this.getPlayerRole(player)))
    return goodPlayersAlive.length === 0 || badPlayersAlive.length === 0
  }

  getEndGamePayload() {
    return this.state
  }

  getPlayers() {
    return this.state.players
  }

  getPlayerById(idToFind) {
    return this.getPlayers().find(({ id }) => id === idToFind)
  }

  swapRoles(player1, player2) {
    if (!this.isInPlayers(player1)) return
    if (!this.isInPlayers(player2)) return
    const player1Role = this.getPlayerRole(player1)
    const player2Role = this.getPlayerRole(player2)
    this.setPlayerRole(player1, player2Role)
    this.setPlayerRole(player2, player1Role)
  }

  setWolfVictim(victim) {
    this.state.wolfWitchPhase = { victim }
  }

  clearWolfVictim() {
    this.state.wolfWitchPhase = null
  }

  getWolfVictim() {
    return this.state.wolfWitchPhase.victim
  }

  witchSaveVictim(isSaved) {
    this.state.wolfWitchPhase = { ...this.state.wolfWitchPhase, isSaved }
  }

  killWolfVictim() {
    this.getPlayer(this.getWolfVictim()).alive = false
    this.clearWolfVictim()
  }

  saveWolfVictim() {
    this.clearWolfVictim()
  }
}