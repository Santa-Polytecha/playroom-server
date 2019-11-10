const Message = require('../messages/message.js');
const MessageHandler = require("../messages/message-handling");

class Room {
    constructor(name, io, owner) {
        this.owner = owner;
        this.name = name;
        this.users = [];
        this.broadcast = io.to(name);
    }

    onRoomReady() {
        console.log("New room created : " + this.name);
        const broadcastMessage = new Message(this.owner, "roomCreated", this.name, this.name);
        this.broadcast.emit('roomCreated', broadcastMessage.toJsonString());
    }

    onJoinRoom(socket) {
        const username = socket.username;
        this.userLifeCircle(socket);
        const broadcastMessage = new Message(socket.username, "roomJoined", this.name, this.name);
        socket.emit('roomJoined',broadcastMessage.toJsonString());
        this.addUser(username);
    }

    onLeaveRoom(socket) {
        const username = socket.username;
        this.removeUser(username);
    }

    userLifeCircle(socket){
        socket.on("leaveRoom", () => {
            socket.leave(this.name, () => {
                this.onLeaveRoom(socket.username);
                socket.disconnect();
            });
        });

        socket.on("disconnect", () => {
            socket.leave(this.name, () => {
                this.onLeaveRoom(socket.username);
                socket.disconnect();
            });
        });

        socket.on("chat", msg => {
            let message = MessageHandler.testAndExtractFromJson(msg);
            this.newMessage(socket.username, message.content);
        })
    }

    addUser(user) {
        console.log("New user entered the room " + this.name);
        this.users.push(user);
        console.log(this.users);
        const broadcastMessage = new Message(user, "userEnter", this.users, this.name);
        this.broadcast.emit("userEnter", broadcastMessage.toJsonString());
    }

    removeUser(user){
        console.log("User removed from the room " + this.name);
        this.users.splice(this.users.indexOf(user),1);
        console.log(this.users);
        const broadcastMessage = new Message(user, "userLeave", this.users, this.name);
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
        const broadcastMessage = new Message(user, "newMessage", jsonStringMessage, this.name);
        this.broadcast.emit("newMessage", broadcastMessage.toJsonString());
    }

    isMessageForRoom(msg){
        const message = MessageHandler.testAndExtractFromJson(msg);
        return message.room === this.name;
    }
}

module.exports = Room;