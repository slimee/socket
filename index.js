const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000
const Middleware = require('./middleware')
const Client = require('middleware/Client')
const middleware = new Middleware()

server.listen(port, () => console.log('Server listening at port %d', port))
app.use(express.static(path.join(__dirname, 'public')))
io.on('connection', socket => middleware.whenConnect(new Client(socket)))