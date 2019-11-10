const Room = require('../room/room.js');
const MessageHandler = require('../messages/message-handling.js');
const RoomNameGenerator = require('../room/room-name-generator.js');
const Rooms = require('../room/rooms.js');

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
                room.onJoinRoom(socket)
                Rooms.addRoom(room)
                // socket.broadcast.to(roomName).emit('join', message.user);
            } catch (e) {
                console.error(e);
            }
        });

        socket.on('joinRoom', (msg) => {
            try {
                let message = MessageHandler.testAndExtractFromJson(msg);
                const roomName = message.content;
                console.log("A new user want to join room : " + roomName)
                socket.username = message.user;
                socket.join(roomName);
                let room = Rooms.findRoom(roomName);
                if(room === undefined)
                    socket.emit("error", JSON.stringify({
                        message : "Unknown room name " + roomName,
                    }));
                else
                    room.onJoinRoom(socket)
            } catch (e) {
                console.error(e);
            }
        });
    });
};