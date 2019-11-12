const Message = require('../messages/message.js');
const MessageHandler = require("../messages/message-handling");
const User = require("../users/user");
const colors = require('../tools/consoleColors.js');
const errors = require('./error-messages.js');

class Room {
    constructor(name, io, owner) {
        this.owner = owner;
        this.name = name;
        this.users = [];
        this.broadcast = io.to(name);
        this.maxUsers = 10;
    }

    onCreate(socket) {
        this.logProcessDone();
        this.log("New room created : " + this.name);
        const username = socket.username;
        this.owner = new User(username,socket.id);
        this.userSubscribers(socket);
        this.addUser(username, socket.id);
        this.emitMessage(this.owner.name, "roomCreated", [this.owner], socket);
    }

    onJoin(socket) {
        socket.join(this.name, () => {
            const username = socket.username;
            if (!this.isUserAlreadyInRoom(username, socket) && !this.isRoomAlreadyFull(username, socket)) {
                this.userSubscribers(socket);
                this.addUser(username, socket.id);
                this.emitMessage(socket.username, "roomJoined", this.toJsonString(), socket);
            }
        });
    }

    onLeave(socket) {
        const username = socket.username;
        this.removeUser(username);
        // this.unsubscribeUser(socket);
    }

    userSubscribers(socket) {
        socket.on("userLeave", () => {
            this.onLeave(socket);
        });

        socket.on("disconnect", () => {
            socket.leave(this.name, () => {
                console.log("User disconnected.");
                this.onLeave(socket);
            });
        });

        socket.on("chat", msg => {
            console.log("Chat message");
            let message = MessageHandler.testAndExtractFromJson(msg);
            this.newMessage(socket.username, message.content);
        });
    }

    addUser(username, socketId) {
        this.log("New user entered the room " + this.name);
        this.users.push(new User(username, socketId));
        console.log(this.users);
        this.emitBroadcastMessage(username, "userEnter", this.users);
        return true;
    }

    removeUser(username, socketId) {
        this.log("User removed from the room " + this.name);
        this.users.splice(this.users.indexOf(this.users.find(us => us.name === username)), 1);
        console.log(this.users);
        this.emitBroadcastMessage(username, "userLeave", this.users);

        if (username === this.owner.name && socketId === this.owner.socketId){
            this.changeOwner();
        }
    }

    isUserAlreadyInRoom(username, socket) {
        if (this.users.find(user => {
            return user.name === username
        }) !== undefined) {
            this.emitMessage(username, "roomError", errors.exceptions.USERNAME_ALREADY_USED, socket);
            return true;
        }
        return false;
    }

    isRoomAlreadyFull(username, socket) {
        if (this.users.length === this.maxUsers) {
            this.emitMessage(username, "roomError", errors.exceptions.ROOM_IS_FULL, socket);
        }
    }

    changeOwner() {
        const index = Math.floor(Math.random() * (this.users.length - 1));
        this.owner = this.users[index];
        this.log("Owner left the room. New owner : ", this.owner.name);
        this.emitBroadcastMessage(this.owner.name, "newMessage", this.owner);
    }

    newMessage(user, message) {
        this.log("User " + user + " sent a message : " + message);
        const jsonMessage = {
            author: user,
            date: Date.now(),
            content: message
        };
        const jsonStringMessage = JSON.stringify(jsonMessage);
        this.emitBroadcastMessage(user, "newMessage", jsonStringMessage);
    }

    isMessageForRoom(msg) {
        const message = MessageHandler.testAndExtractFromJson(msg);
        return message.room === this.name;
    }

    log(text) {
        console.log(colors.consoleColors.RoomColor, text);
    }

    logProcessDone() {
        console.log(colors.consoleColors.RoomDoneColor, " DONE ");
    }

    logError(text) {
        console.log(colors.consoleColors.Error, text);
    }

    emitBroadcastMessage(user, type, message) {
        try {
            const broadcastMessage = new Message(user, type, message, this.name);
            this.broadcast.emit(type, broadcastMessage.toJsonString());
        } catch (e) {
            this.logError(e)
        }
    }

    emitMessage(user, type, message, socket) {
        try {
            const broadcastMessage = new Message(user, type, message, this.name);
            socket.emit(type, broadcastMessage.toJsonString());
        } catch (e) {
            this.logError(e)
        }
    }

    unsubscribeUser(socket){
        //TODO doesn't work removeListner or off function doesn't seem to exist
        socket.off("disconnect", function () {

        });
        socket.off("chat", function () {

        });
        socket.off("leaveRoom", function () {

        });
    }

    toJson(){
        return {
            name : this.name,
            owner : this.owner,
            users: this.users
        }
    }

    toJsonString(){
        return JSON.stringify(this.toJson());
    }
}

module.exports = Room;