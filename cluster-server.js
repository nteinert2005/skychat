const cluster = require("cluster");

const express = require('express');
const app = express();
const http = require("http");
const redisAdapter = require("socket.io-redis");
const numCPUs = 2;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const redis = require('redis')
const REDIS_PORT = 11039;
const path = require('path');
const REDIS_HOST = 'ec2-54-208-89-233.compute-1.amazonaws.com';
const PORT = process.env.PORT || 5151;
const cors = require('cors');
const { addUser, getUser, deleteUser, getUsers, getAllUsers, findBySocketID } = require('./users');
const crypto = require('crypto');

const {
    createRedisClient,
    getRedisUsers,
    setRedisUsers,
    addRedisUser,
    findRedisUser,
    deleteRedisUser
} = require('./socketRedis');

const apiRouter = require('./routes/apiRouter');
const authRouter = require('./routes/authRouter');

// for windows running only
cluster.schedulingPolicy = cluster.SCHED_RR;
const client = createRedisClient(
    'ec2-54-208-89-233.compute-1.amazonaws.com',
    11039,
    'p551765675b247d78dddf9b57847dd89db0af13d4ab51b86fdf47f976ad7a365a'
);

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running on port ${PORT}`);

    var tempUsers = [];
    setRedisUsers(tempUsers).then(function(result){
        const httpServer = http.createServer(app);
        setupMaster(httpServer, {
            loadBalancingMethod: "round-robin", // either "random", "round-robin" or "least-connection"
        });

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
                

        cluster.on("exit", (worker) => {
            console.log(`Worker ${worker.process.pid} died`);
            cluster.fork();
        });
    });    
} else {
    console.log(`Worker ${process.pid} started`);

    const httpServer = http.createServer(app);

    const io = require('socket.io')(httpServer);
    const pubClient = redis.createClient(REDIS_PORT, REDIS_HOST, {
        auth_pass: 'p551765675b247d78dddf9b57847dd89db0af13d4ab51b86fdf47f976ad7a365a'
    });
    const subClient = pubClient.duplicate();
    io.adapter(redisAdapter({
        pubClient, subClient
    }));

    setupWorker(io);

    app.use(cors());
    // //app.options('*', cors());

    

    

    // httpServer.listen(80, error => {
    //     if(error) return console.error(error);
    //     console.log('Client is listen now.');
    // });

    function log_me(worker_id, action, socket, port){
        console.log(`${worker_id} | ${action} | ${socket} | ${port}`);
    }

    io.on("connection", (socket) => {
        //console.log(`${cluster.worker.id} | connection | ${socket.id} | ${PORT}`);
        log_me(cluster.worker.id, "connection", socket.id, PORT)
        
        //console.log(`Socket connected on port ${PORT} on cluster: ${process.pid}`);

        socket.on('join', data => {
            const { user, err } = addUser(socket.id, data.username, data.defaultRoom);
            let newUser = addRedisUser(user);
        
            newUser.then(function(result1){
                //console.log(result1);
                let userArray = getRedisUsers();
                userArray.then(function(result2){
                    var temp = JSON.parse(result2.users);
                    
                    io.sockets.emit('new_user', {
                        userList: temp
                    });
                })
            });

            
            // client.get('storedUsers', (error, users) => {
            //     if(error) throw error;
            //     console.log('inside of client');
            //     var tempUsers = JSON.parse(users);
            //     const { user, err } = addUser(socket.id, data.username, data.defaultRoom);
            //     tempUsers.push(user);
            //     client.set('storedUsers', JSON.stringify(tempUsers));

            //     io.sockets.emit('new_user', {
            //         user_join: true,
            //         userlist: tempUsers
            //     });
            // }) 
        });


        //     for(var i = 0; i < userMap.length; i++){
        //         if(userMap[i].room == data.defaultRoom){
        //             console.log(data.defaultRoom);
        //             io.to(userMap[i].id).emit('user_join', {
        //                 userMap: getUsers(data.defaultRoom)
        //             })
        //         }
        //     }
        // })

        socket.on('disconnect', () => {
            log_me(cluster.worker.id, 'disconnected', socket.id, PORT);
            //console.log(`Disconnected: ${socket.id}`);
            var oldUser = getUser(socket.id);
            //var user = deleteUser(socket.id);

            var deleteUser = deleteRedisUser(oldUser);

            deleteUser.then(function(results){
                //console.log(result1);
                let userArray = getRedisUsers();
                userArray.then(function(result2){
                    var temp = JSON.parse(result2.users);
                    
                    io.sockets.emit('user_deleted', {
                        userList: temp
                    });
                })
            })

            io.emit('user_leave', {
                userMap: getUsers()
            })
        });

        socket.on('start_private', (data) => {
            var person1 = getUser(data.socketTo);
            console.log('---- person 1:'+person1.name+" ----");
            var person2 = findBySocketID(socket.id);
            console.log('---- person 2:'+person2.name+" ----");

            log_me(cluster.worker.id, `private_message_start ${person1.name} <> ${person2.name}`, socket.id, PORT)
            var randomRoom = crypto.randomBytes(20).toString('hex');
            log_me(cluster.worker.id, `room created: ${randomRoom}`, socket.id, PORT);
            socket.join(randomRoom);
            io.to(person1.id).to(person2.id).emit("private_started", {
                newRoom: randomRoom
            });
        });
    });

    app.use('/api', apiRouter);
    app.use('/auth', authRouter);


    if(process.env.NODE_ENV === 'production'){
        console.log('--- production ---');
        app.use(express.static('client/build'));

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname+"/client/build/index.html"))
        })
    } else {
        app.get('/users',(req, res) => {
            try {
                client.get('storedUsers', async (err, users) => {
                    res.status(200).send({
                        users: JSON.parse(users)
                    });
                }) 
            } catch(err) {
                res.status(500).send({
                    message: err.message
                })
            }
        })
        app.get('/', (req, res) => {
            app.use(express.static('client/build'));
            res.sendFile(path.join(__dirname+"/client/build/index.html"))
        })
    }

    httpServer.listen(PORT);
}