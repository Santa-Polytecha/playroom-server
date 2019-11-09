const Room = require('../room/room.js');
const MessageHandler = require('../messages/message-handling.js');
const RoomNameGenerator = require('../room/room-name-generator.js');

exports.listenForRoomCreation = function (io) {
    io.on('connection', (socket) => {
        console.log("New user connected.");

        socket.on('createRoom', (msg) => {
            try {
                let message = MessageHandler.testAndExtractFromJson(msg);
                const roomName = RoomNameGenerator.generateName();
                socket.username = message.user;
                socket.join(roomName);
                const room = new Room(roomName, //TODO generate unique room name
                    io, message.user);
                room.listen();
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
            } catch (e) {
                console.error(e);
            }
        });
    });
};