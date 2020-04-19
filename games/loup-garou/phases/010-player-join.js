const shuffle = require('../../../util/shuffle')

module.exports = class PlayerJoin {
  constructor({ store, next }) {
    this.store = store
    this.next = next
    this.roles = shuffle(this.store.getRoles().slice())
    this.name = 'join game'
  }

  async run(client) {
    const player = client.getUser()
    if (!player) return { error: 'no player' }
    if (!PlayerJoin.isPlayer(player)) return { error: 'not a player' }
    if (!this.canAddPlayer()) return { error: 'can\'t add more player' }

    this.store.addPlayer(player)
    await client.emitTo(this.store.getId(), this.name, player)

    if (!this.canAddPlayer()) await this.next()
  }

  canAddPlayer() {
    return this.store.getPlayersCount() < this.roles.length
  }

  static isPlayer({ id, name }) {
    return id && name
  }
}