const {makeMiddlewareMock} = require('./mock/middleware.mock')

describe('middleware', () => {
  test('login 1 player', () => {
    const { player1, player2, middleware } = makeMiddlewareMock(2)
    player1.send['login']({ id: 1, name: 'mario' })

    expect(player1.broadcasts).toEqual([{
      'event': 'user login',
      'payload': { 'id': 1, 'name': 'mario' },
    }])
    expect(middleware.store.getUsers()).toEqual([{ 'id': 1, 'name': 'mario' }])
    expect(player2.broadcasts).toEqual([])
  })

  test('login/disconnect 1 player', () => {
    const { player1, middleware } = makeMiddlewareMock(1)

    player1.send['login']({ id: 1, name: 'mario' })
    expect(player1.broadcasts).toEqual([{
      'event': 'user login',
      'payload': { 'id': 1, 'name': 'mario' },
    }])

    player1.send['disconnect']({ id: 1, name: 'mario' })
    expect(middleware.store.state).toEqual({ "clients": [],'users': [], 'games': [] })
    expect(player1.broadcasts).toEqual([
      { 'event': 'user login', 'payload': { 'id': 1, 'name': 'mario' } },
      { 'event': 'user logout', 'payload': { 'id': 1, 'name': 'mario' } },
    ])
  })
})
