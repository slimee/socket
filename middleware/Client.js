const uuid = require('../services/uuid')

module.exports = class Client {
  constructor(socket) {
    this.id = uuid()
    this.socket = socket
  }

  setUser(user) {
    this.user = user
  }

  getUser() {
    return this.user
  }

  when(event, job) {
    return this.socket.on(event, async (payload, respond) => respond(await job(payload)))
  }

  emit(event, payload) {
    return this.socket.emit(event, payload)
  }

  broadcast(event, payload) {
    return this.socket.broadcast(event, payload)
  }

  emitTo(to, event, payload) {
    return this.socket.to(to).emit(event, payload)
  }

  join(room, player) {
    if (player !== this.user) throw new Error(`${JSON.stringify(player)} is joining room '${room}' in socket of ${JSON.stringify(this.user)}`)
    return this.socket.join(room)
  }
}
