const Game = require('../game/game');
const MessageEmitter = require("../messages/message-emitter");

class CollaborativeDrawing extends Game {

    constructor(roomName, io) {
        super(roomName, io, "CollaborativeDrawing");
        this.messages = []
    }

    init(){
        Game.logProcessDone();
        Game.log("Game created : " + this.gameId);
        Game.log(`${this.gameName} : Draw on the same sketch with your friends`);
    }

    bindToGameEvents(socket){
        socket.on("newMessage", msg =>{
            const message = JSON.parse(msg);
            this.newMessage(socket.username, message);
        });

        socket.on("newDrawing", msg =>{
            const message = JSON.parse(msg);
            this.drawing(socket.username, message);
        })
    }

    newMessage(user, message) {
        Game.log("User " + user + " sent a message : " + message.content);
        const jsonMessage = {
            id: Date.now(),
            author: user,
            date: Date.now(),
            room: this.roomName,
            content: message.content,
        };
        const jsonStringMessage = JSON.stringify(jsonMessage);
        MessageEmitter.emitBroadcastMessage(user, "chatMessage", jsonStringMessage, this.roomName);
        this.messages.push(jsonMessage);
    }

    drawing(user, message) {
        MessageEmitter.emitBroadcastMessage(user, "drawing", message.content, this.roomName);
    }

}

module.exports = CollaborativeDrawing;