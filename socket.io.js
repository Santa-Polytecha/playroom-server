const socket_io = require('socket.io');
var io = null;
var users = [];

exports.io = function () {
    return io;
};

exports.initialize = function (server) {

    io = socket_io(server);

    io.on('connection', function (socket) {
        io.emit('users', users);
    
        socket.on('join', function(msg) {
            const message = JSON.parse(msg);
            var room = message.room
            var username = message.username
            socket.username = username
    
            // user joins room id
            //temporary room id = username
            socket.join(username);
            console.log(socket.username + ' has joined ROOM : ' + username + '. USER ID : ' + socket.id);
    
            // save the name of the user
            users.push(socket.username);
            
        });
    
        socket.on('disconnect', function() {
            for (var i = 0; i < users.length; i++) {
                // remove user from users list
                if (users[i] == socket.username) {
                    users.splice(i, 1);
                };
            };
            console.log(socket.username + ' has disconnected.');
    
            // submit updated users list to all clients
            io.emit('users', users);
    
        });
    
    })
    
};