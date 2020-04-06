const makeMiddlewareMock = require('./mock/middleware.mock')

describe('middleware', () => {
  describe('loup garou', () => {
    test('join game 1 player', async () => {
      const { player1: mario, player2: luigi, startRecordOutput } = makeMiddlewareMock(2)

      await mario.send['login']({ id: 1, name: 'mario' })
      await luigi.send['login']({ id: 2, name: 'luigi' })
      await mario.send['create game']({ id: 'mario.game.id' })

      startRecordOutput()

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
      const { player1: mario, player2: luigi, startRecordOutput } = makeMiddlewareMock(2)

      await mario.send['login']({ id: 1, name: 'mario' })
      await luigi.send['login']({ id: 2, name: 'luigi' })
      await mario.send['create game']({ id: 'mario.game.id' })

      startRecordOutput()

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
        ],
        'broadcasts': [], 'emits': [],
      })

      expect(luigi.output).toEqual({
        'joins': [{ room: 'mario.game.id', player: { id: 2, name: 'luigi' } }],
        'emitsTo': [{
          'event': 'join game',
          'payload': { 'id': 2, 'name': 'luigi' },
          'to': 'mario.game.id',
        }],
        'broadcasts': [], 'emits': [],
      })
    })
    test('join game 2nd player', async () => {
      const { player1: mario, player2: luigi, startRecordOutput } = makeMiddlewareMock(2)

      await mario.send['login']({ id: 1, name: 'mario' })
      await luigi.send['login']({ id: 2, name: 'luigi' })
      await mario.send['create game']({ id: 'mario.game.id' }, { roles: ['LG', 'Vil'] })

      await mario.send['join game']('mario.game.id')
      startRecordOutput()
      await luigi.send['join game']('mario.game.id')

      expect(mario.output).toEqual({
        'joins': [],
        'broadcasts': [],
        'emits': [],
        'emitsTo': [
          {
            'event': 'start phase: player ready',
            'payload': {
              'host': { 'id': 1, 'name': 'mario' },
              'id': 'mario.game.id', 'name': 'mario.game.id',
              'phase': 'player ready',
              'players': [
                { 'id': 1, 'name': 'mario' },
                { 'id': 2, 'name': 'luigi' },
              ],
              'roles': ['LG', 'Vil'],
            },
            'to': 'mario.game.id',
          },
        ],
      })
      expect(luigi.output).toEqual({
        'joins': [{ 'player': { 'id': 2, 'name': 'luigi' }, 'room': 'mario.game.id' }],
        'emitsTo': [{
          'event': 'join game',
          'payload': { 'id': 2, 'name': 'luigi' },
          'to': 'mario.game.id',
        }],
        'broadcasts': [],
        'emits': [],
      })
    })
  })
})
