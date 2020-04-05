const uuid = require('../../services/uuid')
const CheckEndGame = require('../loup-garou/phases/00-check-end-game')
const PlayerJoin = require('../loup-garou/phases/01-player-join')
const PlayerReady = require('../loup-garou/phases/02-player-ready')
const WolfKill = require('../loup-garou/phases/03-wolf-kill')
const LoupGarouStore = require('./LoupGarouStore')

module.exports = class LoupGarou {
  constructor(
    client, { id = uuid(), name, host },
    roles = ['LG', 'LG', 'Vil', 'Vil', 'Voy', 'Vol', 'Sor']) {
    this.client = client
    this.store = new LoupGarouStore({ id, name, host }, roles)
    this.playerJoin = this.makePhase(PlayerJoin)
    this.phases = [
      this.playerJoin,
      this.makePhase(PlayerReady),
      this.makePhase(WolfKill),
      this.makePhase(CheckEndGame),
    ]
    this.phaseIndex = -1
    this.phase = null
  }

  makePhase(phaseClass, ...params) {
    const phase = new phaseClass({
      emit: this.client.emit,
      emitTo: this.client.emitTo,
      broadcast: this.client.broadcast,
      store: this.store,
      next: this.next,
    }, ...params)
    if (phase.name) this.client.when(
      phase.name,
      (...params) => this.run(phase.name, this.client.getUser(), ...params),
    )
    return phase
  }

  addPlayer(player) {
    return this.playerJoin.run(player)
  }

  async next() {
    this.phaseIndex++
    this.phase = this.phases[this.phaseIndex]
    this.phase.start && await this.phase.start()
    await this.client.emit(`enter: ${this.phase.name}`, this.store.state)
  }

  run(event, player, ...params) {
    if(!this.phase){
      console.log(`run(${event}, ${player.name}) but no phase.`)
      return
    }
    if (event !== this.phase.name) return
    return this.phase.run(player, ...params)
  }

  getId() {
    return this.store.getId()
  }

  getName() {
    return this.store.getName()
  }

  getHost() {
    return this.store.getHost()
  }

  getStore() {
    return this.store
  }
}