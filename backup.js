io.on('connection', function (socket) {
    io.emit('users', users);

    socket.on('join', function(msg) {
        const message = JSON.parse(msg);
        var room = message.room
        var username = message.username
        socket.username = username

        // user joins room id
        socket.join(room);
        console.log(socket.username + ' has joined. ROOM : ' + socket.id);

        // save the name of the user
        users.push(socket.username);

        // if the user is first to join OR 'drawer' room has no connections
        if (users.length == 1 || typeof io.sockets.adapter.rooms['drawer'] === 'undefined') {

            // place user into 'drawer' room
            socket.join('drawer');

            // server submits the 'drawer' event to this user
            io.in(socket.username).emit('drawer', socket.username);
            console.log(socket.username + ' is a drawer');

            // send the random word to the user inside the 'drawer' room
            io.in(socket.username).emit('draw word', newWord());
        //	console.log(socket.username + "'s draw word (join event): " + newWord());
        } 

        // if there are more than one names in users 
        // or there is a person in drawer room..
        else {

            // additional users will join the 'guesser' room
            socket.join('guesser');

            // server submits the 'guesser' event to this user
            io.in(socket.username).emit('guesser', socket.username);
            console.log(socket.username + ' is a guesser');
        }
    
        // update all clients with the list of users
        io.emit('users', users);
        
    });

    // submit drawing on canvas to other clients
    socket.on('draw', function(obj) {
        socket.broadcast.emit('draw', obj);
    });

    // submit each client's guesses to all clients
    socket.on('guessword', function(data) {
        io.emit('guessword', { username: data.username, guessword: data.guessword})
        console.log('guessword event triggered on server from: ' + data.username + ' with word: ' + data.guessword);
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

        // if 'drawer' room has no connections..
        if ( typeof io.sockets.adapter.rooms['drawer'] === "undefined") {
            
            // generate random number based on length of users list
            var x = Math.floor(Math.random() * (users.length));
            console.log(users[x]);

            // submit new drawer event to the random user in userslist
            io.in(users[x]).emit('drawer', users[x]);
        };
    });

    socket.on('drawer', function(name) {

        // remove user from 'guesser' room
        socket.leave('guesser');

        // place user into 'drawer' room
        socket.join('drawer');
        console.log('new drawer emit: ' + name);

        // submit 'drawer' event to the same user
        socket.emit('drawer', name);
        
        // send a random word to the user connected to 'drawer' room
        io.in('drawer').emit('draw word', newWord());
    
    });

    // initiated from drawer's 'dblclick' event in Player list
    socket.on('guesser', function(data) {

        // drawer leaves 'drawer' room and joins 'guesser' room
        socket.leave('drawer');
        socket.join('guesser');

        // submit 'guesser' event to this user
        socket.emit('guesser', socket.username);

        // submit 'drawer' event to the name of user that was doubleclicked
        io.in(data.to).emit('drawer', data.to);

        // submit random word to new user drawer
        io.in(data.to).emit('draw word', newWord());
    
        io.emit('reset', data.to);

    });

    socket.on('correct answer', function(msg) {
        io.emit('correct answer', msg);
        console.log(msg.data.username + ' guessed correctly with ' + msg.data.guessword);
    });

    socket.on('clear screen', function(msg) {
        io.emit('clear screen', msg.data.room);
    });

})