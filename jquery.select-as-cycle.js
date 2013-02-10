(function($, undefined){
  $.fn.selectAsCycle = function(opts) {
    opts = $.extend({}, opts || {});
    var EMPTY_FN = function() {};

    var prev = $.extend({
      text: 'Prev',
      pos: 'after'
    }, opts.prev || {});

    var next = $.extend({
      text: 'Next',
      pos: 'before'
    }, opts.next || {});

    var changeOn = opts.changeOn || 'after';
    var init = opts.init || EMPTY_FN;
    var renderItem = opts.renderItem || function($opt) {
      return $opt.text();
    };

    $(this).each(function() {
      var $select = $(this);
      var $container = $('<div class="select-as-cycle-container"></div>');
      var $content = $('<ul class="select-as-cycle-content"></ul>');
      var $prev = $('<div class="select-as-cycle-prev">' + prev.text + '</div>');
      var $next = $('<div class="select-as-cycle-next">' + next.text + '</div>');

      $('option', $select).each(function(index) {
        var $opt = $(this);
        var $item = $('<li class="select-as-cycle-item">' + renderItem($opt) + '</li>');
        $item.data('select-as-cycle-index', index);
        $item.appendTo($content);
      });

      $select.after($container);
      $content.appendTo($container);
      $content[prev.pos]($prev);
      $content[next.pos]($next);

      var cycleOpts = $.extend({
        fx: 'scrollVert',
        timeout: 0
      }, opts.cycle || {});

      var cb = cycleOpts[changeOn] || EMPTY_FN;
      cycleOpts.prev = $prev;
      cycleOpts.next = $next;
      cycleOpts.startingSlide = $select[0].selectedIndex;

      cycleOpts[changeOn] = function(curr, next, opts) {
        cb(curr, next, opts);

        var index = $(next).data('select-as-cycle-index');
        $select[0].selectedIndex = index;
        $select.trigger('change', [true]);
      };

      $select.change(function(ev, cycled) {
        if (!cycled) {
          // Do not change slide if change was triggered by 'changeOn'.
          var index = this.selectedIndex;
          $content.cycle(index);
        }
      });

      $content
      .cycle(cycleOpts);

      if (opts.wheel && 'mousewheel' in $.fn) {
        $content
        .mousewheel(function(event, delta) {
          event.preventDefault();
          if (delta > 0 && next.pos == 'before') {
            $next.click();
          }
          else {
            $prev.click();
          }
        });
      }

      $select.addClass('select-as-cycle');

      // Call custom initializer.
      init.call($select, $content, $next, $prev, opts);
    });

    return $(this);
  };
}(jQuery));