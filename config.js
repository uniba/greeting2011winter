/**
 * Module dependencies.
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');

// stylus compiler
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .include(nib.path);
}

/**
 * Configuration
 */
module.exports = function(app) {
  return {
    all: function() {
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
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
