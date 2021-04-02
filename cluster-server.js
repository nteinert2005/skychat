var sticky = require('sticky-session'),
    http = require('http'), 
    express = require('express'),
    socketIO = require('socket.io'),
    cluster = require('cluster'),
    cors = require('cors'),
    PORT = process.env.PORT || 5151;

const apiRouter = require('./routes/apiRouter');
const authRouter = require('./routes/authRouter');

var app = express(), io; 

var server = http.Server(app);

app.use(cors());
app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    console.log('send message to worker: '+cluster.worker.id);
});

io = socketIO(server);

io.on('connection', (socket) => {
    console.log('socket login goes here');
})

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
