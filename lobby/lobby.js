const Room = require('../room/room.js');
const GameFactory = require('../game/game-factory');
const Games = require('../game/games');
const MessageHandler = require('../messages/message-handling.js');
const Message = require('../messages/message.js');
const RoomNameGenerator = require('../room/room-name-generator.js');
const Rooms = require('../room/rooms.js');
const colors = require('../tools/consoleColors.js');

exports.listenForRoomCreation = function (io) {
    io.on('connection', (socket) => {
        console.log(colors.consoleColors.InfoColor, 'New user in Lobby.');
        subscribeToLobbyListeners(socket, io);
    });
};

subscribeToLobbyListeners = function(socket, io){
    subscribeRoomCreated(socket, io);
    subscribeRoomJoined(socket);
    subscribeRoomLeft(socket, io);
    subscribeCheckAuth(socket);
    subscribeRoomDeleted(socket);
    subscribeGameStarted(socket, io);
};

subscribeRoomCreated = function (socket, io) {
    socket.on('createRoom', function (msg, ackFn) {
        try {
            let message = MessageHandler.testAndExtractFromJson(msg);
            const roomName = RoomNameGenerator.generateName();
            socket.username = message.user;
            socket.join(roomName);
            const room = new Room(roomName, io, message.user);
            room.onCreate(socket);
            Rooms.addRoom(room)
        } catch (e) {
            console.error(e);
        }
    });
};

subscribeRoomJoined = function (socket) {
    socket.on('joinRoom', (msg) => {
        try {
            let message = MessageHandler.testAndExtractFromJson(msg);
            const roomName = message.content;
            socket.username = message.user;
            socket.join(roomName);
            let room = Rooms.findRoom(roomName);
            if (room === undefined) {
                const broadcastMessage = new Message(socket.username, "roomError",
                    JSON.stringify({
                        error: "room",
                        message: `Unknown room name ${roomName}`
                    }), this.name);
                socket.emit('roomError', broadcastMessage.toJsonString());
            } else
                room.onJoin(socket)
        } catch (e) {
            console.error(e);
        }
    });
};

subscribeCheckAuth = function (socket) {
    socket.on("checkAuth", function (msg, ackFn) {
        let message = MessageHandler.testAndExtractFromJson(msg);
        let inRoom = Rooms.userInRoom(message.user);
        console.log("Checking user " + message.user + " auth " + !inRoom);
        ackFn(!inRoom);
    });
};

subscribeRoomDeleted = function (socket) {
    socket.on("deleteRoom", function (msg) {
        let message = MessageHandler.testAndExtractFromJson(msg);
        const roomName = message.content;
        Rooms.removeRoom(roomName)
    });
};

subscribeRoomLeft = function (socket, io) {
    socket.on("userLeave", function (msg) {
        let message = MessageHandler.testAndExtractFromJson(msg);
        const roomName = message.room;
        const socketid = message.content.id;
        let room = Rooms.findRoom(roomName);
        if (room !== undefined && socketid === socket.id) {

            //user leave the room
            room.onLeave(socket);

            //user unsubscribe from Room and Game listeners
            socket.removeAllListeners();

            //user subscribe to Lobby listeners
            subscribeToLobbyListeners(socket, io);
        }
    })
};

subscribeGameStarted = function (socket, io) {
    socket.on("startGame", function (msg) {
        let message = MessageHandler.testAndExtractFromJson(msg);
        const roomName = message.room;
        const gameName = message.content;
        let room = Rooms.findRoom(roomName);
        if (room !== undefined) {
            const game = GameFactory.createGameInstance(room, io, gameName);
            Games.addGame(game);
            room.initGame(game);
        }
    })
};