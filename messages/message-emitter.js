const Message = require('../messages/message.js');
const colors = require('../tools/consoleColors.js');

let io = null;

exports.io = function () {
    return io;
};

exports.initialize = function (io) {
    this.io = io;
};

exports.logError = function (text) {
    console.log(colors.consoleColors.Error, text);
};

exports.emitBroadcastMessage = function (user, type, message, roomName) {
    try {
        const broadcastMessage = new Message(user, type, message, roomName);
        this.io.sockets.in(roomName).emit(type, broadcastMessage.toJsonString());
    } catch (e) {
        this.logError(e)
    }
};

exports.emitMessage = function (user, type, message, socket, roomName) {
    try {
        const broadcastMessage = new Message(user, type, message, roomName);
        socket.emit(type, broadcastMessage.toJsonString());
    } catch (e) {
        this.logError(e)
    }
};
