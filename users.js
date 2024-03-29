const CONNECTED_USERS = []

/*
    users = [
        {
            id: 'jalksdjlk2w342",
            name: "sky1",
            room: [
                "Team 1",
                "General"
            ]
        }
    ]
*/

const displayUsers = () => {
    console.log(CONNECTED_USERS);
}


const addUser = (id, name, room) => {
    const existingUser = CONNECTED_USERS.find(user => CONNECTED_USERS.name === name)

    if (existingUser) return { error: "Username has already been taken" }
    if (!name && !room) return { error: "Username and room are required" }
    if (!name) return { error: "Username is required" }
    if (!room) return { error: "Room is required" }

    const user = { id, name, room }
    CONNECTED_USERS.push(user)
    displayUsers();
    return { user }
}

const getUser = user => {
    //console.log(user);
    //console.log('--- name: '+user+" ---");
    const temp = CONNECTED_USERS.find(user => CONNECTED_USERS.name === user.username)
    return temp;
}

const deleteUser = (id) => {
    const index = CONNECTED_USERS.findIndex((user) => user.id === id);
    if (index !== -1) return CONNECTED_USERS.splice(index, 1)[0];
}

const findBySocketID = user => {
    //console.log('--- user: '+user+" ---");
    for(var index = 0; index < CONNECTED_USERS.length; index++){
        if(CONNECTED_USERS[index].id == user){
            console.log('--- found: '+CONNECTED_USERS[index].name+" ---");
            return CONNECTED_USERS[index];
        }
    }
    
    
}

const getAllUsers = () => {
    const users = CONNECTED_USERS;
    return users;
}

const getUsers = (room) => {
    var users = CONNECTED_USERS.filter(user => user.room === room)
    return users;
}

module.exports = { addUser, getUser, deleteUser, getUsers, getAllUsers, findBySocketID }
