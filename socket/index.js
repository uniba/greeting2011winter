/**
 * Module dependencies.
 */
var socket = require('socket.io')
  , redis = require('redis')
  , url = require('url');

var parsed = url.parse(process.env.REDISTOGO_URL || 'redis://localhost:6379')
  , auth = (parsed.auth || '').split(':')
  , store = redis.createClient(parsed.port, parsed.hostname)
  , steps = []
  , limit = 300;

store.auth(auth[1], function(err, reply) {
  if (err) {
    return;
  }
});

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
      // store.sadd('steps', data);
    });
  });
  
  return io;
};

exports.routes = {
  steps: function(req, res) {
    res.send(steps);
  }
};
