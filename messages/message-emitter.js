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

/**
 *
 * @param user username of the sender of the message ?
 * @param type topic on which to send the message
 * @param message message / data
 * @param roomName
 */
exports.emitBroadcastMessage = function (user, type, message, roomName) {
    try {
        const broadcastMessage = new Message(user, type, message, roomName);
        this.io.sockets.in(roomName).emit(type, broadcastMessage.toJsonString());
    } catch (e) {
        this.logError(e)
    }
};

/**
 *
 * @param user username of the sender of the message ?
 * @param type topic on which to send the message
 * @param message message / data
 * @param socket destination socket 
 * @param roomName
 */
exports.emitMessage = function (user, type, message, socket, roomName) {
    try {
        const broadcastMessage = new Message(user, type, message, roomName);
        socket.emit(type, broadcastMessage.toJsonString());
    } catch (e) {
        this.logError(e)
    }
};
