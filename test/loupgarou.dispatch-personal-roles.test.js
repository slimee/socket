const {makeMiddlewareMock} = require('./mock/middleware.mock')

describe('middleware', () => {
  describe('loup garou', () => {
    test('dispatch personal roles', async () => {
      const { player1, player2, player3, startRecordOutput, gameStore } = makeMiddlewareMock(3)

      await player1.send['login']({ id: 1, name: 'player1' })
      await player2.send['login']({ id: 2, name: 'player2' })
      await player3.send['login']({ id: 3, name: 'player3' })
      await player1.send['create game']({ id: 'player1.game.id' }, { roles: ['LG', 'Vil', 'Sor'] })
      await player1.send['join game']('player1.game.id')
      await player2.send['join game']('player1.game.id')
      await player3.send['join game']('player1.game.id')
      await player1.send['player ready']()
      await player2.send['player ready']()
      startRecordOutput()
      await player3.send['player ready']()

      expect(gameStore().getRoles().slice().sort()).toEqual(['LG', 'Vil', 'Sor'].sort())

      expect(player1.output).toEqual({
        'emits': [
          {
            'event': 'player role', 'payload': gameStore().getPlayerRole({ id: 1, name: 'player1' }),
          },
        ],
        'emitsTo': [
          {
            'event': 'start phase: dispatch personal roles',
            'to': 'player1.game.id',
          },
          {
            "event": "start phase: wolf kill",
            "to": "player1.game.id"
          }
        ],
        'broadcasts': [],
        'joins': [],
      })
      expect(player2.output).toEqual({
        'broadcasts': [],
        'emits': [{
          'event': 'player role', 'payload': gameStore().getPlayerRole({ id: 2, name: 'player2' }),
        }],
        'emitsTo': [],
        'joins': [],
      })
      expect(player3.output).toEqual({
        'broadcasts': [],
        'emits': [{
          'event': 'player role', 'payload': gameStore().getPlayerRole({ id: 3, name: 'player3' }),
        }],
        'emitsTo': [{
          'event': 'player ready',
          'payload': { 'id': 3, 'name': 'player3', alive: true },
          'to': 'player1.game.id',
        }],
        'joins': [],
      })
    })
  })
})
