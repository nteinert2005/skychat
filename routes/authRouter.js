const express = require('express');
const router = express.Router();

const userRooms = [
    {
        "user": "sky1",
        "room": "Team 1",
    },
    {
        "user": "sky2",
        "room": "Team 2",
    },
    {
        "user": "sky3",
        "room": "Team 3"
    },
    {
        "user": "sky4",
        "room": "Team 1"
    },
    {
        "user": "sky5",
        "room": "Team 2"
    },
    {
        "user": "sky6",
        "room": "Team 3"
    }
];


router.get('/login', (req, res) => {
    var username = req.query.username;
    let authCheck = false;

    for(var index = 0; index < userRooms.length; index++){
        if(userRooms[index].user == username){
            authCheck = true;
        }
    }

    res.send({
        data: authCheck
    });
});

module.exports = router;