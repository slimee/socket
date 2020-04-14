const { simpleStart } = require('./mock/middleware.mock')
const Roles = require('../games/loup-garou/roles')

describe('middleware', () => {
  describe('loup garou', () => {
    test('voyante voit', async () => {
      const roles = ['LG', 'LG', 'Vil', 'Voy']
      const {
        startRecordOutput,
        hostPlayer,
        player1: wolf1, player2: wolf2, player3: villageois, player4: voyante,
        player2DTO: wolf2DTO, player3DTO: villageoisDTO,
      } = await simpleStart(roles)

      await wolf1.send['wolf kill'](villageoisDTO)
      await wolf2.send['wolf kill'](villageoisDTO)

      startRecordOutput()

      const role = await voyante.send['voyante voit'](villageoisDTO)
      expect(role).toEqual({ error: 'player4 want to see dead player3' })

      const role2 = await voyante.send['voyante voit'](wolf2DTO)
      expect(role2).toEqual({ 'role': 'LG' })

      const role3 = await voyante.send['voyante voit'](wolf2DTO)
      expect(role3).toEqual({ 'error': 'player4 already played' })

      const role4 = await wolf1.send['voyante voit'](wolf2DTO)
      expect(role4).toEqual({ 'error': 'player1 is not Voy' })

      const role5 = await villageois.send['voyante voit'](wolf2DTO)
      expect(role5).toEqual({ 'error': 'player3 want play but is not alive' })

      expect(hostPlayer.output).toEqual({
        'broadcasts': [],
        'emits': [],
        'emitsTo': [
          {
            'to': 'player1.game.id',
            'event': 'voyante a vu',
          },
        ],
        'joins': [],
      })
    })
  })
})
