window.HEADER_BREAKPOINT = 512;

window.TILE_GRID = {
  'watch-films-tile': {
    full: {top: 2, left: 0},
    tablet: {top: 2, left: 0},
    small: {top: 0, left: 0}
  },
  'what-is-devotion-tile': {
    full: {top: 0, left: 2},
    tablet: {top: 0, left: 2},
    small: {top: 2, left: 0}
  },
  'what-press-say-tile': {
    full: {top: 2, left: 2},
    tablet: {top: 2, left: 2},
    small: {top: 2, left: 1}
  },
  'portraits-tile': {
    full: {top: 4, left: 2},
    tablet: {top: 4, left: 2},
    small: {top: 4, left: 0}
  },
  'bonus-scenes-tile': {
    full: {top: 0, left: 3},
    tablet: {top: 4, left: 0},
    small: {top: 4, left: 1}
  },
  'em-portugues-tile': {
    full: {top: 2, left: 3},
    tablet: {top: 6, left: 0},
    small: {top: 6, left: 0}
  },
  'in-italiano-tile': {
    full: {top: 3, left: 3},
    tablet: {top: 7, left: 0},
    small: {top: 7, left: 0}
  },
  'en-espanol-tile': {
    full: {top: 4, left: 3},
    tablet: {top: 6, left: 1},
    small: {top: 6, left: 1}
  },
  'collaborators-tile': {
    full: {top: 5, left: 3},
    tablet: {top: 7, left: 1},
    small: {top: 7, left: 1}
  },
  'festivals-awards-tile': {
    full: {top: 0, left: 4},
    tablet: {top: 4, left: 1},
    small: {top: 8, left: 0}
  },
  'freedom-to-marry-tile': {
    full: {top: 2, left: 4},
    tablet: {top: 6, left: 2},
    small: {top: 8, left: 1}
  },
  'donate-tile': {
    full: {top: 4, left: 4},
    tablet: {top: 8, left: 0},
    small: {top: 10, left: 0}
  },
  'contact-tile': {
    full: {top: 4, left: 0},
    tablet: {top: 8, left: 1},
    small: {top: 10, left: 1}
  },
  'host-screening-tile': {
    full: {top: 4, left: 1},
    tablet: {top: 8, left: 2},
    small: {top: 12, left: 0}
  }
};

window.getPositionOfTile = function (layout, id) {
  return window.TILE_GRID[id][layout];
};

window.getLayout = function (containerWidth) {
  containerWidth = containerWidth || $(window).innerWidth();
  if (containerWidth < 768) {
    return 'small';
    }
  if (containerWidth < 1025) {
    return 'tablet';
  }
  return 'full';
};

window.computeBaseUnit = function () {
  var containerWidth = $('#site-container').innerWidth()
    , layout = window.getLayout(containerWidth)
    , width
    , height
    , q

  if (layout === 'small') {
    width = containerWidth / 2;
  } else if (layout === 'tablet') {
    width = containerWidth / 3;
  } else {
    width = containerWidth / 5;
  }

  q = width / 320;
  height = q * 150;

  return {
    containerWidth: containerWidth,
    width: width,
    height: height,
    layout: layout
  };
};

// jQuery extensions
(function (window, jQuery, undefined) {
  var $ = jQuery
    , getLayout = window.getLayout
    , getPositionOfTile = window.getPositionOfTile

  jQuery.fn.aspectRatio = function () {
    if (this._aspectRatio) {
      return this._aspectRatio;
    }

    var height, width

    if (this.hasClass('span1')) {
      width = 1;
    } else if (this.hasClass('span2')) {
      width = 2;
    }

    if (this.hasClass('height1')) {
      height = 1;
    } else if (this.hasClass('height2')) {
      height = 2;
    }

    return width +'x'+ height;
  };

  jQuery.fn.sizeAndPosition = function (baseUnit, width, height) {
    var position = computePosition(baseUnit, this.prop('id'))

    this.css({
      width: width
    , height: height
    , top: position.top
    , left: position.left
    });

    return this;
  };

  function computePosition(baseUnit, id) {
    var position = getPositionOfTile(baseUnit.layout, id);
    return {
      top: Math.floor(position.top * baseUnit.height)
    , left: Math.floor(position.left * baseUnit.width)
    };
  }

  /*
   * jQuery Reveal Plugin 1.0
   * www.ZURB.com
   * Copyright 2010, ZURB
   * Free to use under the MIT license.
   * http://www.opensource.org/licenses/mit-license.php
   */

  $('a.section-link').on('click', function(e) {
    e.preventDefault();
    var modalLocation = $(this).attr('href').replace(/^#/, '');
    $('#'+modalLocation).reveal($(this).data());
  });

  // options.animationspeed - Number miliseconds
  // closeonbackgroundclick - Boolean (default: true)
  // dismissmodalclass - String class name of element that will close modal.
  $.fn.reveal = function(options) {
    var defaults = {  
      animationspeed: 300,
      closeonbackgroundclick: true,
      dismissmodalclass: 'close-reveal-modal'
    }; 
    
    options = $.extend({}, defaults, options);

    function computeInnerHeight() {
      var windowH = $(window).innerHeight()
        , topMargin = 80
        , bottomMargin = 90
        , paddingAndHeader = 100

      return windowH - topMargin - paddingAndHeader - bottomMargin;
    }

    return this.each(function() {
      var modal = $(this),
          inner = modal.find('.inner')
          topMeasure  = parseInt(modal.css('top')),
          topOffset = modal.height() + topMeasure,
          locked = false,
          modalBG = $('.reveal-modal-bg');

      if(modalBG.length == 0) {
        modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
      }       
   
      //Entrance Animations
      modal.on('reveal:open', function () {
        modalBG.off('click.modalEvent');
        $('.' + options.dismissmodalclass).off('click.modalEvent');
        if(!locked) {
          lockModal();

          if (getLayout() === 'full') {
            inner.height(computeInnerHeight());
            modal.css({'top': $(document).scrollTop()-topOffset, 'opacity' : 0, 'display' : 'block'});
            modalBG.fadeIn(options.animationspeed/2);
            modal.delay(options.animationspeed/2).animate({
              "top": $(document).scrollTop()+topMeasure + 'px',
              "opacity" : 1
            }, options.animationspeed, unlockModal);         
          } else {
            $('#site-header').hide();
            $('nav.main-navigation').hide();
            modalBG.fadeIn(options.animationspeed/2);
            modal.delay(options.animationspeed/2)
              .fadeIn(options.animationspeed, unlockModal);
          }
        }
        modal.off('reveal:open');
      });   

      //Closing Animation
      modal.on('reveal:close', function () {
        if(!locked) {
          lockModal();
          if (getLayout() === 'full') {
            modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
            modal.animate({
              "top":  $(document).scrollTop()-topOffset + 'px',
              "opacity" : 0
            }, options.animationspeed/2, function() {
              modal.css({top: topMeasure, opacity: 1, display: 'none'});
              unlockModal();
            });
          } else {
            modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
            modal.fadeOut(options.animationspeed/2, function () {
              $('#site-header').show();
              $('nav.main-navigation').show();
              unlockModal();
            });
          }
        }
        modal.off('reveal:close');
      });

      //Open Modal Immediately
      modal.trigger('reveal:open')

      //Close Modal Listeners
      var closeButton = $('.' + options.dismissmodalclass).on('click.modalEvent', function () {
        modal.trigger('reveal:close');
      });

      if(options.closeonbackgroundclick) {
        modalBG.css({"cursor":"pointer"})
        modalBG.bind('click.modalEvent', function () {
          modal.trigger('reveal:close')
        });
      }

      $('body').keyup(function(e) {
        // 27 is the keycode for the Escape key
        if(e.which===27){
          modal.trigger('reveal:close');
        }
      });
  
      function unlockModal() { 
        locked = false;
      }
      function lockModal() {
        locked = true;
      } 
  
    });//each call
  }//orbit plugin call

}(window, jQuery)); // End jQuery extensions

// Main program
(function (window, jQuery, undefined) {
  var $ = jQuery
    , _navTiles
    , computeBaseUnit = window.computeBaseUnit
    , HEADER_BREAKPOINT = window.HEADER_BREAKPOINT

  jQuery(function ($) {
    renderNavTileLayout();
    $(window).resize(_.debounce(renderNavTileLayout, 200));
    if (Modernizr.touch) {
      setupTouchHover();
    }
  });

  function setupTouchHover() {
    var currentHover = null

    $navTiles().on('click', function (ev) {
      var $a = $(this), id = $a.attr('href')

      if (currentHover === id) {
        currentHover = null;
        $a.removeClass('touch-hover');
        return;
      }
      $('a[href="'+ currentHover +'"]').removeClass('touch-hover');
      currentHover = id;
      $a.addClass('touch-hover');
      return false;
    });
  }

  function $navTiles() {
    return _navTiles || (_navTiles = $('.nav-tile'));
  }

  function renderNavTileLayout() {
    var baseUnit = computeBaseUnit()
      , width1 = Math.floor(baseUnit.width)
      , width2 = Math.floor(baseUnit.width * 2)
      , height1 = Math.floor(baseUnit.height)
      , height2 = Math.floor(baseUnit.height * 2)

    if (baseUnit.containerWidth >= HEADER_BREAKPOINT) {
      $('#site-header').css({width: width2, height: height2});
    } else {
      $('#site-header').css({width: '100%', height: 'auto'});
    }

    $navTiles().each(function (el) {
      var $el = $(this)
        , aspectRatio = $el.aspectRatio()

      if (aspectRatio === '1x1') {
        $el.sizeAndPosition(baseUnit, width1, height1);
      } else if (aspectRatio === '1x2') {
        $el.sizeAndPosition(baseUnit, width1, height2);
      } else if (aspectRatio === '2x2') {
        $el.sizeAndPosition(baseUnit, width2, height2);
      }
    });
  }
}(window, jQuery));