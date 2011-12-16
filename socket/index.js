/**
 * Module dependencies.
 */
var socket = require('socket.io');

var steps = [];

module.exports = function(app) {
  var io = socket.listen(app);
  
  io.sockets.on('connection', function(socket) {
    socket.emit('init', steps);
    socket.on('step', function(data) {
      socket.broadcast.emit('step', data);
      steps.push(data);
    });
  });
  
  return io;
};
