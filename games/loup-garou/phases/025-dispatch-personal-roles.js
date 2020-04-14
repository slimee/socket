module.exports = class PlayerReady {
  constructor({ store, next }) {
    this.store = store
    this.next = next
    this.name = 'dispatch personal roles'
  }

  async start() {
    const players = this.store.getPlayers()
    !process.env.NO_ROLE_SHUFFLE && this.store.shuffleRoles()
    await Promise.all(players.map(player => {
      this.store.live(player)
      this.informRole(player)
    }))
    await this.next()
    this.store.setPlaying(true)
  }

  informRole(player) {
    const client = this.store.getPlayerClient(player)
    const role = this.store.getPlayerRole(player)
    return client.emit('player role', role)
  }

}
