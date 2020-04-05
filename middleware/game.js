const LoupGarou = require('../games/loup-garou/LoupGarou')

module.exports = (client, globalStore) => {

  client.when('create game', async ({ id, name }) => {
    if (!client.user) return
    const game = new LoupGarou(client, { id, name, host: client.user })
    globalStore.addGame(game)
    await game.next()
  })

  client.when('list games', () => ({ games: globalStore.getGamesList() }))

  client.when('join game', async (gameId) => {
    const game = globalStore.getGame(gameId)
    if (!game) return
    await game.addPlayer(client.user)
    await client.join(gameId, client.user)
  })
}