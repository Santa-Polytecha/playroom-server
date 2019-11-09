// Get dependencies
const http = require('http');
const env = require("node-env-file");

env("./.env");

const PORT = process.env.ENV_PORT || 3000;

/**
 * Create HTTP server.
 */

const server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Play with your friends in a private & friendly space');
    res.end();
});

server.timeout = 6000000;

const io = require('./socket.io.js').initialize(server);

server.listen(PORT, function() {
    console.log(`Listening on port ${PORT}...`)
    console.log("           __________.__");
    console.log("           \\______   \\  | _____  ___.__._______  ____   ____   _____");
    console.log("            |     ___\/  | \\__  \\<   |  |\\_  __ \\\/  _ \\ \/  _ \\ /     \\")
    console.log("            |    |   |  |__\/ __ \\\\___  | |  | \\(  <_> |  <_> )  Y Y  \\")
    console.log("            |____|   |____(____  / ____| |__|   \\____/ \\____/|__|_|  /")
    console.log("                               \\/\\/                                \\\/ ")
})