const ChatGame = require('../game/chatgame');
const CollaborativeDrawing = require('../game/collaborative-drawing');

exports.createGameInstance = function (room, io, gameName) {
    switch (gameName) {
        case 'ChatGame':
            return new ChatGame(room.name, io, gameName);
        case 'CollaborativeDrawing':
            return new CollaborativeDrawing(room.name, io, gameName);
        default:
            return new ChatGame(room.name, io, gameName);
    }
};