// preloading all images on a small interval
var interval = 500;

document.preloads = [];

setInterval(function() {
  if (document.preloads.length) {
    var url = document.preloads.pop();

    $.get(url);
  }
}, interval);

$(document).ready(function() {
  $.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
  };

  $('.cards .img img').each(function(index, element) {
    document.preloads.push($(element).data('hover'));

    $(element).mouseover(function() {
      $(element).data('og-src', $(element).attr('src'));
      $(element).attr('src', $(element).data('hover'));
    });

    $(element).mouseout(function() {
      $(element).attr('src', $(element).data('og-src'));
    });
  });
  $(window).scroll(function() {
    var scrollPos = $(document).scrollTop();

    if (parseInt(scrollPos) % 100 < 10) {
      $('#toc a').removeClass('active');
      $('#toc a').each(function() {
        var href = $(this).attr('href');
        var target_selector = href;

        if ($(target_selector).isInViewport()) {
          if ($('#toc a.active').length < 1) {
            $(this).addClass('active');
          }
        }
      });
    }
  });

  function voteCallback(toolId, direction) {
    var scoreEl = $('#' + toolId + '_vote .score');
    var upVoteButton = $('#' + toolId + '_vote .vote-up');
    var downVoteButton = $('#' + toolId + '_vote .vote-down');

    if (direction == 1)
      upVoteButton.addClass('active');
    if (direction == -1)
      downVoteButton.addClass('active');
    upVoteButton.attr('disabled', true);
    downVoteButton.attr('disabled', true);
    scoreEl.text(parseInt(scoreEl.text()) + direction);
  }

  $('.vote-up').click(function() {
    var el = $(this);
    var toolId = el.data('tool-id');

    $.post('/actions/tool/' + toolId + '/voteUp', {}, function() {
      voteCallback(toolId, 1);
    });
  });
  $('.vote-down').click(function() {
    var el = $(this);
    var toolId = el.data('tool-id');

    $.post('/actions/tool/' + toolId + '/voteDown', {}, function() {
      voteCallback(toolId, -1);
    });
  });

});
