window.HEADER_BREAKPOINT = 512;
window.SMALL_LAYOUT = 767;
window.TABLET_LAYOUT = 1024;

window.MODAL_TOP_MARGIN = 50; // Based on 900px height
window.MODAL_BOTTOM_MARGIN = 140; // Based on 900px height

window.MODAL_IDS = [
  'what-is-devotion-project'
, 'watch-films'
, 'press'
, 'portraits'
, 'bonus-scenes'
, 'en-portugues'
, 'in-italiano'
, 'en-espanol'
, 'collaborators'
, 'festivals-and-awards'
, 'freedom-to-marry'
, 'donate'
, 'contact'
, 'host-a-screening'
];

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

window.isModalId = function (id) {
  return window.MODAL_IDS.indexOf(id) > -1;
};

window.Router = Backbone.Router.extend({
  routes: {
    '': 'home'
  , 'section/portraits/:photo': 'portraits'
  , 'section/:section': 'section'
  },

  home: function () {
    console.log('HOME');
  },

  portraits: function (id) {
    console.log('PORT', id);
  },

  section: function (id) {
    console.log('SECTION', id)
  }
});

window.TileGrid = {
  layout: null,
  base: {height: null, width: null},
  containerWidth: null,
  _navTiles: null,

  render: function () {
    var self = this
      , comp = this.compute();

    $('#site-container').css({
      width: this.containerWidth
    , height: comp.containerHeight
    , marginLeft: comp.marginLeft
    });

    if (this.containerWidth >= HEADER_BREAKPOINT) {
      $('#site-header').css({
        width: Math.ceil(this.base.width * 2)
      , height: Math.ceil(this.base.height * 2)
      });
    } else {
      $('#site-header').css({width: '100%', height: 'auto'});
    }

    this.$navTiles().each(function (i, el) {
      self.sizeAndPositionTile($(this));
    });
  },

  compute: function () {
    var $win = $(window)
      , parentW = $win.innerWidth()
      , parentH = $win.innerHeight()
      , width = 1600
      , height = 900
      , ar = width / height
      , marginLeft = 0

    if (width > parentW || height > parentH) {
      if (width/parentW < height/parentH) {
        height = parentH;
        width = height * ar;
      } else {
        width = parentW;
        height = width / ar;
      }
    }

    if (width < parentW) {
      marginLeft = (parentW - width) / 2;
    }

    this.containerWidth = Math.round(width);

    if (width <= window.SMALL_LAYOUT) {
      this.layout = 'small';
      this.base.width = width / 2;
    } else if (width <= window.TABLET_LAYOUT) {
      this.layout = 'tablet';
      this.base.width = width / 3;
    } else {
      this.layout = 'full';
      this.base.width = width / 5;
    }

    this.base.height = (this.base.width / 320) * 150;

    return {
      marginLeft: marginLeft
    , base: this.base
    , containerWidth: this.containerWidth
    , containerHeight: height
    , layout: this.layout
    };
  },

  sizeAndPositionTile: function ($el) {
    var position = this.getPositionOfTile($el.prop('id'))
      , aspect = $el.gridAspect()

    $el.css({
      width: Math.ceil(aspect.width * this.base.width)
    , height: Math.ceil(aspect.height * this.base.height)
    , top: Math.round(position.top * this.base.height)
    , left: Math.round(position.left * this.base.width)
    });
  },

  getPositionOfTile: function (id) {
    return window.TILE_GRID[id][this.layout];
  },

  $navTiles: function () {
    return this._navTiles || (this._navTiles = $('.nav-tile'));
  }
};

// jQuery extensions
(function (window, $, undefined) {

  $.fn.gridAspect = function () {
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

    return {width: width, height: height};
  };
}(window, jQuery));

// Do right now (before document ready):
(function () {
  // Build the tile layout.
  window.TileGrid.render();

  // Listen for window resize events to re-render the nav tile grid.
  _.bindAll(window.TileGrid, 'render');
  $(window).resize(_.debounce(window.TileGrid.render, 200));
}())

// On document ready:
$(function ($) {
  new Router();
  Backbone.history.start();
});
