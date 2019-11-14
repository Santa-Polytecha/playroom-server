const Message = require('../messages/message.js');
const MessageHandler = require("../messages/message-handling");

class User {
    constructor(name, id, room) {
        this.name = name;
        this.socketId = id;
    }
}

module.exports = User;