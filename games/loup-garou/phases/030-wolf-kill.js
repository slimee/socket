const { Roles } = require('../roles')

module.exports = class WolfKill {
  constructor({ store, next, sayToRoom }) {
    this.store = store
    this.next = next
    this.sayToRoom = sayToRoom
    this.name = 'wolf kill'
    this.wolfesVotes = {}
  }

  start() {
    this.wolfesVotes = {}
  }

  async ['wolf kill'](client, victim) {
    const wolf = client.getUser()
    if (!this.store.isPlayerRole(wolf, Roles.LoupGarou)) return `${wolf.name} is not ${Roles.LoupGarou}`
    if (!this.store.isAlive(wolf)) return `${wolf.name} want play but is not alive`
    if (!this.store.isKillable(victim)) return `${wolf.name} want to kill already dead ${victim.name}`

    this.wolfesVotes[wolf.id] = victim
    return this.checkEnd()
  }

  wolfesVoted() {
    return this.store.countAlivesByRole(Roles.LoupGarou) === this.wolfesVotesCount()
  }

  wolfesVotesCount() {
    return Object.keys(this.wolfesVotes).length
  }

  getVictim() {
    const distinctVotes = new Set(Object.values(this.wolfesVotes))
    if (distinctVotes.size !== 1) return
    return distinctVotes.values().next().value
  }

  voteUnanim() {
    return !!this.getVictim()
  }

  async checkEnd() {
    if (this.wolfesVoted() && this.voteUnanim()) {
      await this.fixWolfvictim()
      await this.next()
    }
    return 'wait votes'
  }

  async fixWolfvictim() {
    const victim = this.getVictim()
    this.store.setWolfVictim(victim)
    await this.sayToRoom('wolf kill', victim)
  }
}