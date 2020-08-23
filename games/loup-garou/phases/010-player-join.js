const shuffle = require('../../../util/shuffle')

module.exports = class PlayerJoin {
  constructor({ store, next }) {
    this.store = store
    this.next = next
    this.name = 'player join'
    this.roles = shuffle(this.store.getRoles().slice())
    this.events = ['join game', 'start game']
  }

  async ['join game'](client) {
    const player = client.getUser()
    if (!player) return { error: 'no player' }
    if (!PlayerJoin.isPlayer(player)) return { error: 'not a player' }
    if (!this.canAddPlayer()) return { error: 'can\'t add more player' }

    if (this.canAddPlayer()) {
      this.store.addPlayer(player)
      await client.emitTo(this.store.getId(), 'join game', player)
    } else {
      console.log('TODO: add spectator')
      await client.emitTo(this.store.getId(), 'game full', player)
    }
  }

  async ['start game'](client) {
    const player = client.getUser()
    if (!player) return { error: 'no player' }
    if (!PlayerJoin.isPlayer(player)) return { error: 'not a player' }
    await this.next()
  }

  canAddPlayer() {
    return this.store.getPlayersCount() < this.roles.length
  }

  static isPlayer({ id, name }) {
    return id && name
  }
}