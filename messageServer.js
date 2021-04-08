const cluster = require("cluster");
const express = require('express');
const app = express();
const http = require("http");
const path = require('path');
const numCPUs = 2;
const sio = require('socket.io');
const redisAdapter = require('socket.io-redis');
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const PORT = process.env.PORT || 5151;
const PORT1 = process.env.PORT || 5152;
const cors = require('cors');
const { addUser, getUser, deleteUser, getUsers, getAllUsers, findBySocketID } = require('./users');

// for windows running only
cluster.schedulingPolicy = cluster.SCHED_RR;

const masterSecret = [];

function pushSecret(worker, socket) {
    var newConnection = {
        "socketID": socket,
        "workerID": worker
    }

    masterSecret.push(newConnection);
}


if(cluster.isMaster){
    console.log(`Master up and running.`);


    for (let i=0; i < numCPUs; i++){
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });

} else {
    const app = express();
    const server = http.createServer(app);
    const io = require('socket.io')(server);

    io.sockets.on('connection', (socket) => {
        console.log(`socket call handled by worker with pid: ${process.pid}`)
        pushSecret(process.pid, socket.id);
        return socket.emit('full_users', {
            userMap: masterSecret
        });
    });

    server.listen(PORT);

}