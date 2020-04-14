const { Roles } = require('../roles')

module.exports = class WitchSave {
  constructor({ store, next, sayToRole }) {
    this.store = store
    this.next = next
    this.sayVictimToWitches = () => this.sayToRole(Roles.Sorciere, 'wolf victim', this.store.getWolfVictim())
    this.name = 'witch save'
    this.witchVotes = {}
  }

  async start() {
    this.witchVotes = {}
    await this.sayVictimToWitches()
  }

  async ['witch save'](client, save) {
    const witch = client.getUser()
    if (!this.store.isPlayerRole(witch, Roles.LoupGarou)) return `${witch.name} is not ${Roles.LoupGarou}`
    if (!this.store.isAlive(witch)) return `${witch.name} want play but is not alive`
    this.witchVotes[witch.id] = !!save && this.store.getWolfVictim()
    await this.checkEnd()
  }

  async checkEnd() {
    if (this.witchVoted() && this.voteUnanim()) {
      this.store.witchSaveVictim(this.getUniqueVote())
      await this.next()
    }
    return 'wait votes'
  }

  witchVoted() {
    return this.sorciereCount() === this.witchVotesCount()
  }

  sorciereCount() {
    return this.store.countAlivesByRole(Roles.Sorciere)
  }

  witchVotesCount() {
    return Object.keys(this.witchVotes).length
  }

  voteUnanim() {
    return !!this.getUniqueVote()
  }

  getUniqueVote() {
    const distinctVotes = new Set(Object.values(this.witchVotes))
    if (distinctVotes.size !== 1) return
    return distinctVotes.values().next().value
  }

}