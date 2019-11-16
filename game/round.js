const MessageEmitter = require("../messages/message-emitter");

class Round {
    constructor(roomId, roundNumber, io) {
        this.io = io;
        this.timeLeft = 60; //60 seconds
        this.roomId = roomId;
        this.timestamp = Date.now();
        this.roundNumber = roundNumber;
        console.log("Starting round " + this.roundNumber);

        this.startCountdown();
    }

    startCountdown() {
        const countdown = setInterval(() => {
            this.io.sockets.in(this.roomId).emit("round-countdown", this.timeLeft);
            if (this.timeLeft === 0) {
                clearInterval(countdown);
                this.onRoundEnd();
            } else {
                this.timeLeft -= 1;
            }
        }, 1000);
    }

    onRoundEnd() {
        console.log("Ending round " + this.roundNumber);

        //count points or other thing
    }
}

module.exports = Round;