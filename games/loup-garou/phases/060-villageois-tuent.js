const { Roles } = require('../roles')

module.exports = class WolfKill {
  constructor({ store, next, sayToRoom }) {
    this.store = store
    this.next = next
    this.sayToRoom = sayToRoom
    this.name = 'villageois tuent'
  }

  start() {
    this.villageoisVotes = {}
    this.phaseChrono = 1
  }

  async ['villageois tuent'](client, victim) {
    const villageois = client.getUser()
    if (!this.store.isAlive(villageois)) return `${villageois.name} want play but is not alive`
    if (!this.store.isKillable(victim)) return `${villageois.name} want to save dead ${victim.name}`
    this.villageoisVotes[villageois.id] = victim.id
    await this.checkEnd()
  }

  async checkEnd() {
    if (this.villageoisVoted() && this.phaseChrono--) {
      await this.sayToRoom('villageois voted')
      setTimeout(this.end, 30000)
    }
  }

  async end() {
    await this.sayToRoom({ deaths: this.getVictims() })
    await this.next()
  }

  getVictims() {
    const votes = Object.values(this.villageoisVotes)

    const votesGrouped = votes.reduce((votesGrouped, vote) => {
      const existingVote = votesGrouped.find(v => v.id = vote)
      if (existingVote) existingVote.count++
      else votesGrouped.push({ id: vote, count: 1 })
    }, [])
      .sort((a, b) => a.count > b.count)

    const maxCount = votesGrouped[0].count

    return votesGrouped
      .filter(v => v.count === maxCount)
      .map(({ id }) => this.store.getPlayerById(id))
  }

  villageoisVoted() {
    return this.store.countAlives() === this.voleursVotesCount()
  }
}