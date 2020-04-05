module.exports = class PlayerJoin {
  contructor({ store, emit, next }, roles) {
    this.store = store
    this.next = next
    this.name = 'end game'
    this.roles = roles
    this.emitEndGame = () => emit(this.name, this.store)
  }

  start() {
    if (this.store.aTeamIsDead()) {
      this.emitEndGame()
      this.next()
    }
    this.next()
  }
}