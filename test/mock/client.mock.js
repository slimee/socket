module.exports = function ClientMock() {
  const send = {}
  const broadcasts = []
  const emits = []
  const emitsTo = []
  const joins = []
  const client = {
    setUser: (user) => client.user = user,
    getUser: () => client.user,
    when: (event, callback) => send[event] = callback,
    emit: (event, payload) => emits.push({ event, payload }),
    broadcast: (event, payload) => broadcasts.push({ event, payload }),
    emitTo: (to, event, payload) => emitsTo.push({ event, to, payload }),
    join: (room, player) => {
      if (player !== client.getUser())
        throw new Error(`${JSON.stringify(player)} is joining room '${room}'
         in socket of ${JSON.stringify(client.getUser())}`)
      joins.push({ room, player })
    },
  }
  return {
    send, client, broadcasts, emits, emitsTo, joins,
    output: { broadcasts, emits, emitsTo, joins },
  }
}
