const express = require('express')
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const redis = require('redis')
const redisAdapter = require('socket.io-redis');
const cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 80
const { addUser, getUser, deleteUser, getUsers } = require('./users')


const REDIS_PORT = 11039;
const REDIS_HOST = 'ec2-54-208-89-233.compute-1.amazonaws.com';

app.use(cors())
app.use(express.static(path.join(__dirname, 'client/build')));

// redis adapter
const pubClient = redis.createClient(REDIS_PORT, REDIS_HOST, {
    auth_pass: 'p551765675b247d78dddf9b57847dd89db0af13d4ab51b86fdf47f976ad7a365a'
});
const subClient = pubClient.duplicate();
io.adapter(redisAdapter({
    pubClient, subClient
}))

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