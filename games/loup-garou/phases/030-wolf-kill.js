const { Roles } = require('../roles')

module.exports = class WolfKill {
  constructor({ store, next, sayToRoom }) {
    this.store = store
    this.next = next
    this.sayToRoom = sayToRoom
    this.name = 'wolf kill'
    this.events = ['wolf kill', 'witch save']
    this.toSave = null
  }

  start() {
    this.wolfesVotes = {}
  }

  async ['witch save'](client, victim) {
    const witch = client.getUser()
    if (!this.store.isPlayerRole(witch, Roles.Sorciere)) return `${witch.name} is not ${Roles.Sorciere}`
    if (!this.store.isAlive(witch)) return `${witch.name} want play but is not alive`
    if (!this.store.isKillable(victim)) return `${witch.name} want to save dead ${victim.name}`

    this.toSave = victim
    return this.checkEnd()
  }

  async ['wolf kill'](client, victim) {
    const wolf = client.getUser()
    if (!this.store.isPlayerRole(wolf, Roles.LoupGarou)) return `${wolf.name} is not ${Roles.LoupGarou}`
    if (!this.store.isAlive(wolf)) return `${wolf.name} want play but is not alive`
    if (!this.store.isKillable(victim)) return `${wolf.name} want to kill already dead ${victim.name}`

    this.wolfesVotes[wolf.id] = victim
    return this.checkEnd()
  }

  witchVoted() {
    return !this.store.hasRole(Roles.Sorciere) || this.toSave
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

  async checkEnd() {
    if (this.witchVoted() && this.wolfesVoted()) {
      if (this.getVictim().id === (this.toSave && this.toSave.id)) await this.save()
      else await this.kill()
      await this.next()
    }
    return 'wait votes'
  }

  async save() {
    await this.sayToRoom('witch saved', this.toSave)
  }

  async kill() {
    const victim = this.getVictim()
    this.store.kill(victim)
    await this.sayToRoom('wolf kill', victim)
  }
}