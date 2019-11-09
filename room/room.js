const Message = require('../messages/message.js');
const MessageHandler = require("../messages/message-handling");

class Room {
    constructor(name, io, owner) {
        this.owner = owner;
        this.name = name;
        this.users = [owner];
        this.namespace = io.of('/' + name);
    }

    listen() {
        this.namespace.on('join', (socket) => {
            const username = socket.username;
            this.addUser(username);

            //leave room
            socket.on('leave', (msg) => {
                this.removeUser(username);
            });

            //chat messages
            socket.on('chat', (msg) => {
                const chatMessage = MessageHandler.testAndExtractFromJson(msg);
                this.newMessage(username,chatMessage.content)
            });
        });

        this.onRoomReady();
    }

    onRoomReady(){
        console.log("New room created.");
        const broadcastMessage = new Message(this.owner, "roomCreated", this.name);
        this.namespace.emit(broadcastMessage.toJsonString());
    }

    addUser(user){
        console.log("New user entered the room " + this.name);
        this.users.push(user);
        const broadcastMessage = new Message(user, "userEnter", this.users);
        this.namespace.emit(broadcastMessage.toJsonString());
    }

    removeUser(user){
        console.log("User entered the room " + this.name);
        this.users.splice(this.users.indexOf(user),1);
        const broadcastMessage = new Message(user, "userLeave", this.users);
        this.namespace.emit(broadcastMessage.toJsonString());
    }

    newMessage(user, message){
        console.log("User " + user + " sent a message : " + message);
        const broadcastMessage = new Message(user, "newMessage", message);
        this.namespace.emit(broadcastMessage.toJsonString());
    }
}

module.exports = Room;