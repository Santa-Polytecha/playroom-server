let rooms = [];

exports.rooms = function () {
    return rooms;
};

exports.addRoom = function (room) {
    rooms.push(room);
};

exports.removeRoom = function (roomName) {
    const index = rooms.indexOf(rooms.find(room => {
        return room.name === roomName;
    }));
    if(index >= 0)
        rooms.splice(index, 1)
};

exports.userInRoom = function(user){
    rooms.forEach(room => {
        let found = room.users.find(us => {
            return us.name === user
        });
        if(found !== undefined)
            return true;
    });

  return false;
};

exports.findUserRoomBySocketId = function(socketId){
    let found = null;
    rooms.forEach(room => {
        const res = room.users.find(us => {
            return us.socketId === socketId
        });
        if(res != null)
            found = room
    });

  return found;
};

exports.findRoom = function (roomName) {
    return rooms.find(r =>{
        return r.name === roomName;
    })
};