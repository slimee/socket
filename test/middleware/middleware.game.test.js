const makeMiddlewareMock = require('../middleware.mock')

describe('middleware', () => {
  describe('game', () => {
    test('game without login', async () => {
      const { player, globalState } = makeMiddlewareMock(1)

      await player.send['create game']({ id: 'game.id' })

      expect(globalState.games).toHaveLength(0)
      expect(player.production).toEqual({
          'joins': [],
          'emits': [],
          'emitsTo': [],
          'broadcasts': [],
        },
      )
    })
    test('game', async () => {
      const { player, globalState, gameState, clearProduction } = makeMiddlewareMock(1)

      await player.send['login']({ id: 1, name: 'mario' })
      clearProduction()
      await player.send['create game']({ id: 'game.id' })

      expect(globalState.games).toHaveLength(1)
      expect(gameState()).toEqual({ 'players': [] })
      expect(player.production).toEqual({
          'joins': ['game.id'],
          'emits': [{
            'event': 'enter: player join',
            'payload': {
              'players': [],
            },
          }],
          'emitsTo': [],
          'broadcasts': [],
        },
      )
    })
  })
})