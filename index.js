const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

server.listen(port, () => console.log('Server listening at port %d', port))
app.use(express.static(path.join(__dirname, 'public')))

let players = []
let messageCount = 0
io.on('connection', (socket) => {
  let addedUser = false
  socket.on('new message', (content) => {
    const message = {
      id: ++messageCount,
      player: socket.player,
      content,
    }
    socket.emit('new message', message)
    socket.broadcast.emit('new message', message)
  })
  socket.on('login', (player) => {
    if (addedUser) return
    console.log('login', player)
    socket.player = player
    players.push(socket.player)
    addedUser = true
    socket.emit('login', { player, players: players.filter(p => p !== player) })
    socket.broadcast.emit('user joined', player)
  })
  socket.on('typing', () => {
    socket.broadcast.emit('typing', { username: socket.username })
  })
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', { username: socket.username })
  })
  socket.on('disconnect', () => {
      if (addedUser) {
        players = players.filter(player => player.id !== socket.player.id)
        socket.broadcast.emit('user left', socket.player)
      }
    },
  )
})

