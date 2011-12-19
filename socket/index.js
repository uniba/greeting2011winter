/**
 * Module dependencies.
 */
var socket = require('socket.io')
  , schema = require('../schema')
  , mongoose = schema.mongoose
  , Step = mongoose.model('Step', schema.Step);

var steps = []
  , limit = 300;

schema.connect(function(err) {
  if (err) {
    return;
  }
  Step.find({}, function(err, doc) {
    if (err) {
      return;
    }
    steps = doc.concat(steps);
  });
})

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
      var i
        , step;
      
      socket.broadcast.emit('step', data);
      steps.push(data);
      
      // persistent
      step = new Step();
      step.client = socket.id;
      for (i in data) {
        step[i] = data[i];
      }
      step.save(function(err) { });
    });
  });
  
  return io;
};

exports.routes = {
  steps: function(req, res) {
    res.send(steps);
  }
};
