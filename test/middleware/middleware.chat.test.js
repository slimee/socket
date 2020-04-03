const makeMiddlewareMock = require('../middleware.mock')

describe('middleware', () => {
  describe('chat', () => {
    test('without login', () => {
      const { player, globalState } = makeMiddlewareMock(1)

      player.send['typing']()
      player.send['new message']('Hello, World!')
      player.send['stop typing']()

      expect(globalState).toEqual({ 'users': [], 'games': [] })
      expect(player.broadcasts).toEqual([])
    })

    test('with login', () => {
      const { player, globalState } = makeMiddlewareMock(1)

      player.send['login']({ id: 1, name: 'mario' })
      player.send['typing']()
      player.send['new message']('Hello, World!')
      player.send['stop typing']()

      expect(globalState).toEqual({ 'users': [{ 'id': 1, 'name': 'mario' }], 'games': [] })
      expect(player.broadcasts).toEqual(
        [
          { 'event': 'user joined', 'payload': { 'id': 1, 'name': 'mario' } },
          { 'event': 'typing', 'payload': { 'id': 1, 'name': 'mario' } },
          { 'event': 'new message', 'payload': { 'id': 0, 'player': { 'id': 1, 'name': 'mario' }, 'content': 'Hello, World!' } },
          { 'event': 'stop typing', 'payload': { 'id': 1, 'name': 'mario' } },
        ],
      )
      expect(player.emits).toEqual([
        {
          'event': 'new message',
          'payload': {
            'id': 0,
            'player': { 'id': 1, 'name': 'mario' },
            'content': 'Hello, World!',
          },
        },
      ])
    })
  })
})