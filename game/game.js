
const Round = require('../game/round');
const colors = require('../tools/consoleColors.js');

class Game {

    constructor(roomName, io, gameName) {
        this.gameName = gameName;
        this.io = io;
        this.roomName = roomName;
        this.isConstrainedByTime = false;
        this.timeLeft = 3600; //1h
        this.rounds = [];
        this.gameId = Date.now();

        if(this.isConstrainedByTime)
            this.startCountdown();

        this.init();
    }

    init(){
        Game.logProcessDone();
        Game.log("Game created : " + this.gameId);
        Game.log(`${this.gameName} : Game presentation`);
    }

    startCountdown() {
        setInterval(() => {
            this.io.sockets.in(this.roomName).emit("game-finished");
        }, this.timeLeft);
    }

    bindToGameEvents(socket){

    }

    joinGameLater(socket){
        this.bindToGameEvents(socket);
    }

    createRound() {
        console.log('Creating new round at Game: ', this.gameName);
        const newRound = new Round(this.gameName, this.rounds.length, this.io);
        return this.rounds.push(newRound);
    }

    static log(text) {
        console.log(colors.consoleColors.GameColor, text);
    }

    static logProcessDone() {
        console.log(colors.consoleColors.GameDoneColor, " DONE ");
    }

}

module.exports = Game;