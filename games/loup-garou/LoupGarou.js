const uuid = require('../../services/uuid')
const CheckEndGame = require('../loup-garou/phases/00-check-end-game')
const PlayerJoin = require('../loup-garou/phases/01-player-join')
const PlayerReady = require('../loup-garou/phases/02-player-ready')
const WolfKill = require('../loup-garou/phases/03-wolf-kill')
const LoupGarouStore = require('./LoupGarouStore')
const Loop = require('../../util/Loop')

module.exports = class LoupGarou {
  constructor(
    emit,
    {
      id = uuid(),
      roles = ['LG', 'LG', 'Vil', 'Vil', 'Voy', 'Vol', 'Sor'],
    },
  ) {
    this.id = id
    this.emit = emit
    this.store = new LoupGarouStore()
    this.phasesLoop = new Loop([
      this.makePhase(PlayerJoin, roles),
      this.makePhase(PlayerReady),
      new Loop([
        this.makePhase(WolfKill),
        this.makePhase(CheckEndGame),
      ]),
    ])
  }

  makePhase(phaseClass, ...params) {
    return new phaseClass({
      emit: this.emit,
      store: this.store,
      next: this.next,
    }, ...params)
  }

  run(event, player, payload) {
    if (!this.phase) throw new Error(`run(${event}) without phase`)
    if (event === this.phase.name) {
      return this.phase.run(player, payload)
    }
  }

  async next() {
    this.phase = this.phasesLoop.next()
    await this.phase.init()
    await this.emit(`enter: ${this.phase.name}`, this.store.state)
  }
}