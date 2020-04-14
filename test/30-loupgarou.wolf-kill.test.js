const { simpleStart } = require('./mock/middleware.mock')

describe('middleware', () => {
  describe('loup garou', () => {
    test('witch save', async () => {
      const roles = ['LG', 'LG', 'Vil', 'Sor']
      const {
        startRecordOutput,
        hostPlayer, player1: wolf1, player2: wolf2, player4: witch, player3DTO: villageoisDTO,
      } = await simpleStart(roles)

      startRecordOutput()

      await wolf1.send['wolf kill'](villageoisDTO)
      await wolf2.send['wolf kill'](villageoisDTO)
      await witch.send['witch save'](villageoisDTO)

      expect(hostPlayer.output).toEqual(
        {
          emitsTo: [
            {
              'to': 'player1.game.id',
              'event': 'witch saved',
              'payload': { 'alive': true, 'id': 3, 'name': 'player3' },
            },
            {
              'to': 'player1.game.id',
              'event': 'start phase: voyante voit',
            },
          ],
          'emits': [],
          'broadcasts': [],
          'joins': [],
        },
      )
    })

    test('wolf kill', async () => {
      const roles = ['LG', 'LG', 'Vil', 'Sor']
      const {
        startRecordOutput,
        hostPlayer, player1: wolf1, player2: wolf2, player4: witch,
        player3DTO: villageoisDTO, player4DTO: villageois2DTO,
      } = await simpleStart(roles)

      startRecordOutput()

      await wolf1.send['wolf kill'](villageoisDTO)
      await wolf2.send['wolf kill'](villageoisDTO)
      await witch.send['witch save'](villageois2DTO)

      expect(hostPlayer.output).toEqual(
        {
          emitsTo: [
            {
              'to': 'player1.game.id',
              'event': 'wolf kill',
              'payload': { 'alive': false, 'id': 3, 'name': 'player3' },
            },
            {
              'to': 'player1.game.id',
              'event': 'start phase: voyante voit',
            },
          ],
          'emits': [],
          'broadcasts': [],
          'joins': [],
        },
      )
    })

    test('wolf kill until end game', async () => {
      const roles = ['LG', 'Vil']
      const {
        startRecordOutput,
        hostPlayer, player1: wolf, player2DTO: villageoisDTO,
      } = await simpleStart(roles)

      startRecordOutput()

      await wolf.send['wolf kill'](villageoisDTO)

      expect(hostPlayer.output).toEqual(
        {
          emitsTo: [
            {
              'to': 'player1.game.id',
              'event': 'wolf kill',
              'payload': { 'alive': false, 'id': 2, 'name': 'player2' },
            },
            {
              'to': 'player1.game.id',
              'event': 'end game',
              'payload': {
                'host': {
                  'alive': true,
                  'id': 1,
                  'name': 'player1',
                },
                'id': 'player1.game.id',
                'name': 'player1.game.id',
                'phase': 'player ready',
                'playing': false,
                'roles': ['LG', 'Vil'],
                'players': [
                  { 'alive': true, 'id': 1, 'name': 'player1' },
                  { 'alive': false, 'id': 2, 'name': 'player2' },
                ],
              },
            },
            {
              'to': 'player1.game.id',
              'event': 'start phase: player ready',
            },
          ],
          'emits': [],
          'broadcasts': [],
          'joins': [],
        },
      )
    })
  })
})
