const cluster = require('cluster');
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 5151;
var ROOT = path.dirname(__dirname);
var cCPUs = require('os').cpus().length;

if(cluster.isMaster){
    for(var i = 0; i < cCPUs; i++){
        cluster.fork();
    }

    cluster.on('online', function(worker){
        console.log('Worker '+worker.process.pid+" is online.");
    });

    cluster.on('exit', function(worker, code, signal) {
        if(code !== 0 && !worker.exitedAfterDisconnect){
            console.log('Worker '+worker.process.pid+" died.");
            const nw = cluster.fork();
            console.log('Worker '+nw.process.pid+" will replace "+worker.process.pid+".")
        }
    });
} else {
    require('./server.js');
}