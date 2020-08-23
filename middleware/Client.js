const uuid = require('../services/uuid')

module.exports = class Client {
  constructor(socket) {
    this.id = uuid()
    this.socket = socket
    this.user = null
  }

  setUser(user) {
    this.user = user
  }

  getUser() {
    return this.user
  }

  when(event, job) {
    const whenCallback = async (payload, respond) => {
      console.log('RECEIVED', event, payload);
      const response = await job(payload)
      respond && respond(response)
    }
    return this.socket.on(event, whenCallback)
  }

  emit(event, payload) {
    console.log('SEND', event, payload)
    return this.socket.emit(event, payload)
  }

  broadcast(event, payload) {
    console.log('broadcast', event, payload)
    return this.socket.broadcast.emit(event, payload)
  }

  emitTo(to, event, payload) {
    return this.socket.to(to).emit(event, payload)
  }

  join(room, player) {
    if (player !== this.user) throw new Error(`${JSON.stringify(player)} is joining room '${room}' in socket of ${JSON.stringify(this.user)}`)
    return this.socket.join(room)
  }
}
