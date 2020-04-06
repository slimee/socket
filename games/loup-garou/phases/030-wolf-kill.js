const { Roles } = require('../roles')

module.exports = class WolfKill {
  constructor({ store, next, broadcast }) {
    this.store = store
    this.next = next
    this.broadcast = broadcast
    this.name = 'wolf kill'
    this.events = ['wolf kill', 'witch save']
    this.wolfes = this.store.getPlayersByRole(Roles.LoupGarou)
    this.toSave = null
    this.wolfesVotes = {}
  }

  async ['witch save'](client, victim) {
    const witch = client.getUser()
    if (!this.store.isPlayerRole(witch, Roles.Sorciere)) return
    if (!this.store.isAlive(witch)) return
    if (!this.store.isKillable(victim)) return

    this.toSave = victim
    this.checkEnd()
  }

  async ['wolf kill'](client, victim) {
    const wolf = client.getUser()
    if (!this.store.isPlayerRole(wolf, Roles.LoupGarou)) return
    if (!this.store.isAlive(wolf)) return
    if (!this.store.isKillable(victim)) return

    this.wolfesVotes[wolf.id] = victim.id
    return this.checkEnd()
  }

  witchVoted() {
    return !this.store.hasRole(Roles.Sorciere) || this.toSave
  }

  wolfesVoted() {
    return this.wolfes.length === Object.keys(this.wolfesVotes)
  }

  getVictim() {
    const distinctVotes = new Set(Object.values(this.wolfesVotes))
    if (distinctVotes.size !== 1) return
    return distinctVotes.keys()[0]
  }

  checkEnd() {
    if (this.witchVoted() && this.wolfesVoted()) {
      if (this.getVictim().id === this.toSave.id) return this.save()
      return this.kill()
    }
  }

  async save() {
    this.broadcast('witch saved', this.toSave)
  }

  async kill() {
    const victim = this.getVictim()
    this.store.kill(victim)
    await this.broadcast(this.store.getId(), 'wolf kill', victim)
  }
}