const shuffle = require('../../../util/shuffle')

module.exports = class PlayerJoin {
  constructor({ store, emitTo, next }) {
    this.store = store
    this.next = next
    this.roles = shuffle(this.store.getRoles().slice())
    this.name = 'join game'
    this.emitJoin = player => {
      return emitTo(this.store.getId(), this.name, player)
    }
  }

  async run(player) {
    if (!PlayerJoin.isPlayer(player) || !this.canAddPlayer()) return

    this.store.addPlayer(player)
    await this.emitJoin(player)

    if (!this.canAddPlayer()) {
      this.assignRoles()
      await this.next()
    }
  }

  canAddPlayer() {
    return this.store.getPlayersCount() < this.roles.length
  }

  static isPlayer({ id, name }) {
    return id && name
  }

  assignRoles() {
    for (let i = 0; i < this.store.getPlayersCount(); i++) {
      this.store.assignRoles(i, this.roles.pop())
    }
  }
}