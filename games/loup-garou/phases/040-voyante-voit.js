const { Roles } = require('../roles')

module.exports = class WolfKill {
  constructor({ store, next, sayToRoom }) {
    this.store = store
    this.next = next
    this.name = 'voyante voit'
    this.sayToRoom = sayToRoom
  }

  start() {
    this.voyantesVotes = {}
  }

  async run(client, player) {
    const voyante = client.getUser()
    if (this.voyantesVotes[voyante.id]) return { error: `${voyante.name} already played` }
    if (!this.store.isAlive(voyante)) return { error: `${voyante.name} want play but is not alive` }
    if (!this.store.isPlayerRole(voyante, Roles.Voyante)) return { error: `${voyante.name} is not ${Roles.Voyante}` }
    if (!this.store.isAlive(player)) return { error: `${voyante.name} want to see dead ${player.name}` }
    const role = this.store.getPlayerRole(player)
    this.voyantesVotes[voyante.id] = player
    await this.checkEnd()
    return { role }
  }


  checkEnd() {
    if (this.voyantesVoted()) return this.end()
  }

  async end() {
    await this.sayToRoom('voyante a vu')
    setTimeout(this.next, 5000)
  }

  voyantesVoted() {
    return this.store.countAlivesByRole(Roles.Voyante) === this.voyantesVotesCount()
  }

  voyantesVotesCount() {
    return Object.keys(this.voyantesVotes).length
  }
}