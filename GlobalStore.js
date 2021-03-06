module.exports = class GlobalStore {
  constructor() {
    this.initState()
  }

  initState() {
    this.state = {
      clients: [],
      users: [],
      games: [],
    }
  }

  getUsers() {
    return this.state.users
  }

  getGamesList() {
    return this.state.games.map(game => ({
      id: game.getId(),
      name: game.getName(),
    }))
  }

  addClient(client) {
    this.state.clients.push(client)
    this.addUser(client.getUser())
  }

  removeClient(client) {
    if (!client) return `removeClient client=${client}`
    if (!client.id) return `removeClient client.id=${client.id}`
    const index = this.state.clients.findIndex(stateClient => stateClient.id === client.id)
    if (index >= 0) this.state.clients.splice(index, 1)
    return this.removeUser(client.getUser())
  }

  addUser(user) {
    if (this.getUser(user)) return
    this.state.users.push(user)
    return user
  }

  addGame(game) {
    if (this.getGame(game)) return
    this.state.games.push(game)
    return game
  }

  removeUser(user) {
    if (!user) return `removeUser ${user}`
    if (!GlobalStore.isUser(user)) return `removeUser not a user ${user}`
    const index = this.state.users.findIndex(stateUser => stateUser.id === user.id)
    if (index >= 0) this.state.users.splice(index, 1)
    else return `removeUser user not found user.id=${user.id}`
  }

  removeGame(game) {
    if (!GlobalStore.isGame(game)) return
    const index = this.state.games.findIndex(game => game.id !== game.id)
    if (index >= 0) this.state.games.splice(index, 1)
  }

  getUser(user) {
    return GlobalStore.isUser(user)
      && this.state.users.find(({ id }) => user.id === id)
  }

  getGame(id) {
    return this.state.games.find((game) => game.getId() === id)
  }

  static isUser({ id, name }) {
    return id && name
  }

  static isGame({ id }) {
    return id
  }

  getPlayerClient(player) {
    return this.state.clients.find(client => client.getUser().id === player.id)
  }
}
