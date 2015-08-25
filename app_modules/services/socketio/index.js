'use strict';

var rabbit = global.rabbit;

module.exports = function(socketio) {
  var broadcastHandler = rabbit.handle('api.broadcast.#', function(message) {

    console.log('sending update: ' + message);
    socketio.sockets.emit('update', JSON.stringify(message.body));
    message.ack();
  });
  /*socketio.use(require('socketio-jwt').authorize({
    secret: config.secrets.session,
    handshake: true
  }));*/

  socketio.on('connection', function(socket) {
    socket.emit('message', 'You are connected!!!!');
    socket.on('disconnect', function() {

    });
    socket.on('joinRoom', function(data) {
      console.log('joined room: ', data);
      socket.join(data.room);
    });
  });
};