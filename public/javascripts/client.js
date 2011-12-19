/**
 * Instagram Client for API wrapper
 * 
 * @dependency superagent v0.2.1
 */

!function(exports) {

  var request = superagent;
  
  function InstagramClient() {
    if (!(this instanceof InstagramClient)) {
      return new InstagramClient();
    }
    EventEmitter.call(this);

    this.counter = 0;
    this.tags = ['illumination', 'generative', 'christmastree', 'projectionmapping', 'santa', 'interactiveart'];
    
    this.on('request', function() {
      var self = this
        , tag = this.tags[this.counter];
      request
        .get('/api/tags/recent/' + tag)
        .end(function(res) {
          if (res.ok) {
            self.counter = (self.counter + 1) % self.tags.length;
            self.emit('response', null, res.body);
          } else {
            self.emit('response', true, res.body);
          }
        });
    });
  }
  
  /**
   * Inherit from `EventEmitter.prototype`.
   */
  
  InstagramClient.prototype = new EventEmitter();
  InstagramClient.prototype.constructor = InstagramClient;
  
  /**
   * Expose constructor.
   */
  
  exports.InstagramClient = InstagramClient;
  
  /**
   * EventEmitter via. Move.js
   * https://github.com/visionmedia/move.js/
   */
  
  function EventEmitter() {
    this.callbacks = {};
  }
  
  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   */
  
  EventEmitter.prototype.on = function(event, fn){
    (this.callbacks[event] = this.callbacks[event] || [])
      .push(fn);
    return this;
  };
  
  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   */
  
  EventEmitter.prototype.emit = function(event){
    var args = Array.prototype.slice.call(arguments, 1)
      , callbacks = this.callbacks[event]
      , len;
  
    if (callbacks) {
      len = callbacks.length;
      for (var i = 0; i < len; ++i) {
        callbacks[i].apply(this, args)
      }
    }
  
    return this;
  };

}(this);