var Instagram = require('instagram-node-lib');

Instagram.set('client_id', process.env.INSTAGRAM_CLIENT_ID);
Instagram.set('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);

exports.tags = {
  recent: function(req, res) {
    var name = req.params.name;
    
    Instagram.tags.recent({
      name: name
    , complete: function(data, pagination) {
        res.send(data);
      }
    , error: function(errorMessage, errorObject, caller) {
        res.send(arguments, 500);
      }
    });
  }
, search: function(req, res) {
    var q = req.params.q;
    
    Instagram.tags.search({
      q: q
    , complete: function(data, pagination) {
        res.send(data);
      }
    , error: function(errorMessage, errorObject, caller) {
        res.send(arguments, 500);
      }
    });
  }
};

exports.media = {
  popular: function(req, res) {
    Instagram.media.popular({
      complete: function(data, pagination) {
        res.send(data);
      }
    , error: function(errorMessage, errorObject, caller) {
        res.send(arguments, 500);
      }
    });
  }
, search: function(req, res) {
    var lat = req.params.lat
      , lng = req.params.lng;
    
    Instagram.media.search({
      lat: lat
    , lng: lng
    , complete: function(data, pagination) {
        res.send(data);
      }
    , error: function(errorMessage, errorObject, caller) {
        console.log(arguments);
        res.send(arguments, 500);
      }
    });
  }
};
