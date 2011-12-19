/**
 * Application implementation.
 * 
 * @dependency Modernizr v2.0.6
 * @dependency jQuery v1.7.1
 * @dependency jQuery easing plugin v1.3
 * @dependency jquery.transform2d
 * @dependency jQuery Masonry v2.1.0
 * @dependency FancyBox v1.3.4
 * @dependency socket.io v0.8.7
 * @dependency Instagram Client for API wrapper (./client.js)
 */

!function(window, document, $) {

  var client = new InstagramClient()
    , socket = io.connect(location.protocol + '//' + location.hostname);
    
  $(function() {
    var $instagram = $('.instagram')
      , response = 0;
    
    $instagram.masonry({
      itemSelector: '.photo-wrapper'
    , isFitWidth: true
    , isAnimated: !Modernizr.csstransitions
    , animationOptions: {
        duration: 1000
      }
    });
    
    client.on('response', function(err, data) {
      var $container;
      if (err) {
        return;
      }
      ++response;
      $container = $('<div>');
      data.forEach(function(el, i) {
        var resolution;
        if (el.likes.count > 30) {
          resolution = 'standard_resolution';
        } else if (el.likes.count > 15) {
          resolution = 'low_resolution';
        } else {
          resolution = 'thumbnail';
        }
        var image = el.images[resolution]
          , url = image.url
          , width = image.width
          , height = image.height
          , $wrapper = $('<div>').addClass('photo-wrapper').addClass(resolution)
          , $a = $('<a>').attr('rel', 'instagram').attr('href', el.images.standard_resolution.url)
          , $img = $('<img>').attr('src', url).attr('width', width).attr('height', height);
        if (el.caption) {
          $a.attr('title', el.caption.text)
        }
        $img.appendTo($a);
        $wrapper.append($a).prependTo($container);
      });
      if (response >= 3) {
        $instagram.masonry('remove', $instagram.find('.first:last').nextAll().andSelf());
      }
      $container.find('.photo-wrapper')
        .first().addClass('first').end()
        .last().addClass('last').end()
        .prependTo($instagram);
      $instagram.masonry('reload');
      $('a[rel=instagram]').fancybox({ titlePosition: 'over', overlayColor: '#000' });
      setTimeout(function() { client.emit('request'); }, 10000);
    });
            
    client.emit('request');
  });
  
  $(function() {
    var stepCount = 0
      , sendPerStep = 15
      , lastStep
      , direction = ['l', 'r']
      , transEndEventNames = {
          'WebkitTransition': 'webkitTransitionEnd'
        , 'MozTransition': 'transitionend'
        , 'OTransition': 'oTransitionEnd'
        , 'msTransition': 'msTransitionEnd' // maybe?
        , 'transition': 'transitionEnd'
        }
      , transitionEnd = transEndEventNames[Modernizr.prefixed('transition')];
    
    function render(step) {
      var center = $(window).width() / 2
        , height = $(document).height()
        , left = center + step.x
        , $step = $('<div>').addClass('step').addClass(step.d);
      if (left < 1 || left > $(window).width()) {
        return;
      }
      $step
        .css({ transform: 'rotate(' + Math.round(step.r) + 'deg)' })
        .css({ position: 'absolute', top: step.y, left: left }).appendTo('body');
      setTimeout(function() { $step.addClass('appear'); }, 0);
      setTimeout(function() { $step.addClass('disappear').one(transitionEnd, function(e) { $(this).remove() }); }, 10000);
    }
    
    socket.on('init', function(data) {
      var first = data[0];
      data.forEach(function(el, i) {
        var delay = el.t - first.t;
        if (delay > 100000) {
          delay = 100000;
        }
        setTimeout(function() { render(el); }, delay);
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
      
      if (++stepCount % sendPerStep === 0) {
        var step = { x: relativeX, y: y, d: direction.reverse()[0], t: (new Date()).getTime() };
        if (lastStep) {
          var rad = Math.atan2(step.y - lastStep.y, step.x - lastStep.x) + Math.PI
            , deg = rad * 180 / Math.PI;
          step.r = deg - 90;
        } else {
          step.r = 0;
        }
        socket.emit('step', step);
        render(step);

        lastStep = step;
        stepCount = 0;
      }
    });
  });
  
  $(function() {
    $('a[href^=#]').on('click', function(e) {
      var $target = $($(this).attr('href'));
      $('html, body').animate({ scrollTop: $target.offset().top }, 500, 'easeOutExpo');
      return false;
    });
  });

}(window, document, jQuery);
