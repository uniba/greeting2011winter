/**
 * Module dependencies.
 */
var socket = require('socket.io')
  , redis = require('redis')
  , url = require('url');

var port = process.env.REDIS_PORT || 6379
  , host = process.env.REDIS_HOST || 'localhost'
  , store = redis.createClient(port, host)
  , steps = []
  , limit = 100;

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
