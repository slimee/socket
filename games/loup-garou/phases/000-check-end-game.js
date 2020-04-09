module.exports = class CheckEndGame {
  constructor({ store, broadcast, next }, roles) {
    this.store = store
    this.next = next
    this.name = 'end game'
    this.roles = roles
    this.emitEndGame = () => broadcast(this.name, this.store.state)
  }

  start() {
    // if (this.store.aTeamIsDead()) {
    //   this.emitEndGame()
    //   this.next()
    // }
    // this.next()
  }
}