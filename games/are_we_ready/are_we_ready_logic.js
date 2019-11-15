const topics = require('./topics.js');
const subscription = require('./SocketSubscription');
const msgEmitter = require('../../messages/message-emitter');
const msgTypes=require('../../messages/message-types');

export let nb_players; //int
export let nb_players_ready; //int
export let vip_user; //socket
export let roomName;

function onCreate(vip_user_socket, roomName_) {
    this.vip_user=vip_user_socket;
    this.roomName=roomName_;
    nb_players=0;
    nb_players_ready=0;
}



function addPlayer(socket_player) {
    nb_players++;
    msgEmitter.emitBroadcastMessage(socket_player.username,topics.NB_PLAYERS,socket_player.username,game.roomName);

}



