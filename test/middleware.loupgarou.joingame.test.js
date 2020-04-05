const makeMiddlewareMock = require('./middleware.mock')

describe('middleware', () => {
  describe('loup garou', () => {
    test('join game 1 player', async () => {
      const { player1: mario, player2: luigi, clearOutput } = makeMiddlewareMock(2)

      await mario.send['login']({ id: 1, name: 'mario' })
      await luigi.send['login']({ id: 2, name: 'luigi' })
      await mario.send['create game']({ id: 'mario.game.id' })

      clearOutput()

      await mario.send['join game']('mario.game.id')

      expect(mario.output).toEqual({
        'joins': [{ room: 'mario.game.id', player: { id: 1, name: 'mario' } }],
        'emitsTo': [
          {
            'event': 'join game',
            'payload': { 'id': 1, 'name': 'mario' },
            'to': 'mario.game.id',
          },
        ],
        'broadcasts': [], 'emits': [],
      })
    })
    test('join game 2 players', async () => {
      const { player1: mario, player2: luigi, clearOutput } = makeMiddlewareMock(2)

      await mario.send['login']({ id: 1, name: 'mario' })
      await luigi.send['login']({ id: 2, name: 'luigi' })
      await mario.send['create game']({ id: 'mario.game.id' })

      clearOutput()

      await mario.send['join game']('mario.game.id')
      await luigi.send['join game']('mario.game.id')

      expect(mario.output).toEqual({
        'joins': [{ room: 'mario.game.id', player: { id: 1, name: 'mario' } }],
        'emitsTo': [
          {
            'event': 'join game',
            'payload': { 'id': 1, 'name': 'mario' },
            'to': 'mario.game.id',
          },
          {
            'event': 'join game',
            'payload': { 'id': 2, 'name': 'luigi' },
            'to': 'mario.game.id',
          },
        ],
        'broadcasts': [], 'emits': [],
      })

      expect(luigi.output).toEqual({
        'joins': [{ room: 'mario.game.id', player: { id: 2, name: 'luigi' } }],
        'emitsTo': [],
        'broadcasts': [], 'emits': [],
      })
    })
  })
})