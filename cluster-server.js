var sticky = require('sticky-session'),
    http = require('http'), 
    express = require('express'),
    socketIO = require('socket.io'),
    cluster = require('cluster'),
    cors = require('cors'),
    PORT = process.env.PORT || 5151
    redis = require('redis'),
    redisAdapter = require('socket.io-redis'),
    REDIS_PORT = 11039,
    REDIS_HOST = 'ec2-54-208-89-233.compute-1.amazonaws.com';

const apiRouter = require('./routes/apiRouter');
const authRouter = require('./routes/authRouter');

var app = express(), io; 

var server = http.Server(app);

app.use(cors());
app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    console.log('send message to worker: '+cluster.worker.id);
    res.send(`client connected on port ${PORT} and worker id: ${cluster.worker.id}`);
});

io = socketIO(server);

// redis adapter
const pubClient = redis.createClient(REDIS_PORT, REDIS_HOST, {
    auth_pass: 'p551765675b247d78dddf9b57847dd89db0af13d4ab51b86fdf47f976ad7a365a'
});
const subClient = pubClient.duplicate();
io.adapter(redisAdapter({
    pubClient, subClient
}))

io.on('connection', (socket) => {
    console.log('socket login goes here');
    
    socket.on('join', (data) => {
        io.sockets.emit("test_broadcast", null);
    });
});

if(!sticky.listen(server, PORT)){
    server.once('listening', function(){
        console.log(`Server up and running on port ${PORT}`);
    });

    if(cluster.isMaster){
        console.log(`Master server started on port ${PORT}`);
    }
} else {
    console.log(`- Child server started on port: ${PORT} with case worker id:${cluster.worker.id}`)
}
