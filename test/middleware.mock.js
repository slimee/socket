const Middleware = require('../middleware/index')

function Mock() {
  const send = {}
  const broadcasts = []
  const emits = []
  const emitsTo = []
  const joins = []
  const client = {
    when: (event, callback) => {
      send[event] = callback
    },
    setUser: (user) => {
      client.user = user
    },
    broadcast: (event, payload) => {
      broadcasts.push({ event, payload })
    },
    emit: (event, payload) => {
      emits.push({ event, payload })
    },
    emitTo: (event, to, payload) => {
      emitsTo.push({ event, to, payload })
    },
    join: (id) => {
      joins.push(id)
    },
  }
  return {
    send, client, broadcasts, emits, emitsTo, joins,
    production: { broadcasts, emits, emitsTo, joins },
  }
}

module.exports = playerCount => {
  const middleware = new Middleware()
  const mocks = []
  for (let i = 0; i < playerCount; i++) {
    const mock = new Mock()
    middleware.whenConnect(mock.client)
    mocks.push(mock)
  }
  const player = mocks[0]
  const globalState = middleware.store.state
  const gameState = () => globalState.games[0] && globalState.games[0].store.state
  const gameOneState = gameState
  const gameTwoState = () => globalState.games[1] && globalState.games[1].store.state
  const gameThreeState = () => globalState.games[2] && globalState.games[2].store.state
  const clearProduction = () => {
    for (let i = 0; i < mocks.length; i++) {
      mocks[i].broadcasts.length = 0
      mocks[i].emits.length = 0
      mocks[i].emitsTo.length = 0
      mocks[i].joins.length = 0
    }
  }
  return {
    player,
    mocks, middleware,
    globalState,
    gameState,
    gameOneState,
    gameTwoState,
    gameThreeState,
    clearProduction,
  }
}