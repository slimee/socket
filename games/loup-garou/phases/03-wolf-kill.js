const {Roles} = require('../roles')

module.exports = class WolfKill {
  contructor({ store, emit, next }) {
    this.store = store
    this.next = next
    this.name = 'wolf kill'
    this.emitWolfKill = (victim) => emit(this.name, victim)
  }

  async run(wolf, victim) {
    if (this.store.isPlayerRole(wolf, Roles.LoupGarou)
      && this.store.isAlive(wolf)
      && this.store.isKillable(victim)
    ) {
      this.store.kill(victim)
      this.emitWolfKill(victim)
    }
  }
}