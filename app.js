
/**
 * Module dependencies.
 */

var express = require('express')
  , namespace = require('express-namespace')
  , routes = require('./routes');

var app = module.exports = express.createServer()
  , config = require('./config')(app)
  , socket = require('./socket')
  , io = socket.listen(app);

// Configuration
app.configure(config.all);
app.configure('development', config.development);
app.configure('production', config.production);

// Routes
app.get('/', routes.index);
app.namespace('/api', function() {
  app.get('media/popular', routes.api.media.popular);
  app.get('media/search/:lat,:lng', routes.api.media.search);
  app.get('tags/search/:q', routes.api.tags.search);
  app.get('tags/recent/:name', routes.api.tags.recent);
});
app.get('/steps', socket.routes.steps);

// Boot
app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
