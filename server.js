/*

    Build: STABLE
    Date: 03/22/2020
    Features: Multiserver, team assignments, and socket.io-redis working and configured. 

*/

const express = require('express')
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const redis = require('redis')
const redisAdapter = require('socket.io-redis');
const cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 5151;
const { addUser, getUser, deleteUser, getUsers, getAllUsers } = require('./users');


const apiRouter = require('./routes/apiRouter');
const authRouter = require('./routes/authRouter');

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


function log_me(msg){
    var ts = new Date(new Date().getTime() - (3600000*4));
    var tss = ts.toString();
    tss = tss.substring(0, tss.indexOf(' GMT'));
    console.log(tss+": "+msg);
}

io.on('connection', (socket) => {
    socket.on('test', (data) => {
        const { user, err } = addUser(socket.id, data.username, data.defaultRoom);
        if (err) throw err;
        socket.join(user.room);
        io.emit('users', getUsers());
    });

    socket.on('findRooms', () => {
        console.log('client wants all rooms');
        const allRooms = socket.rooms;
        var tempRoomList = [];

        allRooms.forEach(room => {
            if(room == socket.id){
            } else {
                tempRoomList.push(room);
            }
            
        })
        
        socket.emit('allRooms', {
            roomList: tempRoomList
        });
    })
    
    socket.on('login', ({ name, room }, callback) => {
        console.log("user connected to room: "+room);
        const { user, error } = addUser(socket.id, name, room)
        if (error) return callback(error)
        socket.join(user.room)
        socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
        //console.log(getUsers(room));
        io.in(room).emit('users', getUsers(room))
        callback()
    })

    socket.on('sendMessage', message => {
        const user = getUser(socket.id)

        var privateTest = message.includes("@");
        if(privateTest == false){
            socket.to("Team 1").to("Team 2").emit('message', {
                user: user.name, 
                text: message, 
                room: user.room
            });
            //io.in(user.room).emit('message', { user: user.name, text: message, room: user.room });
        } else {
            var origMessage = message;
            var userParts = message.split(' ');
            
            // userTo = person you are sending it to
            var userTo = userParts[0];
            userTo = userTo.split('@')[1];

            //userDM is the message you are sending
            var userDM = "";
            for(var i = 1; i< userParts.length; i++){
                userDM += userParts[i]+" ";
            }

            // find the user -> socket
            var tempUsers = getUsers(user.room);
            var userFound = false;
            //console.log(tempUsers);
            for(var i=0; i<tempUsers.length; i++){
                console.log(tempUsers[i]);
                if(tempUsers[i].name === userTo){
                    io.to(tempUsers[i].id).emit('private-message-arrived', {
                        from: user.name,
                        msg: userDM
                    });
                    userFound = true;
                }
            }

            if(userFound == false){
                io.to(user.id).emit('no-found-user', null);
            }
            
        }
    })

    socket.on('joinSecond_invite', () => {
        var user = getUser(socket.id);
        var tempRoom = "Team 2";
        log_me("joinSecond invite: "+ user.name);
        socket.join(tempRoom);
        socket.in(tempRoom).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
        io.in(tempRoom).emit('users', getUsers(user.room))
        log_me("joinSecond_success: added to Team 2");
        socket.emit("joinSecond_accept", "Team 2");
    })

    socket.on("disconnect", () => {
        log_me("disconnect: "+socket.id);
        const user = deleteUser(socket.id)
        if (user) {
            io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
            io.in(user.room).emit('users', getUsers(user.room))
            io.emit('user_disconnected', null);
        }
    })

    socket.on('getUsers', () => {
        var users = getAllUsers();
        io.emit('usersOnline', users);
    })
})

app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    console.log('Im not the easter bunny');
    res.sendFile(path.join(__dirname+"/client/build/index.html"))
})

http.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})