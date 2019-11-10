const Message = require('../messages/message.js');
const MessageHandler = require("../messages/message-handling");

class Room {
    constructor(name, io, owner) {
        this.owner = owner;
        this.name = name;
        this.users = [];
        this.io = io;
        this.namespace = io.of("/" + name);
        this.broadcast = io.to(name);
        this.room = io.sockets.in(name);
    }

    listen() {

        this.io.on('join', (username) => {
            this.addUser(username);
        });

        this.io.on('leave', (username) => {
            this.removeUser(username);
        });

        this.io.on('chat', (msg) => {
            const chatMessage = MessageHandler.testAndExtractFromJson(msg);
            this.newMessage(chatMessage.user, chatMessage.content)
        });

        this.onRoomReady();
        // this.addUser(this.owner);
    }

    onRoomReady() {
        console.log("New room created : " + this.name);
        const broadcastMessage = new Message(this.owner, "roomCreated", this.name);
        this.broadcast.emit('roomCreated', broadcastMessage.toJsonString());
    }

    onJoinRoom(socket) {
        const username = socket.username;
        this.addUser(username);
    }

    onLeaveRoom(socket) {
        const username = socket.username;
        this.removeUser(username);
    }

    addUser(user) {
        console.log("New user entered the room " + this.name);
        this.users.push(user);
        console.log(this.users);
        const broadcastMessage = new Message(user, "userEnter", this.users);
        this.broadcast.emit("userEnter", broadcastMessage.toJsonString());
    }

    removeUser(user) {
        console.log("User entered the room " + this.name);
        this.users.splice(this.users.indexOf(user), 1);
        const broadcastMessage = new Message(user, "userLeave", this.users);
        this.broadcast.emit("userLeave", broadcastMessage.toJsonString());
    }

    newMessage(user, message) {
        console.log("User " + user + " sent a message : " + message);
        const jsonMessage = {
            author: user,
            date: Date.now(),
            content: message
        };
        const jsonStringMessage = JSON.stringify(jsonMessage);
        const broadcastMessage = new Message(user, "newMessage", jsonStringMessage);
        this.broadcast.emit("newMessage", broadcastMessage.toJsonString());
    }
}

module.exports = Room;