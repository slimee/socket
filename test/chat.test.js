const { makeMiddlewareMock } = require('./mock/middleware.mock')

describe('middleware', () => {
  describe('chat', () => {
    test('without login', () => {
      const { hostPlayer, globalState } = makeMiddlewareMock(1)

      hostPlayer.send['typing']()
      hostPlayer.send['new message']('Hello, World!')
      hostPlayer.send['stop typing']()

      expect(globalState).toEqual({ clients: [], 'users': [], 'games': [] })
      expect(hostPlayer.broadcasts).toEqual([])
    })

    test('with login', () => {
      const { hostPlayer, globalState } = makeMiddlewareMock(1)

      hostPlayer.send['login']({ id: 1, name: 'mario' })
      hostPlayer.send['typing']()
      hostPlayer.send['new message']('Hello, World!')
      hostPlayer.send['stop typing']()

      expect(globalState.users).toEqual([{ 'id': 1, 'name': 'mario' }])
      expect(hostPlayer.output).toEqual({
        emits: [], emitsTo: [], joins: [],
        broadcasts: [
          { 'event': 'user login', 'payload': { 'id': 1, 'name': 'mario' } },
          { 'event': 'typing', 'payload': { 'id': 1, 'name': 'mario' } },
          { 'event': 'new message', 'payload': { 'id': 0, 'player': { 'id': 1, 'name': 'mario' }, 'content': 'Hello, World!' } },
          { 'event': 'stop typing', 'payload': { 'id': 1, 'name': 'mario' } },
        ],
      })
    })
  })
})
