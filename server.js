const express = require('express')
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 80
const { addUser, getUser, deleteUser, getUsers } = require('./users')


app.use(cors())

app.use(express.static(path.join(__dirname, 'client/build')));



io.on('connection', (socket) => {
    socket.on('login', ({ name, room }, callback) => {
        const { user, error } = addUser(socket.id, name, room)
        if (error) return callback(error)
        socket.join(user.room)
        socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
        io.in(room).emit('users', getUsers(room))
        callback()
    })

    socket.on('sendMessage', message => {
        const user = getUser(socket.id)
        io.in(user.room).emit('message', { user: user.name, text: message });
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
        const user = deleteUser(socket.id)
        if (user) {
            io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
            io.in(user.room).emit('users', getUsers(user.room))
        }
    })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+"/client/build/index.html"))
})

http.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})