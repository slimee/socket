const { Roles } = require('../roles')

module.exports = class WolfKill {
  constructor({ store, next, sayToRoom }) {
    this.store = store
    this.next = next
    this.name = 'voleur vole'
    this.sayToRoom = sayToRoom
  }

  start() {
    this.ended = false
    this.voleursVotes = {}
  }

  async ['voleur vole'](client, victim) {
    if (this.ended) return
    const voleur = client.getUser()
    if (!this.store.isPlayerRole(voleur, Roles.Voleur)) return `${voleur.name} is not ${Roles.Voleur}`
    if (!this.store.isAlive(voleur)) return `${voleur.name} want play but is not alive`
    if (!this.store.isAlive(victim)) return `${voleur.name} want to steal dead ${victim.name}`

    this.store.swapRoles(voleur, victim)
    this.voleursVotes[voleur.id] = victim
    await this.checkEnd()
    return this.store.getPlayerRole(voleur)
  }

  async checkEnd() {
    if (this.voleursVoted()) {
      await this.sayToRoom('voleur ont volé')
      setTimeout(this.end, 5000)
    }
  }

  async end() {
    this.ended = true
    await Promise.all(
      Object
        .values(this.voleursVotes)
        .map(victim => this.informRole(victim)),
    )
    return this.next()
  }

  voleursVoted() {
    return this.store.countAlivesByRole(Roles.Voyante) === this.voleursVotesCount()
  }

  voleursVotesCount() {
    return Object.keys(this.voleursVotes).length
  }

  informRole(player) {
    const client = this.store.getPlayerClient(player)
    const role = this.store.getPlayerRole(player)
    return client.emit('player role', role)
  }
}