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

// jQuery extensions
(function (window, jQuery, undefined) {
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
  };

  function computePosition(baseUnit, id) {
    var position = window.getPositionOfTile(baseUnit.layout, id);
    return {
      top: Math.floor(position.top * baseUnit.height)
    , left: Math.floor(position.left * baseUnit.width)
    };
  }
}(window, jQuery));

(function (window, jQuery, undefined) {
  var $ = jQuery
    , _navTiles

  jQuery(function ($) {
    renderNavTileLayout();
    $(window).resize(_.debounce(renderNavTileLayout, 200));
  });

  function $navTiles() {
    return _navTiles || (_navTiles = $('.nav-tile'));
  }

  function renderNavTileLayout() {
    var containerWidth = $('#site-container').innerWidth()
      , baseUnit = computeBaseUnit(containerWidth)
      , width1 = Math.floor(baseUnit.width)
      , width2 = Math.floor(baseUnit.width * 2)
      , height1 = Math.floor(baseUnit.height)
      , height2 = Math.floor(baseUnit.height * 2)

    if (containerWidth >= window.HEADER_BREAKPOINT) {
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

  function computeBaseUnit(containerWidth) {
    var width, height, layout, q

    if (containerWidth < 768) {
      width = containerWidth / 2;
      layout = 'small';
    } else if (containerWidth < 1025) {
      width = containerWidth / 3;
      layout = 'tablet';
    } else {
      width = containerWidth / 5;
      layout = 'full';
    }

    q = width / 320;
    height = q * 150;
    return {width: width, height: height, layout: layout};
  }
}(window, jQuery));