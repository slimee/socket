module.exports = class WolfKill {
  contructor({ store, emit, next }) {
    this.store = store
    this.next = next
    this.name = 'player ready'
    this.emitPlayerJoin = player => emit(this.name, player)
  }

  canAddPlayer() {
    return this.store.getPlayersCount() < this.roles.length
  }

  async run(player) {
    if (this.store.isInPlayers(player)) return

    this.store.addPlayer(player)
    await this.emitPlayerJoin(player)

    if (!this.canAddPlayer()) {
      await this.next()
    }
  }
}