let rooms = [];

exports.rooms = function () {
    return rooms;
};

exports.addRoom = function (room) {
    rooms.push(room);
};

exports.removeRoom = function (room) {
  rooms.splice(rooms.indexOf(room), 1)
};

exports.findRoom = function (roomname) {
    return rooms.find(r =>{
        return r.name === parseInt(roomname);
    })
};