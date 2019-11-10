const Room = require('../room/room.js');
const MessageHandler = require('../messages/message-handling.js');
const RoomNameGenerator = require('../room/room-name-generator.js');
const Rooms = require('../room/rooms.js');
const colors = require('../tools/consoleColors.js');

exports.listenForRoomCreation = function (io) {
    io.on('connection', (socket) => {
        console.log(colors.consoleColors.InfoColor, 'New user in Lobby.');

        socket.on('createRoom', (msg) => {
            try {
                let message = MessageHandler.testAndExtractFromJson(msg);
                const roomName = RoomNameGenerator.generateName();
                socket.username = message.user;
                socket.join(roomName);
                const room = new Room(roomName, //TODO generate unique room name
                    io, message.user);
                room.onRoomReady();
                room.onJoinRoom(socket);
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
                if(room === undefined)
                    socket.emit("roomError", JSON.stringify({
                        message : `Unknown room name ${roomName}`,
                    }));
                else
                    room.onJoinRoom(socket)
            } catch (e) {
                console.error(e);
            }
        });
    });
};