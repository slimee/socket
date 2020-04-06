const Middleware = require('../../middleware')
const ClientMock = require('./client.mock')

module.exports = playerCount => {
  const middleware = new Middleware()
  const mocks = []
  for (let i = 0; i < playerCount; i++) {
    const mock = new ClientMock()
    middleware.whenConnect(mock.client)
    mocks.push(mock)
  }
  return {
    hostPlayer: mocks[0],
    player1: mocks[0],
    player2: mocks[1],
    player3: mocks[2],
    middleware,
    mocks,
    globalState: middleware.store.state,
    gameState: () => middleware.store.state.games[0] && middleware.store.state.games[0].store.state,
    startRecordOutput: () => {
      for (let i = 0; i < mocks.length; i++) {
        mocks[i].broadcasts.length = 0
        mocks[i].emits.length = 0
        mocks[i].emitsTo.length = 0
        mocks[i].joins.length = 0
      }
    },
  }
}
