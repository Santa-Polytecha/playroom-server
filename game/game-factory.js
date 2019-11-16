const ChatGame = require('../game/chatgame');

exports.createGameInstance = function (room, io, gameName) {
    switch (gameName) {
        case 'ChatGame':
            return new ChatGame(room.name, io, gameName);
        default:
            return new ChatGame(room.name, io, gameName);
    }
};