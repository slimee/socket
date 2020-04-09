module.exports = class PlayerReady {
  constructor({ store, next }) {
    this.store = store
    this.next = next
    this.name = 'player ready'
    this.readyPlayers = []
  }

  async run(client) {
    const player = client.getUser()
    if (!this.store.isInPlayers(player)) return { error: 'not in players' }
    if (this.readyPlayers.find(readyPlayer => readyPlayer.id === player.id)) return { error: 'already ready' }

    this.readyPlayers.push(player)
    await client.emitTo(this.store.getId(), 'player ready', player)

    if (this.readyPlayers.length === this.store.getPlayersCount()) await this.next()
  }
}