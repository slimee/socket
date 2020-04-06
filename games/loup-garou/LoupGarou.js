const uuid = require('../../services/uuid')
const CheckEndGame = require('../loup-garou/phases/000-check-end-game')
const PlayerJoin = require('../loup-garou/phases/010-player-join')
const PlayerReady = require('../loup-garou/phases/020-player-ready')
const DispatchPersonalRoles = require('../loup-garou/phases/025-dispatch-personal-roles')
const WolfKill = require('../loup-garou/phases/030-wolf-kill')
const LoupGarouStore = require('./LoupGarouStore')

module.exports = class LoupGarou {
  constructor(
    hostClient,
    { id = uuid(), name, host },
    { roles = ['LG', 'LG', 'Vil', 'Vil', 'Voy', 'Vol', 'Sor'] },
  ) {
    this.hostClient = hostClient
    this.store = new LoupGarouStore({ id, name, host }, roles)
    this.playerJoin = this.makePhase(PlayerJoin)
    this.phases = [
      this.playerJoin,
      this.makePhase(PlayerReady),
      this.makePhase(DispatchPersonalRoles),
      this.makePhase(WolfKill),
      this.makePhase(CheckEndGame),
    ]
    this.phaseIndex = -1
    this.phase = null
  }

  makePhase(phaseClass, ...params) {
    return new phaseClass({
      store: this.store,
      broadcast: () => this.hostClient.broadcast,
      next: () => this.next(),
    }, ...params)
  }

  addPlayer(client) {
    for (let phase of this.phases) {
      if (phase.events) {
        for (let event of phase.events) {
          client.when(event, (...params) => this.run(event, client, ...params))
        }
      } else {
        client.when(phase.name, (...params) => this.run(phase.name, client, ...params))
      }
    }
    return this.playerJoin.run(client)
  }

  run(event, client, ...params) {
    if (!this.phase) {
      console.log(`run(${event}, ${client.getUser().name}) but no phase.`)
      return
    }
    if (event === this.phase.name) return this.phase.run(client, ...params)
    if (this.phase.events && this.phase.events.includes(event)) return this.phase[event](client, ...params)
    console.log(`run ${event} !== ${this.phase.name} by ${client && client.getUser() && client.getUser().name}`)
  }

  async next() {
    this.phaseIndex++
    this.phase = this.phases[this.phaseIndex]
    await this.hostClient.emitTo(this.getId(), `start phase: ${this.phase.name}`, this.store.state)
    this.store.setPhase(this.phase.name)
    this.phase.start && await this.phase.start()
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
