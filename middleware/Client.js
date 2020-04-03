module.exports = class Client {
  constructor(socket) {
    this.socket = socket
    this.setUser(null)
  }

  setUser(user) {
    this.user = user
  }

  when(event, job) {
    return this.socket.on(event, async (payload, respond) => respond(await job(payload)))
  }

  emit(event, payload) {
    return this.socket.to(to).emit(event, payload)
  }

  broadcast(event, payload) {
    return this.socket.broadcast(event, payload)
  }

  emitTo(to, event, payload) {
    return this.socket.to(to).emit(event, payload)
  }

  join(room) {
    return this.socket.join(room)
  }
}