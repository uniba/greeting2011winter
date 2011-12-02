/**
 * Module dependencies.
 */
var express = require('express');

/**
 * Configuration
 */
module.exports = function(app) {
  return {
    default: function() {
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(require('stylus').middleware({ src: __dirname + '/public' }));
      app.use(app.router);
      app.use(express.static(__dirname + '/public'));
      app.enable('jsonp callback');
    }
  , development: function() {
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }
  , production: function() {
      app.use(express.errorHandler()); 
    }
  };
};
