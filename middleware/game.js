const LoupGarou = require('../games/loup-garou/LoupGarou')

module.exports = (client, globalStore) => {

  client.when('create game', async ({ id, name }, config = {}) => {
    if (!client.getUser()) return
    const game = new LoupGarou(client, { id, name, host: client.getUser(), globalStore }, config)
    globalStore.addGame(game)
    await game.next()
    await client.broadcast('game created', { state: game.getState() })
  })

  client.when('list games', () => ({ games: globalStore.getGamesList() }))

  client.when('join game', async (gameId) => {
    const game = globalStore.getGame(gameId)
    if (!game) return
    await game.addPlayer(client)
    await client.join(gameId, client.getUser())
    return game
  })
}