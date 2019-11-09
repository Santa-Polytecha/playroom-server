const socket_io = require('socket.io');
const lobby = require('./lobby/lobby.js');
let io = null;

exports.io = function () {
    return io;
};

exports.initialize = function (server) {
    io = socket_io(server);
    lobby.listenForRoomCreation(io);
};