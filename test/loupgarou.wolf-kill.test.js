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
          broadcasts: [
            {
              'event': 'witch save',
              'payload': { 'alive': true, 'id': 3, 'name': 'player3' },
            },
          ],
          'emits': [],
          'emitsTo': [],
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
          broadcasts: [
            {
              'event': 'wolf kill',
              'payload': { 'alive': false, 'id': 3, 'name': 'player3' },
            },
          ],
          'emits': [],
          'emitsTo': [],
          'joins': [],
        },
      )
    })
  })
})
