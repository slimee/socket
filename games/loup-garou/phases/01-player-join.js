const shuffle = require('../../../util/shuffle')

module.exports = class PlayerJoin {
  constructor({ store, emit, next }, roles) {
    this.store = store
    this.next = next
    this.roles = shuffle(roles.slice())
    this.name = 'player join'
    this.emitPlayerJoin = player => {
      return emit(this.name, player)
    }
  }

  init(){

  }

  async run(player) {
    if (!PlayerJoin.isPlayer(player) || !this.canAddPlayer()) return

    this.store.addPlayer(player)
    await this.emitPlayerJoin(player)

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