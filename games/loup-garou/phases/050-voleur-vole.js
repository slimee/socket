const { Roles } = require('../roles')

module.exports = class WolfKill {
  constructor({ store, next }) {
    this.store = store
    this.next = next
    this.name = 'voleur vole'
  }

  start() {
    this.voleursVotes = {}
  }

  async ['voleur vole'](client, victim) {
    const voleur = client.getUser()
    if (!this.store.isPlayerRole(voleur, Roles.Voleur)) return `${voleur.name} is not ${Roles.Voleur}`
    if (!this.store.isAlive(voleur)) return `${voleur.name} want play but is not alive`
    if (!this.store.isAlive(victim)) return `${voleur.name} want to steal dead ${victim.name}`
    this.store.swapRoles(voleur, victim)
    this.voleursVotes[voleur.id] = victim
    this.checkEnd()
    return this.store.getPlayerRole(voleur)
  }

  checkEnd() {
    if (this.voleursVoted()) setTimeout(this.next, 5000)
  }

  voleursVoted() {
    return this.store.countAlivesByRole(Roles.Voyante) === this.voleursVotesCount()
  }

  voleursVotesCount() {
    return Object.keys(this.voleursVotes).length
  }
}