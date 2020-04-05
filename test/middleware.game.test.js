const makeMiddlewareMock = require('./middleware.mock')

describe('middleware', () => {
  describe('game', () => {
    test('create game without login', async () => {
      const { player, globalState } = makeMiddlewareMock(1)

      await player.send['create game']({ id: 'game.id' })

      expect(globalState.games).toHaveLength(0)
      expect(player.output).toEqual({
          'joins': [],
          'emits': [],
          'emitsTo': [],
          'broadcasts': [],
        },
      )
    })
    test('create game', async () => {
      const { player, globalState, gameState, clearOutput } = makeMiddlewareMock(1)

      await player.send['login']({ id: 1, name: 'mario' })
      clearOutput()
      await player.send['create game']({ id: 'game.id', name: 'table 6' })

      expect(globalState.games).toHaveLength(1)
      expect(gameState()).toEqual({
        'id': 'game.id', 'name': 'table 6', 'host': { 'id': 1, 'name': 'mario' },
        'players': [],
        'roles': ['LG', 'LG', 'Vil', 'Vil', 'Voy', 'Vol', 'Sor'],
      })
      expect(player.output).toEqual({
          'joins': [],
          'emits': [{
            event: 'enter: join game', payload: {
              'id': 'game.id', 'name': 'table 6', 'host': { 'id': 1, 'name': 'mario' },
              'players': [],
              'roles': ['LG', 'LG', 'Vil', 'Vil', 'Voy', 'Vol', 'Sor'],
            },
          }],
          'emitsTo': [],
          'broadcasts': [],
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