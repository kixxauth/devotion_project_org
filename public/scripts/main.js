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

// The tile grid computation singleton:
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

    if (this.layout === 'small') {
      $('#site-header').css({width: '100%', height: 'auto'});
    } else {
      $('#site-header').css({
        width: Math.ceil(this.base.width * 2)
      , height: Math.ceil(this.base.height * 2)
      });
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

// Modal window controller:
window.Modals = {
  deck: null,

  initialize: function () {
    var timeout

    this.deck = $.kixxModal.createDeck();

    this.deck.on('kixx-modal:opening', function (ev, el) {
      var $modal = $(el)
        , $vid = $modal.find('.videowrapper')

      if ($vid.length) {
        var src = $vid.data('src'), $iframe
        $iframe = $vid.append('<iframe src="'+ src +'?autoplay=1" width="660" height="371" frameborder="0" allowfullscreen></iframe>')
                    .children('iframe');
        $modal.one('kixx-modal:closed', function (ev) {
          $iframe.remove();
        });
      }

      window.clearTimeout(timeout);
    });

    this.deck.on('kixx-modal:closed', function () {
      timeout = window.setTimeout(function () {
        window.location.hash = '';
      }, 30);
    });
  },

  open: function (id, opts) {
    this.deck.open('section-'+ id, opts);
  },

  close: function (id) {
    this.deck.close();
  }
};

// Portrait slide show controller:
window.Portraits = {
  currentId: null,
  slides: null,

  initialize: function () {
    var self = this

    function updateHash($from, $to) {
      var id = $to.prop('id')
      if (id) {
        window.location.hash = 'section/portraits/'+ id;
      }
    }

    $('#section-portraits').on('kixx-modal:opening', function (ev) {
      self.openSlides();
    }).on('kixx-modal:closed', function (ev) {
      self.slides = null;
    }).find('a.trigger-previous-slide').on('click', function (ev) {
      ev.preventDefault();
      self.slides.previous({
        complete: updateHash
      });
      return false;
    }).end().find('a.trigger-next-slide').on('click', function (ev) {
      ev.preventDefault();
      self.slides.next({
        complete: updateHash
      });
      return false;
    });
  },

  open: function (id) {
    this.currentId = id;
    if (this.slides) {
      this.slides.show(id);
    }
    Modals.open('portraits', {topMargin: 0.02, bottomMargin: 0.02});
  },

  openSlides: function () {
    this.slides = $('#portrait-slide-show').kixxSlides({aspectRatio: 1.5})
    this.slides.show(this.currentId || 'slide-show-slide-f-1');
  }
};

// Setup the internal content links
window.ContentLinks = {
  initialize: function () {
    var $links = $('a.content-link')

    $links.on('click', function (ev) {
      ev.preventDefault();

      var $el = $(this)
        , id = $el.attr('href').replace(/^#/, '')
        , $target = $('#'+ id)
        , loc = $target.position().top - 24

      $links.removeClass('active');
      $target.closest('.modal-content').scrollTop(loc);
      $el.addClass('active');
      return false;
    });
  }
};

window.ShareLinks = {
  baseURL: encodeURIComponent('http://www.thedevotionproject.org/'),

  initialize: function () {
    $('ul.social-share-actions').each(function (i, el) {
      window.ShareLinks.buildButtons($(this));
    })
  },

  buildButtons: function ($container) {
    var title = encodeURIComponent($container.data('title'))
      , description = encodeURIComponent($container.data('description'))
      , picture = encodeURIComponent($container.data('picture'))
      , path = encodeURIComponent($container.data('path').replace('^/', ''))
      , url = this.baseURL + path

    $container.append(this.buildTumblr({
      title: title
    , description: description
    , picture: picture
    , url: url
    }));

    $container.append(this.buildFacebook({
      title: title
    , description: description
    , picture: picture
    , url: url
    }));

    $container.append(this.buildTwitter({
      title: title
    , description: description
    , picture: picture
    , url: url
    }));

    $container.append(this.buildPinterest({
      title: title
    , description: description
    , picture: picture
    , url: url
    }));
  },

  buildTumblr: function (opts) {
    var url = 'http://www.tumblr.com/share/link?url='
    url += opts.url
    url += '&name='+ opts.title
    url += '&description'+ opts.description
    return this.createButton(url, 'Tumblr');
  },

  buildFacebook: function (opts) {
    var url = 'https://www.facebook.com/sharer.php?app_id=113869198637480&sdk=joey&u='
    url += opts.url
    url += '&display=popup'
    return this.createButton(url, 'Facebook');
  },

  buildTwitter: function (opts) {
    var url = 'http://twitter.com/share?url='
    url += opts.url
    url += '&text='+ opts.description
    return this.createButton(url, 'Twitter');
  },

  buildPinterest: function (opts) {
    var url = '//www.pinterest.com/pin/create/button/?url='
    url += opts.url
    url += '&media='+ opts.picture
    url += '&description'+ opts.description
    return this.createButton(url, 'Pinterest');
  },

  createButton: function (url, name) {
    return $('<li class="'+ name.toLowerCase() +'"><a href="'+ url +'" target="_blank">'+ name +'</a></li>');
  }
}

// Setup the window hashchange router:
window.Router = Backbone.Router.extend({
  routes: {
    '': 'home'
  , 'section/portraits/:photo': 'portraits'
  , 'section/:section': 'section'
  },

  home: function () {
    Modals.close();
  },

  portraits: function (id) {
    Portraits.open(id);
  },

  section: function (id) {
    if (id === 'portraits') {
      Portraits.open();
    } else {
      Modals.open(id);
    }
  }
});

// Do right now (before document ready):
(function () {
  // Build the tile layout.
  window.TileGrid.render();

  window.Modals.initialize();
  window.Portraits.initialize();
  window.ContentLinks.initialize();
  window.ShareLinks.initialize();

  // Listen for window resize events to re-render the nav tile grid.
  _.bindAll(window.TileGrid, 'render');
  $(window).resize(_.debounce(window.TileGrid.render, 200));
}())

// On document ready:
$(function ($) {
  new Router();
  Backbone.history.start();
});
