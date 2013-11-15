window.HEADER_BREAKPOINT = 512;

window.MODAL_TOP_MARGIN = 80;
window.MODAL_BOTTOM_MARGIN = 140;
window.MODAL_HEADER_PADDING = 100;

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
  },
  'site-container': {
    full: 6,
    tablet: 10,
    small: 14
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
(function (window, $, undefined) {
  var getPositionOfTile = window.getPositionOfTile

  $.fn.aspectRatio = function () {
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

  $.fn.sizeAndPosition = function (baseUnit, width, height) {
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
      top: Math.round(position.top * baseUnit.height)
    , left: Math.round(position.left * baseUnit.width)
    };
  }

}(window, jQuery)); // End jQuery extensions

// Reveal Modal jQuery extension
(function (window, $) {
  var locked = false
    , $currentlyOpen = null
    , $modalBG = null
    , options = null

  // opts.animationspeed
  // opts.innerHeight - Function to compute inner height of modal content.
  $.fn.revealOpen = function (opts, callback) {
    var h, self = this

    if ($currentlyOpen && $currentlyOpen.prop('id') == this.prop('id')) {
      if (_.isFunction(callback)) {
        callback();
      }
      return this;
    }

    if (!locked) {
      lock();
      options = opts;
      var $inner = this.find('.inner')
      if (!$modalBG) {
        $modalBG = $('.reveal-modal-bg');
      }
      if ($.isFunction(opts.innerHeight)) {
        if (h = opts.innerHeight()) {
          $inner.height(h);
        }
      }
      $modalBG.fadeIn(opts.animationspeed/2);
      this
        .delay(opts.animationspeed/2)
        .fadeIn(opts.animationspeed, function () {
          self.trigger('reveal:opened');
          if (_.isFunction(callback)) {
            callback();
          }
          unlock();
        });
      this.trigger('reveal:open');
      $currentlyOpen = this;
    }
    return this;
  };

  // opts.animationspeed
  $.fn.revealClose = function () {
    if(!locked) {
      lock();
      var opts = options;
      options = null;
      if (!$modalBG) {
        $modalBG = $('.reveal-modal-bg');
      }
      $modalBG.delay(opts.animationspeed).fadeOut(opts.animationspeed);
      this.fadeOut(opts.animationspeed/2, unlock);
      this.trigger('reveal:close');
      $currentlyOpen = null;
    }
    return this;
  };

  $.revealCloseCurrent = function () {
    if ($currentlyOpen && $currentlyOpen.length) {
      $currentlyOpen.revealClose();
    }
  };

  function unlock() { 
    locked = false;
  }

  function lock() {
    locked = true;
  } 
}(window, jQuery)); // End Reveal Modal jQuery extension

// Main program
(function (window, $, undefined) {
  var _navTiles
    , computeBaseUnit = window.computeBaseUnit
    , HEADER_BREAKPOINT = window.HEADER_BREAKPOINT
    , getLayout = window.getLayout

  // On document ready (this is the start of the program).
  // -----------------------------------------------------
  $(function ($) {
    // Render the navigation tile grid.
    renderNavTileLayout();

    // Listen for window resize events to re-render the nav tile grid.
    $(window).resize(_.debounce(renderNavTileLayout, 200));

    // Setup the alternate hover state for touch devices.
    if (Modernizr.touch) {
      setupTouchHover();
    }

    // Setup the modal windows.
    setupModals();

    // Hide base page elements under modal in mobile view.
    if (getLayout() !== 'full') {
      $(document).on('reveal:open', function () {
        $('#site-container').hide();
      }).on('reveal:close', function () {
        $('#site-container').show();
      });
    }
  });

  function setupModals() {
    // Setup the window hash history and modals.
    $(window).on('hashchange', function (ev) {
      ev.preventDefault();
      var id = window.location.hash.replace(/^#/, '')
      if (!id) {
        $.revealCloseCurrent();
      } else {
        var parts = id.split('/')
        openModal(parts[0], function () {
          if (parts.length >= 2 || id === 'portraits') {
            openChildModal(parts[0], parts[1]);
          }
        });
      }
      return false;
    });

    function hashHome() {
      window.location.hash = '';
    }

    // Setup close triggers
    $('.reveal-modal-bg').on('click', hashHome);
    $('.close-reveal-modal').on('click', hashHome);
    $('body')
      .on('keyup', function(e) {
        // 27 is the keycode for the Escape key
        if(e.which===27){
          hashHome();
        }
      });

    // Get the ball rolling ...
    $(window).trigger('hashchange');
  }

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

  function openModal(id, callback) {
    $('#'+ id).revealOpen({
      innerHeight: modalInnerHeight,
      animationspeed: 400
    }, callback);
  }

  function openChildModal(parentId, id) {
    if (parentId === 'portraits') {
      openSlideShow(id);
    }
  }

  var openSlideShow = (function () {
    var slideShows = {}
      , $current = null

    function open(id) {
      id = id || 'slides-f';
      var $next

      if ($current) {
        $current.hide();
      }

      if ($next = slideShows[id]) {
        $current = $next.show();
      } else {
        $current = slideShows[id] = $('#'+ id).show().slidesjs({
          width: 746,
          height: 582,
          navigation: {active: false},
          pagination: {active: false}
        });
      }
    }
    return open;
  }());

  function $navTiles() {
    return _navTiles || (_navTiles = $('.nav-tile'));
  }

  function renderNavTileLayout() {
    var baseUnit = computeBaseUnit()
      , width1 = Math.ceil(baseUnit.width)
      , width2 = Math.ceil(baseUnit.width * 2)
      , height1 = Math.ceil(baseUnit.height)
      , height2 = Math.ceil(baseUnit.height * 2)

    $('#site-container').height(getPositionOfTile(baseUnit.layout, 'site-container') * height1);

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

  function modalInnerHeight() {
    var windowH = $(window).innerHeight()
      , topMargin = window.MODAL_TOP_MARGIN
      , bottomMargin = window.MODAL_BOTTOM_MARGIN
      , paddingAndHeader = window.MODAL_HEADER_PADDING

    if (getLayout() !== 'full') {
      return null;
    }
    return windowH - topMargin - paddingAndHeader - bottomMargin;
  }
}(window, jQuery)); // End of main program
