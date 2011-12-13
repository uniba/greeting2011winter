/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Christagram ☃' });
};

exports.api = require('./api');