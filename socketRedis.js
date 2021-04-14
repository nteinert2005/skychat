const redis = require('redis');
let client;

const createRedisClient = (host, port, auth_pass) => {
    client = redis.createClient({
        host: host,
        port: port, 
        auth_pass: auth_pass
    });

    client.on('connected', () => {
        console.log("Redis client is connected");
    });

    return client;
};



// Function: getRedisUsers
// Syntax:   var test = getRedisUsers
//           getRedisUsers.then(function() => {
const getRedisUsers = async (key) => {
    return new Promise((resolve, reject) => {
        client.get('storedUsers', (err, data) => {
            if(err){
                return reject({
                    error: true,
                    message: err,
                })
            }
            return resolve({
                users: data
            })
        });
    })
}

// Function: addRedisUser
// syntax: let newUser = addRedisUser(user);
//         newUser.then(function(result1){
const addRedisUser = async (user) => {
    return new Promise((resolve, reject) => {
        client.get('storedUsers', (error, users) => {
            if(users){
                var oldUsers = JSON.parse(users);
                oldUsers.push(user);
                client.set('storedUsers', JSON.stringify(oldUsers));
                return resolve({
                    users: oldUsers
                })
            } else {
                return reject({
                    error: true,
                    message: error
                })
            }
        })
    })
}

// Function: findSocketRedis
// Syntax:   findSocketRedis(socketID).then(function(result){
const findSocketRedis = (socket) => {
    return new Promise((resolve, reject) => {
        client.get('storedUsers', (error, users) => {
            if(users){
                for(var index = 0; index < users.length; index++){
                    if(users[index].id == socket){
                        return resolve({
                            user: users[index]
                        })
                    }
                }

                return resolve({
                    user: []
                });
            } else {
                return reject({
                    error: true, 
                    message: error 
                })
            }
        })
    })
}

// Function: findRedisUser
// Syntax:   findRedisUser(user).then(function(result){
const findRedisUser = (user) => {
    return new Promise((resolve, reject) => {
        client.get('storedUsers', (error, users) => {
            if(users){
                for(var index = 0; index < users.length; index++){
                    if(users[index].id === user.id){
                        return resolve({
                            user: users[index]
                        });
                    }
                }
            } else {
                return reject({
                    error: true, 
                    message: error 
                })
            }
        })
    })
}

// Function: deleteRedisUser
// Syntax:   deleteRedisUser(user).then(function(result){
const deleteRedisUser = (user) => {
    return new Promise((resolve, reject) => {
        client.get('storedUsers', (error, users) => {
            if(users){
                for(var index=0; index < users.length; index++){
                    if(users[index].id === user.id){
                        users.splice(index, 1);
                        client.set('storedUsers', users);
                        return resolve({
                            users: users
                        });
                    }
                }
            } else {
                return reject({
                    error: true, 
                    message: error 
                })
            }
        } )
    })
}


// Function: setRedisUsers 
// Syntax: var tempUsers = [];
//         setRedisUsers(tempUsers).then(function(result){
const setRedisUsers = (newArray) => {
    return new Promise((resolve, reject) => {
        client.set('storedUsers', JSON.stringify(newArray), function(err, result){
            if(err){
                return reject({
                    error: true,
                    message: err 
                })
            } 

            return resolve({
                users: result 
            })
        });

    })
}


module.exports = {
    createRedisClient,
    getRedisUsers,
    addRedisUser,
    findSocketRedis,
    findRedisUser,
    deleteRedisUser,
    setRedisUsers,
    
}