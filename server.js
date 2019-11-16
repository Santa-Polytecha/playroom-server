// Get dependencies
const http = require('http');
const env = require("node-env-file");
const colors = require('./tools/consoleColors.js');

env("./.env");

const PORT = process.env.ENV_PORT || 3001;

/**
 * Create HTTP server.
 */

const server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Play with your friends in a private & friendly space');
    res.end();
});

server.timeout = 6000000;
const io = require('./socket.io.js');

server.listen(PORT, function() {
    io.initialize(server);

    console.log();
    console.log(colors.consoleColors.ServerDoneColor, " DONE ")
    console.log(colors.consoleColors.ServerColor, `Listening on port ${PORT}...`)
    console.log(colors.consoleColors.ServerColor, "           __________.__");
    console.log(colors.consoleColors.ServerColor, "           \\______   \\  | _____  ___.__._______  ____   ____   _____");
    console.log(colors.consoleColors.ServerColor, "            |     ___\/  | \\__  \\<   |  |\\_  __ \\\/  _ \\ \/  _ \\ /     \\")
    console.log(colors.consoleColors.ServerColor, "            |    |   |  |__\/ __ \\\\___  | |  | \\(  <_> |  <_> )  Y Y  \\")
    console.log(colors.consoleColors.ServerColor, "            |____|   |____(____  / ____| |__|   \\____/ \\____/|__|_|  /")
    console.log(colors.consoleColors.ServerColor, "                               \\/\\/                                \\\/ ")
});