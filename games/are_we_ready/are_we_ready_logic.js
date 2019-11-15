
let nb_players; //int
let nb_players_ready; //int
let vip_user; //socket

const topic_ready="ready";
const topic_players="number of players";


function onCreate(vip_user_socket) {
    this.vip_user=vip_user_socket;

    nb_players=0;
    nb_players_ready=0;
}

function reset(){
    this.nb_players_ready=0;
    this.vip_user.emit(topic_ready,nb_players_ready);
    //TODO: send info to players
}

function addPlayer(socket_player) {
    nb_players++;
    socket_player.on(topic_ready, () => {
        newReadyPlayer();
    });
    this.vip_user.emit(topic_players,nb_players);
}

function newReadyPlayer(){
    nb_players_ready++;
    this.vip_user.emit(topic_ready,nb_players_ready);
}

