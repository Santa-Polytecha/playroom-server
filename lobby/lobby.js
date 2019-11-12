const Room = require('../room/room.js');
const MessageHandler = require('../messages/message-handling.js');
const Message = require('../messages/message.js');
const RoomNameGenerator = require('../room/room-name-generator.js');
const Rooms = require('../room/rooms.js');
const colors = require('../tools/consoleColors.js');

extractMessage = function(msg){

};

exports.listenForRoomCreation = function (io) {
    io.on('connection', (socket) => {
        console.log(colors.consoleColors.InfoColor, 'New user in Lobby.');

        socket.on('createRoom', function (msg, ackFn){
            try {
                let message = MessageHandler.testAndExtractFromJson(msg);
                const roomName = RoomNameGenerator.generateName();
                socket.username = message.user;
                socket.join(roomName);
                const room = new Room(roomName, //TODO generate unique room name
                    io, message.user);
                room.onCreate(socket);
                Rooms.addRoom(room)
            } catch (e) {
                console.error(e);
            }
        });

        socket.on('joinRoom', (msg) => {
            try {
                let message = MessageHandler.testAndExtractFromJson(msg);
                const roomName = message.content;
                socket.username = message.user;
                socket.join(roomName);
                let room = Rooms.findRoom(roomName);
                if(room === undefined){
                    const broadcastMessage = new Message(socket.username, "roomError", `Unknown room name ${roomName}`, this.name);
                    socket.emit('roomError',broadcastMessage.toJsonString());
                }
                else
                    room.onJoin(socket)
            } catch (e) {
                console.error(e);
            }
        });

        socket.on("checkAuth", function (msg, ackFn) {
            let message = MessageHandler.testAndExtractFromJson(msg);
            let inRoom = Rooms.userInRoom(message.user);
            console.log("Checking user " + message.user + " auth " + !inRoom);
            ackFn(!inRoom);
        });

        socket.on("deleteRoom", function (msg) {
            let message = MessageHandler.testAndExtractFromJson(msg);
            const roomName = message.content;
            Rooms.removeRoom(roomName)
        })
    });
};