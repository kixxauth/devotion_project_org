(function ($, window, document, undefined) {
  var kixxSlides

  $.fn.kixxSlides = kixxSlides = function (opts) {
    opts = opts || {};
    opts.$container = this;

    var slides = new KixxSlides(opts)
    slides.initialize(opts);

    return slides;
  };

  function KixxSlides(opts) {
    this.$container = $(opts.$container[0]);
    this.$current = null;
    this.$slides = this.$container.children();
  }

  KixxSlides.fn = KixxSlides.prototype = {
    $container: null,
    $slides: null,
    $current: null,

    initialize: function (opts) {
      var aspectRatio = opts.aspectRatio || 1.5

      this.$slides.hide();

      this.$container.css({
        position: 'relative'
      , overflow: 'hidden'
      , listStyleType: 'none'
      , padding: 0
      , height: Math.floor(this.currentWidth() / aspectRatio)
      })

      if (opts.initial) {
        this.show(opts.initial);
      }
    },

    previous: function (opts) {
      opts = opts || {};

      var self = this
        , inOpts = $.extend({}, opts)
        , complete = refunct(opts, 'complete')
        , $next = this.$previous()
        , hideDone = false
        , showDone = false

      if ($next.data('kixxSlidesOpen')) {
        complete(this.$current, this.$current);
        return;
      }

      function maybeComplete(done) {
        if (done.show) {
          showDone = true;
        } else {
          hideDone = true;
        }

        if (hideDone && showDone) {
          var $from = self.$current
          if (self.$current) {
            self.$current.data('kixxSlidesOpen', false);
            self.$current.hide();
          }
          $next.data('kixxSlidesOpen', true);
          self.$current = $next;
          complete($from, $next);
        }
      }

      opts.complete = function () {
        maybeComplete({hide: true});
      };

      inOpts.complete = function () {
        maybeComplete({show: true});
      };

      if (opts.transition === 'fade') {
        this.transitionFade($next, inOpts, opts);
      } else {
        this.transitionRight($next, inOpts, opts);
      }
    },

    next: function (opts) {
      opts = opts || {};

      var self = this
        , inOpts = $.extend({}, opts)
        , complete = refunct(opts, 'complete')
        , $next = this.$next()
        , hideDone = false
        , showDone = false

      if ($next.data('kixxSlidesOpen')) {
        complete(this.$current, this.$current);
        return;
      }

      function maybeComplete(done) {
        if (done.show) {
          showDone = true;
        } else {
          hideDone = true;
        }

        if (hideDone && showDone) {
          var $from = self.$current
          if (self.$current) {
            self.$current.data('kixxSlidesOpen', false);
            self.$current.hide();
          }
          $next.data('kixxSlidesOpen', true);
          self.$current = $next;
          complete($from, $next);
        }
      }

      opts.complete = function () {
        maybeComplete({hide: true});
      };

      inOpts.complete = function () {
        maybeComplete({show: true});
      };

      if (opts.transition === 'fade') {
        this.transitionFade($next, inOpts, opts);
      } else {
        this.transitionLeft($next, inOpts, opts);
      }
    },

    show: function (id, opts) {
      opts = opts || {};

      var self = this
        , inOpts =  $.extend({}, opts)
        , $next
        , complete = refunct(opts, 'complete')
        , hideDone = false
        , showDone = false

      if (typeof id === 'string') {
        $next = $('#'+ kixxSlides.hashToId(id))
      } else {
        $next = $(id);
      }

      if ($next.data('kixxSlidesOpen')) {
        complete(this.$current, this.$current);
        return;
      }

      function maybeComplete(done) {
        if (done.show) {
          showDone = true;
        } else {
          hideDone = true;
        }

        if (hideDone && showDone) {
          var $from = self.$current
          if (self.$current) {
            self.$current.data('kixxSlidesOpen', false);
            self.$current.hide();
          }
          $next.data('kixxSlidesOpen', true);
          self.$current = $next;
          complete($from, $next);
        }
      }

      opts.complete = function () {
        maybeComplete({hide: true});
      };

      inOpts.complete = function () {
        maybeComplete({show: true});
      };

      this.transitionFade($next, inOpts, opts);
    },

    transitionFade: function ($next, inOpts, outOpts) {
      var self = this
        , outComplete = refunct(outOpts, 'complete')

      outOpts.complete = function () {
        $next.css({
          position: 'absolute'
        , top: 0
        , left: 0
        , width: self.currentWidth()
        , height: self.currentHeight()
        }).fadeIn(inOpts);

        self.containSlide($next);
        outComplete();
      };

      if (this.$current) {
        this.$current.fadeOut(outOpts);
      } else {
        outOpts.complete();
      }
    },

    transitionLeft: function ($next, inOpts, outOpts) {
      var width = this.currentWidth()

      $next.css({
        position: 'absolute'
      , top: 0
      , left: width + 1
      , width: width
      , height: this.currentHeight()
      , display: 'block'
      });

      this.containSlide($next);

      if (this.$current) {
        this.$current.animate({left: -(width - 1)}, outOpts);
      } else if ($.isFunction(outOpts.complete)) {
        outOpts.complete();
      }
      $next.animate({left: 0}, inOpts);
    },

    transitionRight: function ($next, inOpts, outOpts) {
      var width = this.currentWidth()

      $next.css({
        position: 'absolute'
      , top: 0
      , left: -(width - 1)
      , width: width
      , height: this.currentHeight()
      , display: 'block'
      });

      this.containSlide($next);

      if (this.$current) {
        this.$current.animate({left: width + 1}, outOpts);
      } else if ($.isFunction(outOpts.complete)) {
        outOpts.complete();
      }
      $next.animate({left: 0}, inOpts);
    },

    destroy: function () {
      this.$current = null;
      this.$slides.hide().data('kixxSlidesOpen', false);
    },

    $next: function () {
      var i = this.$slides.filter(this.$current).index()
        , next = i + 1

      if (next >= this.$slides.length) return this.$slides.first();
      return $(this.$slides[next]);
    },

    $previous: function () {
      var i = this.$slides.filter(this.$current).index()
        , next = i - 1

      if (next < 0) return this.$slides.last();
      return $(this.$slides[next]);
    },

    currentWidth: function () {
      return this.$container.innerWidth();
    },

    currentHeight: function () {
      return this.$container.innerHeight();
    },

    containSlide: function ($slide) {
      var $inner = $slide.find('img')
        , width = this.currentWidth()
        , height = this.currentHeight()
        , usedHeight = 0
        , h = +$inner.outerHeight(true)
        , w = +$inner.outerWidth(true)
        , ar = w / h
        , marginLeft = 0
        , marginTop = 0
      if ($inner.data('kixxSlidesContainerWidth') == width || $inner.data('kixxSlidesContainerHeight') == height) {
        return $slide;
      }
      $inner.data('kixxSlidesContainerWidth', width);
      $inner.data('kixxSlidesContainerHeight', height);

      $inner.siblings().each(function () {
        usedHeight += $(this).outerHeight(true);
      });

      height = height - usedHeight;

      if ((w - width) > 0 || (h - height) > 0) {
        if (w/width < h/height) {
          h = height;
          w = h * ar;
        } else {
          w = width;
          h = w / ar;
        }
      }

      if (w < width) {
        marginLeft = (width - w) / 2;
      }
      if (h < height) {
        marginTop = (height - h) / 2;
      }

      $inner.css({
        display: 'block'
      , width: w
      , height: h
      , marginTop: marginTop
      , marginLeft: marginLeft
      })

      return $slide;
    }
  };

  kixxSlides.hashToId = function (str) {
    return str.replace(/^#/, '');
  };

  kixxSlides.noop = function () {};

  function refunct(obj, name) {
    if (arguments.length < 2) {
      return $.isFunction(obj) ? obj : kixxSlides.noop;
    }
    return $.isFunction(obj[name]) ? obj[name] : kixxSlides.noop;
  }

  kixxSlides.KixxSlides = KixxSlides;
  $.kixxSlides = kixxSlides;
}(jQuery, window, document));