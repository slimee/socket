const PlayerJoin = require('../loup-garou/phases/010-player-join')
const PlayerReady = require('../loup-garou/phases/020-player-ready')
const DispatchPersonalRoles = require('../loup-garou/phases/025-dispatch-personal-roles')
const WolfKill = require('../loup-garou/phases/030-wolf-kill')
const WitchSave = require('../loup-garou/phases/035-witch-save')
const VoyanteVoit = require('../loup-garou/phases/040-voyante-voit')
const VoleurVole = require('../loup-garou/phases/050-voleur-vole')
const VillageoisTuent = require('../loup-garou/phases/060-villageois-tuent')
const LoupGarouStore = require('./LoupGarouStore')

module.exports = class LoupGarou {
  constructor(
    hostClient,
    gameStoreConfig,
    { roles = ['LG', 'LG', 'Vil', 'Vil', 'Voy', 'Vol', 'Sor'] },
  ) {
    this.hostClient = hostClient
    this.store = new LoupGarouStore(gameStoreConfig, roles)
    this.playerJoin = this.makePhase(PlayerJoin)
    this.phases = [
      this.playerJoin,
      this.makePhase(PlayerReady),
      this.makePhase(DispatchPersonalRoles),
      this.makePhase(WolfKill),
      this.makePhase(WitchSave),
      this.makePhase(VoyanteVoit),
      this.makePhase(VoleurVole),
      this.makePhase(VillageoisTuent),
    ]
    this.wolfKillPhaseIndex = 3
    this.phaseIndex = -1
    this.phase = null
  }

  makePhase(phaseClass, ...params) {
    return new phaseClass({
      store: this.store,
      sayToRoom: (...payload) => this.hostClient.emitTo(this.getId(), ...payload),
      sayToRole: (role, event, ...payload) => this.sayToRole(role, event, ...payload),
      next: () => this.next(),
    }, ...params)
  }

  sayToRole(role, event, ...payload) {
    const aliveAndRole = (player) =>
      this.store.hasRoleFilter(role, player)
      && this.store.isAlive(player)
    return this.sayTo(aliveAndRole, event, ...payload)
  }

  sayTo(filter, event, ...payload) {
    const players = this.store.getPlayers().filter(filter)
    return Promise.all(players.map(player => {
      const client = this.store.getPlayerClient(player)
      return client.emit(event, ...payload)
    }))
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
    return this.playerJoin['join game'](client)
  }

  run(phaseEvent, client, ...params) {
    if (!this.phase) {
      console.log(`invalid run(${phaseEvent}, ${client.getUser().name}) but no phase.`)
      return
    }
    if (this.phase.events && this.phase.events.includes(phaseEvent)) return this.phase[phaseEvent](client, ...params)
    if (phaseEvent === this.phase.name) return this.phase.run(client, ...params)
    this.logInvalidRun(phaseEvent, client);
  }

  logInvalidRun(phaseEvent, client){
    const caller = client && client.getUser() && client.getUser().name;
    console.log(`invalid run(${phaseEvent}, ${caller}) in phase ${this.phase.name}`)
  }

  async next() {
    if (this.store.isPlaying() && this.store.aTeamIsDead()) await this.endGame()
    else await this.goToPhase(this.phaseIndex + 1)
  }

  async endGame() {
    await this.hostClient.emitTo(this.getId(), 'end game', this.store.getEndGamePayload())
    this.store.setPlaying(false)
    await this.goToPhase(1)
  }

  async goToPhase(index) {
    this.phaseIndex = index
    if (this.phaseIndex >= this.phases.length) await this.goToWolfKillPhase()
    this.phase = this.phases[this.phaseIndex]
    console.log("GO PHASE", this.phase.name);
    this.store.setPhase(this.phase.name)
    await this.hostClient.emitTo(this.getId(), `start phase: ${this.phase.name}`)
    this.phase.start && await this.phase.start()
  }

  goToWolfKillPhase() {
    return this.goToPhase(this.wolfKillPhaseIndex)
  }

  getId() {
    return this.store.getId()
  }

  getName() {
    return this.store.getName()
  }

  getState() {
    return this.store.state
  }
}
