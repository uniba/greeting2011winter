/**
 * Application implementation.
 * 
 * @dependency jQuery v1.7.1
 * @dependency jQuery Masonry v2.1.0
 * @dependency FancyBox v1.3.4
 * @dependency socket.io v0.8.4
 * @dependency Instagram Client for API wrapper (./client.js)
 */

!function(window, document, $) {

  var client = new InstagramClient()
    , socket = io.connect(location.protocol + '//' + location.hostname);
    
  $(function() {
    var $instagram = $('.instagram');
    
    $instagram.masonry({
      itemSelector: '.photo-wrapper'
    , isFitWidth: true
    , isAnimated: !Modernizr.csstransitions
    , animationOptions: {
        duration: 1000
      }
    });
    
    client.on('recieve', function(err, data) {
      if (err) {
        return;
      }
      data.forEach(function(el, i) {
        var resolution;
        if (el.likes.count > 50) {
          resolution = 'standard_resolution';
        } else if (el.likes.count > 10) {
          resolution = 'low_resolution';
        } else {
          resolution = 'thumbnail';
        }
        var image = el.images[resolution]
          , url = image.url
          , width = image.width
          , height = image.height
          , $wrapper = $('<div>').addClass('photo-wrapper').addClass(resolution)
          , $a = $('<a>').attr('title', el.caption.text).attr('rel', 'instagram').attr('href', el.images.standard_resolution.url)
          , $img = $('<img>').attr('src', url).attr('width', width).attr('height', height);
        $img.appendTo($a);
        $wrapper.append($a).prependTo($instagram);
      });
      $('a[rel=instagram]').fancybox();
      $instagram.masonry('remove', $instagram.find('.photo-wrapper:last')).masonry('reload');
      setTimeout(function() { client.emit('request'); }, 10000);
    });
    
    $(function() {
      var stepCount = 0;
      
      function render(step) {
          var center = $(window).width() / 2
            , height = $(document).height()
            , $step = $('<div>').addClass('step');
          if (height < step.y) {
            return;
          }
          $step.css({ position: 'absolute', top: step.y, left: center + step.x, zIndex: 1000 }).appendTo('body');
      }
      
      socket.on('init', function(data) {
        data.forEach(function(el, i) {
          render(el);
        });
      });
      
      socket.on('step', function(data) {
        render(data);
      });
      
      $(document).on('mousemove', function(e) {
        var x = e.pageX
          , y = e.pageY
          , center = $(window).width() / 2
          , relativeX = x - center;
        
        if (++stepCount % 10 === 0) {
          var step = { x: relativeX, y: y };
          socket.emit('step', step);
          render(step);
          stepCount = 0;
        }
      });
    });
        
    client.emit('request');
  });

}(window, document, jQuery);
