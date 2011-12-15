!function(window, document, $) {

  var client = new InstagramClient()
    , images
    , $images = []
    , socket = io.connect(location.protocol + '//' + location.hostname);
    
  $(function() {
    var $instagram = $('.instagram');
    
    $instagram.masonry({
      itemSelector: '.photo-wrapper'
//    , columnWidth: 100
//    , gutterWidth: 10
//    , isFitWidth: true
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
        // $images.push($wrapper.append($img));
      });
      $('a[rel=instagram]').fancybox();
      $instagram.masonry('remove', $instagram.find('.photo-wrapper:last')).masonry('reload');
      setTimeout(function() { client.emit('request'); }, 10000);
    });
    
    $(function() {
      var stepCount = 0;
            
      socket.on('init', function(data) {
        // recieve recent steps
      });
      
      socket.on('step', function(data) {
        var center = $(window).width() / 2
          , height = $(document).height()
          , $step = $('<div>').addClass('step');
        if (height < data.y) {
          return;
        }
        $step.css({ position: 'absolute', top: data.y, left: center + data.x, zIndex: 1000 }).appendTo('body');;
      });
      
      $(document).on('mousemove', function(e) {
        var x = e.pageX
          , y = e.pageY
          , center = $(window).width() / 2
          , relativeX = x - center;
        
        if (++stepCount % 10 === 0) {
          socket.emit('step', { x: relativeX, y: y });
          stepCount = 0;
        }
      });
    });
    
    /*
    setTimeout(function() {
      var $img = $images.shift();
      if ($img) {
        $img.prependTo($instagram);
        $instagram.masonry('reload');
      }
      setTimeout(arguments.callee, 400);
    }, 0);
    */
    
    client.emit('request');
  });

}(window, document, jQuery);
