const {makeMiddlewareMock} = require('./mock/middleware.mock')

describe('middleware', () => {
  describe('game', () => {
    test('create game without login', async () => {
      const { hostPlayer, globalState } = makeMiddlewareMock(1)

      await hostPlayer.send['create game']({ id: 'game.id' })

      expect(globalState.games).toHaveLength(0)
      expect(hostPlayer.output).toEqual({
          'joins': [],
          'emits': [],
          'emitsTo': [],
          'broadcasts': [],
        },
      )
    })
    test('create game', async () => {
      const { hostPlayer, globalState, gameState, startRecordOutput } = makeMiddlewareMock(1)

      await hostPlayer.send['login']({ id: 1, name: 'mario' })
      startRecordOutput()
      await hostPlayer.send['create game']({ id: 'game.id', name: 'table 6' })

      expect(globalState.games).toHaveLength(1)
      expect(gameState()).toEqual({
        'id': 'game.id', 'name': 'table 6',  'host': { 'id': 1, 'name': 'mario' },
        'phase': 'join game',
        'players': [],
        'roles': ['LG', 'LG', 'Vil', 'Vil', 'Voy', 'Vol', 'Sor'],
      })
      expect(hostPlayer.output).toEqual({
          broadcasts: [
            {
              event: 'game created',
              payload: {
                state: {
                  host: { 'id': 1, 'name': 'mario' },
                  id: 'game.id', name: 'table 6', phase: "join game",
                  players: [], roles: ['LG', 'LG', 'Vil', 'Vil', 'Voy', 'Vol', 'Sor'],
                },
              },
            },
          ],
          emitsTo: [
            {
              event: 'start phase: join game',
              to: 'game.id',
            },
          ],
          joins: [], emits: [],
        },
      )
    })
    test('list games', async () => {
      const { player1: mario, player2: luigi } = makeMiddlewareMock(2)

      await mario.send['login']({ id: 1, name: 'mario' })
      await luigi.send['login']({ id: 2, name: 'luigi' })
      await mario.send['create game']({ id: 'mario.game.id' })
      await luigi.send['create game']({ id: 'luigi.game.id' })

      const gamesList = luigi.send['list games']()
      expect(gamesList).toEqual({
        games: [
          { id: 'mario.game.id', name: 'mario.game.id' },
          { id: 'luigi.game.id', name: 'luigi.game.id' }],
      })
    })
  })
})
