/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = mongoose.ObjectId
  , url = process.env.MONGOLAB_URI || 'mongodb://localhost/greeting2011winter'
  , noop = function() {};

var Step = new Schema({
  client: { type: Number }
, x: { type: Number }
, y: { type: Number }
, side: { type: String, match: /l|r/ } // "l" or "r"
, timestamp: { type: Number, index: true } // unix timestamp
, direction: { type: Number }
, leg: { type: String } // leg type
, created: { type: Date, default: Date.now }
});

exports.connect = function(callback) {
  mongoose.connect(url, callback || noop);
};

exports.mongoose = mongoose;
exports.Step = Step;

