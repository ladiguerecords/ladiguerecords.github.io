// JavaScript Document

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                     Lenis + Snap custom avec inertie                                                      //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- Variables ---
let snapTimeout = null;
let isSnapping = false;
let introSnapping = false;

// --- SCROLL LISTENER ---
lenis.on('scroll', function (e) {
  var introTarget = window.innerHeight - 80;

  // --- INTRO SNAP ---
  if (e.scroll > 20 && e.scroll < introTarget - 20 && Math.abs(e.velocity) < 1 && !introSnapping) {
    introSnapping = true;

    if (e.direction > 0) {
      lenis.scrollTo(introTarget, {
        duration: 0.6
      });
    } else {
      lenis.scrollTo(0, {
        duration: 0.6
      });
    }

    setTimeout(function () {
      introSnapping = false;
    }, 1500);
    return;
  }

  // --- VIDEO BACKGROUND : pause/play ---
  var vbg = window.VIDEO_BACKGROUNDS;
  if (vbg) {
    for (var k in vbg.index) {
      if (e.scroll >= introTarget - 5) {
        vbg.index[k].softPause();
      } else {
        if (!vbg.index[k].paused) vbg.index[k].softPlay();
      }
    }
  }

  // --- SNAP DOUX pour les autres sections ---
  clearTimeout(snapTimeout);

  if (!isSnapping && !introSnapping && e.scroll >= introTarget - 20 && Math.abs(e.velocity) < 0.5) {
    snapTimeout = setTimeout(function () {
      snapToClosestSection(e.scroll);
    }, 150);
  }
});

function snapToClosestSection(currentScroll) {
  var sections = document.querySelectorAll('section');
  var headerOffset = (window.innerWidth > 600) ? 80 : 0;
  var closest = null;
  var closestDist = Infinity;

  sections.forEach(function (section) {
    if (section.id === 'intro') return;

    var top = section.offsetTop - headerOffset;
    var dist = Math.abs(currentScroll - top);
    if (dist < closestDist) {
      closestDist = dist;
      closest = top;
    }
  });

  if (closest !== null && closestDist < window.innerHeight * 0.4 && closestDist > 5) {
    isSnapping = true;
    lenis.scrollTo(closest, {
      duration: 0.8,
      onComplete: function () {
        isSnapping = false;
      }
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                               Init                                                                        //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {

  jQuery('[data-vbg]').youtube_background({
    'volume': 1,
    'muted': false,
    'no-cookie': false,
    'end-at': 0,
    'mobile': true
  });

  var myback = jQuery('#back');
  myback.on('video-background-ready', function () {
    $('#back').animate({
      'opacity': 1
    }, 3000);
  });

  $('.web, .bc, .rs, .itembloc').on('click', function (e) {
    e.preventDefault();
    if ($(this).attr("adresse") != "null") {
      window.open($(this).attr("adresse"), '_blank');
    } else {
      scrollto($(this).attr("cible"));
    }
  });

  $(window).on('scroll', checkscroll);

  $(document).on('click', '.top', function (e) {
    e.preventDefault();
    scrollto('main');
  });
});

/////////////////////////////////////////////////////////////// Les fonctions

function viewvideo() {
  $('#back').animate({
    'opacity': 1
  }, 3000);
}

function checkscroll() {
  var scrollTop = $(window).scrollTop();
  var targetOffset = $('#section5').offset().top;
  if (targetOffset <= scrollTop + $('#section1').height() + 80) {
    $('#section1').css({
      position: 'static'
    });
  } else {
    if ($(window).width() > 600) {
      $('#section1').css({
        position: 'sticky',
        top: 80
      });
    } else {
      $('#section1').css({
        position: 'sticky',
        top: 0
      });
    }
  }
}

function scrollto(lacible) {
  var offset = ($(window).width() > 600) ? -80 : 0;
  var target = document.getElementById(lacible);
  if (target) {
    lenis.scrollTo(target, {
      offset: offset,
      duration: 1.0
    });
  }
}
