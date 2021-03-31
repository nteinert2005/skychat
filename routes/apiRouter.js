var express = require('express');
var router = express.Router();
const { addUser, getUser, deleteUser, getUsers, getAllUsers } = require('../users');

var tempUsers = [
    {
        username: "test user1"
    }, {
        username: "test user2"
    }, {
        username: "test user3"
    }
];


router.get('/getUsers', (req, res) => {
    var temp = getAllUsers();
    res.json(temp);  
});

router.get('/getRooms', (req, res) => {
    //console.log(req.query);
    var tempID = getUser(req.query.username);
    res.json(tempID);
})



module.exports = router;