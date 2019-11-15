const game = require('./are_we_ready_logic');
const topics = require('./topics.js');
const msgEmitter = require('../../messages/message-emitter');
const msgTypes=require('../../messages/message-types');

export const subFunctions = {
    PlayerReady: exports.PlayerReady,
    resetGame: exports.resetGame
};

/**
 * increment number of players marked as ready and send the info to vip
 */
exports.playerReady=function(){
    game.nb_players_ready++;
    msgEmitter.emitBroadcastMessage(game.vip_user.username,topics.NB_PLAYERS_READY,game.nb_players_ready,game.roomName);
};

/**
 * set number of player ready to 0 and send info to vip
 */
exports.resetGame=function(){
    game.nb_players_ready=0;
    msgEmitter.emitBroadcastMessage(game.vip_user.username,topics.NB_PLAYERS_READY,game.nb_players_ready,game.roomName);
};



export function setUpSocket(socket) {
    socket.on(topics.NB_PLAYERS_READY, playerReady());
    socket.on(topics.RESET,resetGame());

}