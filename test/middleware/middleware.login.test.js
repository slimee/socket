const makeMiddlewareMock = require('../middleware.mock')

describe('middleware', () => {
  test('login 1 player', () => {
    const { mocks, middleware } = makeMiddlewareMock(2)
    mocks[0].send['login']({ id: 1, name: 'mario' })

    expect(mocks).toHaveLength(2)
    expect(mocks[0].broadcasts).toEqual([{
      'event': 'user joined',
      'payload': { 'id': 1, 'name': 'mario' },
    }])
    expect(middleware.store.state).toEqual({ 'users': [{ 'id': 1, 'name': 'mario' }], 'games': [] })
    expect(mocks[1].broadcasts).toEqual([])
  })

  test('login/disconnect 1 player', () => {
    const { mocks, middleware } = makeMiddlewareMock(1)
    expect(mocks).toHaveLength(1)

    mocks[0].send['login']({ id: 1, name: 'mario' })
    expect(mocks[0].broadcasts).toEqual([{
      'event': 'user joined',
      'payload': { 'id': 1, 'name': 'mario' },
    }])

    mocks[0].send['disconnect']({ id: 1, name: 'mario' })
    expect(middleware.store.state).toEqual({ 'users': [], 'games': [] })
    expect(mocks[0].broadcasts).toEqual([
      { 'event': 'user joined', 'payload': { 'id': 1, 'name': 'mario' } },
      { 'event': 'user left', 'payload': { 'id': 1, 'name': 'mario' } },
    ])
  })
})