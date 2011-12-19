/**
 * Module dependencies.
 */
var socket = require('socket.io')
  , url = require('url');

var steps = []
  , limit = 300;

exports.listen = function(app) {
  var io = socket.listen(app);
  
  io.sockets.on('connection', function(socket) {
    if (steps.length > limit) {
      // latest steps
      socket.emit('init', steps.slice(steps.length - limit, steps.length - 1));
    } else {
      socket.emit('init', steps);
    }
    socket.on('step', function(data) {
      socket.broadcast.emit('step', data);
      steps.push(data);
    });
  });
  
  return io;
};

exports.routes = {
  steps: function(req, res) {
    res.send(steps);
  }
};
