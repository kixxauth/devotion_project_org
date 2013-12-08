window.SMALL_LAYOUT = 600;
window.TABLET_LAYOUT = 940;
window.STATIC_MODAL_BREAKPOINT = 900;

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
  _container: null,

  initialize: _.once(function () {
    // Listen for window resize events to re-render the nav tile grid.
    _.bindAll(window.TileGrid, 'render');
    $(window).resize(_.debounce(window.TileGrid.render, 200));

    // Render for the first time.
    window.TileGrid.render();
  }),

  render: function () {
    var self = this
      , comp = this.compute()
      , tileContainerHeight = 0

    if (comp.layout === 'small') {
      this.$container().css({
        width: comp.containerWidth
      });
      $('#site-header').css({
        width: '100%'
      , height: 'auto'
      , position: 'static'
      });
      $('body').addClass('small');
    } else {
      this.$container().css({
        width: comp.containerWidth
      , height: comp.containerHeight
      });
      $('#site-header').css({
        width: Math.ceil(comp.base.width * 2)
      , height: Math.ceil(comp.base.height * 2)
      , position: 'absolute'
      , top: 0
      , left: 0
      });
      $('body').removeClass('small');
    }

    this.$navTiles().each(function (i, el) {
      var settings = self.sizeAndPositionTile($(this))
        , vpos = settings.height + settings.top

      if (vpos > tileContainerHeight) {
        tileContainerHeight = vpos;
      }
    });

    $('#main-navigation').css({height: tileContainerHeight})
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
      , settings = {
          width: Math.ceil(aspect.width * this.base.width)
        , height: Math.ceil(aspect.height * this.base.height)
        , top: Math.round(position.top * this.base.height)
        , left: Math.round(position.left * this.base.width)
        }

    $el.css(settings);
    return settings;
  },

  getPositionOfTile: function (id) {
    return window.TILE_GRID[id][this.layout];
  },

  $container: function () {
    return this._container || (this._container = $('#site-container'));
  },

  $navTiles: function () {
    return this._navTiles || (this._navTiles = $('.nav-tile'));
  }
};

// Modal window controller:
window.Modals = {
  deck: null,

  initialize: _.once(function () {
    var timeout

    this.deck = $.kixxModal.createDeck();

    this.deck.on('kixx-modal:opening', function (ev, el) {
      var $modal = $(el)
      new VideoModal($modal).insertVideos();
      window.clearTimeout(timeout);
    });

    this.deck.on('kixx-modal:closed', function () {
      timeout = window.setTimeout(function () {
        $('#site-container').fadeIn();
        window.location.hash = '';
      }, 30);
    });
  }),

  open: function (id, openOptions, closeOptions) {
    openOptions = openOptions || {}

    openOptions.position = function (opts) {
      if ($(window).innerWidth() >= window.STATIC_MODAL_BREAKPOINT && !Modernizr.touch) {
        var h = this.outerHeight()
          , w = this.outerWidth()

        this.css({
          marginLeft: -(w/2)
        , marginTop: -(h/2)
        });
      } else {
        $('#site-container').hide();
        this.css({
          marginLeft: 0
        , marginTop: 0
        });
      }
    };

    this.deck.open(id, openOptions, closeOptions);
  },

  close: function (id) {
    this.deck.closeAll();
  }
};

function VideoModal($modal) {
  this.$modal = $modal;
  this.$wrappers = $modal.find('.videowrapper');
}

VideoModal.prototype = {
  $wrappers: null,

  insertVideos: function () {
    var self = this

    this.$wrappers.each(function () {
      var $wrapper = $(this), $iframe

      $wrapper.empty();
      $iframe = $wrapper.append(self.iframe($wrapper)).children('iframe')

      self.$modal.one('kixx-modal:closing', function () {
        $iframe.remove();
      })
    });
  },

  iframe: function ($wrapper) {
    var src = this.srcURL($wrapper)
    return '<iframe src="'+ src +'" width="746" height="420" frameborder="0" allowfullscreen></iframe>';
  },

  srcURL: function ($wrapper) {
    var src = $wrapper.data('src')

    if (src.indexOf('?') > -1) {
      src += '&autoplay=1';
    } else {
      src += '?autoplay=1';
    }

    return src;
  }
};

// Portrait slide show controller:
window.Portraits = {
  slideshow: null,
  currentId: null,

  initialize: _.once(function () {
    this.currentId = null;
    var self = this;

    function onTransition($from, $to) {
      var id = $to.prop('id')
      self.currentId = id;
      window.location.hash = id;
      self.activateThumbnail();
    }

    $('#section_portraits').on('kixx-modal:opening', function () {
      self.initializeSlideShow();
    }).on('kixx-modal:closed', function () {
      self.destroySlideShow();
    });

    $('a.trigger-previous-slide').on('click', function (ev) {
      ev.preventDefault();
      if (self.slideshow) {
        self.slideshow.previous({complete: onTransition});
      }
    });

    $('a.trigger-next-slide').on('click', function (ev) {
      ev.preventDefault();
      if (self.slideshow) {
        self.slideshow.next({complete: onTransition});
      }
    });
  }),

  open: function (id) {
    if (!id || this.currentId !== id) {
      this.currentId = id;
      if (this.slideshow) {
        this.slideshow.show(id);
        this.activateThumbnail();
      } else {
        window.Modals.open('section_portraits');
      }
    }
  },

  initializeSlideShow: function (id) {
    id = id || this.currentId || 'section_portraits_slide-show-slide-f-1';
    this.slideshow = $('#portrait-slide-show').kixxSlides({
      initial: id
    , aspectRatio: 1.4
    });
    this.currentId = id;
    this.activateThumbnail();
    return this.slideshow;
  },

  destroySlideShow: function () {
    if (this.slideshow) {
      this.slideshow.destroy();
      this.slideshow = null;
      this.currentId = null;
    }
  },

  activateThumbnail: function () {
    var klass = this.currentId.match(/^section_portraits_slide-show-slide-([a-z]{1})-/)[1]
    $('#section_portraits')
      .find('a.thumb-link').removeClass('active')
      .filter('.'+ klass).addClass('active');
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
window.HashHistory = {
  initialize: _.once(function () {
    $(window).on('hashchange', function (ev) {
      window.HashHistory.route(ev, window.location.hash.replace(/^#/, ''));
    }).trigger('hashchange');
  }),

  route: function (ev, hash) {
    var section
    if (!hash) {
      this.goHome();
    } else if (section = hash.match(/^(section_[\w\-]+)_sub_([\w\-]+)/)) {
      this.openSubSection(section[1], hash);
    } else if (section = hash.match(/^section_portraits/)) {
      this.openPortraitSlide(/slide-show-slide/.test(hash) ? hash : null);
    } else {
      this.openWindow(hash);
    }
  },

  goHome: function () {
    window.Modals.close();
  },

  openWindow: function (id) {
    window.Modals.open(id);
    return false;
  },

  openPortraitSlide: function (slide) {
    window.Portraits.open(slide);
    return false;
  },

  openSubSection: function (section, id) {
    window.Modals.open(section);
    $('a.content-link').removeClass('active')
      .filter('[href="#'+ id +'"]').addClass('active')
    return false;
  }
};

// Do right now (before document ready):
(function () {
  var initialize

  // Initialize the page after window load and 600ms.
  initialize = _.after(2, function () {
    window.TileGrid.initialize();

    $('body').addClass('initialized');
    $('.init-hidden').fadeIn();

    window.Modals.initialize();
    window.Portraits.initialize();
    window.ShareLinks.initialize();

    // Begin interacting with the page:
    window.HashHistory.initialize();
  });

  // Initialize the page after *both* these events have been detected.
  $(window).on('load', initialize);
  window.setTimeout(initialize, 1200);
}())
