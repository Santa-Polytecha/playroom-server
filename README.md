## Playroom Server
Building Multiplayer Games with Node.js and Socket.IO

### Introduction
This project aims to experiment with Node.js and the Socket.IO library in order to create a real-time gaming experience.

### Launch project
Your computer must have [Node](https://nodejs.org/en/) installed.

In order for the project to work run the following commands :
    
    > npm install
    > node server
  
You can add your own .env file with your own port configuration.
    
    > ENV_PORT = 3002
    
### Technologies

- **Node.js** - Node provides the foundation for the back-end portion of the game, and allows the use of the Socket.IO library.

- **Socket.IO** - Socket.IO makes it possible and simple to open a real-time, bidirectional communication channel between a web browser (if it supports websockets protocol) and a server.

### Features description

| Feature           | Description                                                                                             |
|-------------------|---------------------------------------------------------------------------------------------------------|
| Create a new room | A player can also a new room instance. The server will return an ID, so that others can use it to join. |
| Join a room       | A player will be able to join a room by specifying the room’s ID.                                       |
| Start a game      | The game owner can start a choosen game.                                                                |

### Games 

Start a new game means creating a new instance of a particular game :
    - Chat game
    - Drawing game
    ...
This new instance will be specific to a room.
Any modifications done to this game will only affect the room so that many groups can play the same game.