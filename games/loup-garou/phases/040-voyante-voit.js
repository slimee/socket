const { Roles } = require('../roles')

module.exports = class WolfKill {
  constructor({ store, next }) {
    this.store = store
    this.next = next
    this.name = 'voyante voit'
  }

  start() {
    this.voyantesVotes = {}
  }

  async ['voyante voit'](client, player) {
    const voyante = client.getUser()
    if (!this.store.isPlayerRole(voyante, Roles.Voyante)) return `${voyante.name} is not ${Roles.Voyante}`
    if (!this.store.isAlive(voyante)) return `${voyante.name} want play but is not alive`
    if (!this.store.isAlive(player)) return `${voyante.name} want to see dead ${player.name}`
    const role = this.store.getPlayerRole(player)
    this.voyantesVotes[voyante.id] = player
    this.checkEnd()
    return role
  }

  checkEnd() {
    if (this.voyantesVoted()) setTimeout(this.next, 5000)
  }

  voyantesVoted() {
    return this.store.countAlivesByRole(Roles.Voyante) === this.voyantesVotesCount()
  }

  voyantesVotesCount() {
    return Object.keys(this.voyantesVotes).length
  }
}