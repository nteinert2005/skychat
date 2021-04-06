const cluster = require("cluster");

const express = require('express');
const app = express();
const http = require("http");
const redisAdapter = require("socket.io-redis");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const redis = require('redis')
const REDIS_PORT = 11039;
const REDIS_HOST = 'ec2-54-208-89-233.compute-1.amazonaws.com';
const PORT = process.env.port || 5151;
const cors = require('cors');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

const apiRouter = require('./routes/apiRouter');
const authRouter = require('./routes/authRouter');

app.use(cors());


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running on port ${PORT}`);

    const httpServer = http.createServer(app);
    setupMaster(httpServer, {
        loadBalancingMethod: "least-connection", // either "random", "round-robin" or "least-connection"
    });
    httpServer.listen(PORT);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
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

    //app.use(cors());
    //app.options('*', cors());

    

    app.use('/api', apiRouter);
    app.use('/auth', authRouter);

    io.on("connection", (socket) => {
        console.log(`Socket connected on port ${PORT}`);

        socket.on('join', data => {
            console.log(`Socket joined the chat room: ${data.defaultRoom}`);
        })
    });
}