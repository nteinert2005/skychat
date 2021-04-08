const redis = require('redis');
const client = redis.createClient({
    host: 'ec2-54-208-89-233.compute-1.amazonaws.com',
    port: 11039,
    auth_pass: 'p551765675b247d78dddf9b57847dd89db0af13d4ab51b86fdf47f976ad7a365a'
});

const userList = [
    {
        id: 1,
        username: "sky1"
    }
]



function setRedis() {
    client.set('storedUsers', JSON.stringify(userList));
}

function getRedis() {
    client.get('storedUsers', async (err, users) => {
        if(err) throw err;

        if(users){
            return JSON.parse(users);
        } else {
            return false;
        }
    })
}


module.exports = {
    client,
    setRedis,
    getRedis
}