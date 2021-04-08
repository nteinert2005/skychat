const redis = require('redis');
const client = redis.createClient({
    host: 'ec2-54-208-89-233.compute-1.amazonaws.com',
    port: 11039,
    auth_pass: 'p551765675b247d78dddf9b57847dd89db0af13d4ab51b86fdf47f976ad7a365a'
});

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

const findRedisUser = (user) => {
    // promise 
}

const deleteRedisUser = (user) => {
    // promise
}

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
    client,
    getRedisUsers,
    addRedisUser,
    findRedisUser,
    deleteRedisUser,
    setRedisUsers
}