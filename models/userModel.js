const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    socket_id: String,
    name: String,
    rooms: []
});

const Users = mongoose.model("Users", userSchema);

module.exports = {
    Users: Users
}