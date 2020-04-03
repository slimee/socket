const LoupGarou = require('../games/loup-garou/LoupGarou')

module.exports = (client, store) => {

  client.when('create game', async (config) => {
    if (!client.user) return
    const game = new LoupGarou(client.emit, config)
    store.addGame(game)
    client.join(game.id)
    await game.next()
  })

  client.when('list games', () => ({ games: store.getGames() }))

  client.when('join game', async (gameDTO) => {
    const game = store.getGame(gameDTO)
    if (game) {
      client.join(game.id)
      client.emitTo(game.host.id, 'join request', game)
    }
  })

  client.when('join request response', ({ game: gameDTO, player: playerDTO, accept }) => {
    const game = store.getGame(gameDTO)
    const player = store.getPlayer(playerDTO)
    if (!game) return 'invalid game'
    if (!player) return 'invalid player'

    // if (accept) player.client.emit('join request response', game)
    // else player.client.emit('join request response', { id: game.id }, accept)
  })
}