const makeMiddlewareMock = require('./mock/middleware.mock')

describe('middleware', () => {
  describe('loup garou', () => {
    test('player ready', async () => {
      const { player1: mario, player2: luigi, startRecordOutput } = makeMiddlewareMock(2)

      await mario.send['login']({ id: 1, name: 'mario' })
      await luigi.send['login']({ id: 2, name: 'luigi' })
      await mario.send['create game']({ id: 'mario.game.id' }, { roles: ['LG', 'Vil'] })
      await mario.send['join game']('mario.game.id')
      await luigi.send['join game']('mario.game.id')

      startRecordOutput()

      await mario.send['player ready']()
      await luigi.send['player ready']()

      expect(mario.output).toEqual({
        'broadcasts': [],
        'emits': [],
        'emitsTo': [
          {
            'to': 'mario.game.id',
            'event': 'player ready',
            'payload': { 'id': 1, 'name': 'mario' },
          },
          {
            'to': 'mario.game.id',
            'event': 'start phase: dispatch personal roles',
            'payload': {
              host: { 'id': 1, 'name': 'mario' },
              'id': 'mario.game.id', 'name': 'mario.game.id',
              'phase': 'dispatch personal roles',
              'players': [
                { 'id': 1, 'name': 'mario' },
                { 'id': 2, 'name': 'luigi' },
              ],
              'roles': ['LG', 'Vil'],
            },
          },
        ],
        'joins': [],
      })
      expect(luigi.output).toEqual({
        'broadcasts': [],
        'emits': [],
        'emitsTo': [
          {
            'to': 'mario.game.id',
            'event': 'player ready',
            'payload': { 'id': 2, 'name': 'luigi' },
          },
        ],
        'joins': [],
      })
    })

    test('wolf kill', async () => {
      const {
        player1: mario, player2: luigi,
        gameState, startRecordOutput,
      } = makeMiddlewareMock(2)

      await mario.send['login']({ id: 1, name: 'mario' })
      await luigi.send['login']({ id: 2, name: 'luigi' })
      await mario.send['create game']({ id: 'mario.game.id' }, { roles: ['LG', 'Vil'] })
      await mario.send['join game']('mario.game.id')
      await luigi.send['join game']('mario.game.id')
      await mario.send['player ready']()
      await luigi.send['player ready']()
      startRecordOutput()

      expect(gameState()).toEqual({
        'host': { 'id': 1, 'name': 'mario' },
        'id': 'mario.game.id',
        'name': 'mario.game.id',
        'phase': 'dispatch personal roles',
        'players': [
          { 'id': 1, 'name': 'mario' },
          { 'id': 2, 'name': 'luigi' },
        ],
        'roles': ['LG', 'Vil'],
      })
      expect(mario.output).toEqual({
        'broadcasts': [],
        'emits': [],
        'emitsTo': [],
        'joins': [],
      })
      expect(luigi.output).toEqual({
        'broadcasts': [],
        'emits': [],
        'emitsTo': [],
        'joins': [],
      })
    })
  })
})
