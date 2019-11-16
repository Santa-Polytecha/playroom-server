const Game = require('../game/game');
const MessageEmitter = require("../messages/message-emitter");

class ChatGame extends Game {

    constructor(roomName, io) {
        super(roomName, io, "ChatGame");
        this.messages = []
    }

    init(){
        Game.logProcessDone();
        Game.log("Game created : " + this.gameId);
        Game.log(`${this.gameName} : Chat with your friends in a private area`);
    }

    bindToGameEvents(socket){
        socket.on("newMessage", msg =>{
            const message = JSON.parse(msg);
            this.newMessage(socket.username, message);
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

}

module.exports = ChatGame;