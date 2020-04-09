const GlobalStore = require('../../GlobalStore')
const Middleware = require('../../middleware')
const ClientMock = require('./client.mock')

const makeMiddlewareMock = playerCount => {
  const globalStore = new GlobalStore()
  const middleware = new Middleware(globalStore)
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
    player4: mocks[3],
    middleware,
    mocks,
    globalState: globalStore.state,
    globalStore,
    gameStore: (gameIdx = 0) => globalStore.state.games[gameIdx].store,
    gameState: (gameIdx = 0) => globalStore.state.games[gameIdx].store.state,
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

module.exports = {
  makeMiddlewareMock,
  simpleStart: async (roles, roleShuffle = false) => {
    !roleShuffle && (process.env.NO_ROLE_SHUFFLE = true)
    const { player1, player2, player3, player4, gameStore, ...rest } = makeMiddlewareMock(roles.length)

    const player1DTO = { id: 1, name: 'player1' }
    const player2DTO = { id: 2, name: 'player2' }
    const player3DTO = { id: 3, name: 'player3' }
    const player4DTO = { id: 4, name: 'player4' }
    await player1.send['login'](player1DTO)
    await player2.send['login'](player2DTO)
    await player3.send['login'](player3DTO)
    await player4.send['login'](player4DTO)

    await player1.send['create game']({ id: 'player1.game.id' }, { roles })

    await player1.send['join game']('player1.game.id')
    await player2.send['join game']('player1.game.id')
    await player3.send['join game']('player1.game.id')
    await player4.send['join game']('player1.game.id')

    await player1.send['player ready']()
    await player2.send['player ready']()
    await player3.send['player ready']()
    await player4.send['player ready']()

    !roleShuffle && (process.env.NO_ROLE_SHUFFLE = false)

    expect(gameStore().getRoles().slice().sort()).toEqual(roles.slice().sort())

    return {
      player1, player2, player3, player4,
      player1DTO, player2DTO, player3DTO, player4DTO,
      gameStore, ...rest,
    }
  },
}
