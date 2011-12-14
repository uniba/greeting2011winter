!function(window, document, $) {

  var client = new InstagramClient()
    , images
    , $images = [];
    
  $(function() {
    var $instagram = $('.instagram');
    
    $instagram.masonry({
      itemSelector: '.photo-wrapper'
//    , columnWidth: 160
//    , gutterWidth: 10
//    , isFitWidth: true
    , isAnimated: !Modernizr.csstransitions
    , animationOptions: {
       duration: 400
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
          , $img = $('<img>').attr('src', url).attr('width', width).attr('height', height);
        $wrapper.append($img).prependTo($instagram);
        $instagram.masonry('reload');
        // $images.push($wrapper.append($img));
      });
    });
    
    setInterval(function() {
      client.emit('request');
    }, 10000);
    
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
