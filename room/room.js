const MessageEmitter = require("../messages/message-emitter");
const User = require("../users/user");
const colors = require('../tools/consoleColors.js');
const errors = require('../messages/error-messages.js');

class Room {
    constructor(name, io, owner) {
        this.owner = owner;
        this.name = name;
        this.users = [];
        this.maxUsers = 10;
        MessageEmitter.initialize(io);
    }

    onCreate(socket) {
        this.logProcessDone();
        this.log("New room created : " + this.name);
        const username = socket.username;
        this.owner = new User(username, socket.id);
        //this.userSubscribers(socket);
        this.addUser(username, socket.id);
        MessageEmitter.emitMessage(this.owner.name, "roomCreated", [this.owner], socket, this.name);
    }

    onJoin(socket) {
        socket.join(this.name, () => {
            const username = socket.username;
            if (!this.isUserAlreadyInRoom(username, socket) && !this.isRoomAlreadyFull(username, socket)) {
                this.onDisconnect(socket);
                this.addUser(username, socket.id);
                MessageEmitter.emitMessage(socket.username, "roomJoined", this.toJsonString(), socket, this.name);
            }
        });
    }

    onLeave(socket) {
        this.removeUser(socket.username);
    }

    onDisconnect(socket) {
        socket.on("disconnect", () => {
            socket.leave(this.name, () => {
                console.log("User disconnected.");
                this.onLeave(socket);
            });
        });

        // socket.on("chat", msg => {
        //     console.log("Chat message");
        //     let message = MessageHandler.testAndExtractFromJson(msg);
        //     this.newMessage(socket.username, message.content);
        // });
    }

    addUser(username, socketId) {
        this.log("New user entered the room " + this.name);
        this.users.push(new User(username, socketId));
        console.log(this.users);
        MessageEmitter.emitBroadcastMessage(username, "userEnter", this.users, this.name);
        return true;
    }

    removeUser(username, socketId) {
        this.log("User removed from the room " + this.name);
        this.users.splice(this.users.indexOf(this.users.find(us => us.name === username)), 1);
        console.log(this.users);
        MessageEmitter.emitBroadcastMessage(username, "userLeave", this.users, this.name);

        if (username === this.owner.name && socketId === this.owner.socketId) {
            this.changeOwner();
        }
    }

    isUserAlreadyInRoom(username, socket) {
        if (this.users.find(user => {
            return user.name === username
        }) !== undefined) {
            MessageEmitter.emitMessage(username, "roomError",
                JSON.stringify({
                    error: "user",
                    message: errors.exceptions.USERNAME_ALREADY_USED
                }), socket, this.name);
            return true;
        }
        return false;
    }

    isRoomAlreadyFull(username, socket) {
        if (this.users.length === this.maxUsers) {
            MessageEmitter.emitMessage(username, "roomError",
                JSON.stringify({
                    error: "user",
                    message: errors.exceptions.ROOM_IS_FULL
                }), socket, this.name);
        }
    }

    changeOwner() {
        const index = Math.floor(Math.random() * (this.users.length - 1));
        this.owner = this.users[index];
        this.log("Owner left the room. New owner : ", this.owner.name);
        MessageEmitter.emitBroadcastMessage(this.owner.name, "newMessage", this.owner, this.name);
    }

    newMessage(user, message) {
        this.log("User " + user + " sent a message : " + message);
        const jsonMessage = {
            author: user,
            date: Date.now(),
            content: message
        };
        const jsonStringMessage = JSON.stringify(jsonMessage);
        MessageEmitter.emitBroadcastMessage(user, "newMessage", jsonStringMessage, this.name);
    }

    log(text) {
        console.log(colors.consoleColors.RoomColor, text);
    }

    logProcessDone() {
        console.log(colors.consoleColors.RoomDoneColor, " DONE ");
    }

    toJson() {
        return {
            name: this.name,
            owner: this.owner,
            users: this.users
        }
    }

    toJsonString() {
        return JSON.stringify(this.toJson());
    }
}

module.exports = Room;