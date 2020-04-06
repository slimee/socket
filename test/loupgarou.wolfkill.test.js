const makeMiddlewareMock = require('./mock/middleware.mock')

describe('middleware', () => {
  describe('loup garou', () => {
    test('player ready', async () => {
      const { player1, player2, player3, clearOutput } = makeMiddlewareMock(3)

      await player1.send['login']({ id: 1, name: 'player1' })
      await player2.send['login']({ id: 2, name: 'player2' })
      await player3.send['login']({ id: 3, name: 'player3' })
      await player1.send['create game']({ id: 'player1.game.id' }, { roles: ['LG', 'Vil', 'Sor'] })
      await player1.send['join game']('player1.game.id')
      await player2.send['join game']('player1.game.id')
      await player3.send['join game']('player1.game.id')
      await player1.send['player ready']()
      await player2.send['player ready']()
      await player3.send['player ready']()
      clearOutput()

      expect(player1.output).toEqual({
        'broadcasts': [],
        'emits': [],
        'emitsTo': [],
        'joins': [],
      })
      expect(player2.output).toEqual({
        'broadcasts': [],
        'emits': [],
        'emitsTo': [],
        'joins': [],
      })
      expect(player2.output).toEqual({
        'broadcasts': [],
        'emits': [],
        'emitsTo': [],
        'joins': [],
      })
    })
  })
})