const express = require('express');
const socket = require('socket.io');

//App setup
const app = express();
const server = app.listen(3000, function () {
  console.log('listening to requests on port 3000')
});

const getApi =

  //Static files
  app.use(express.static('public'));

//Socket setup (kollar på const server, rad 6)
const io = socket(server);

//Listen when the connection is made. Listens to event name connection.
//we pass in an callback function
io.on('connection', function (socket) {
  console.log('made a socket connection', socket.id);

  //listen to the server to display the message
  socket.on('chat', function (data) {
    io.sockets.emit('chat', data)
  });

  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', data)

  });
});
