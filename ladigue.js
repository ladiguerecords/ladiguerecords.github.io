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

// --- Snap custom ---
let snapTimeout = null;
let isSnapping = false;

lenis.on('scroll', ({ scroll, velocity }) => {
  // On attend que le scroll ralentisse pour snapper
  clearTimeout(snapTimeout);

  if (Math.abs(velocity) < 0.5 && !isSnapping) {
    snapTimeout = setTimeout(() => {
      snapToClosestSection(scroll);
    }, 150); // délai après arrêt du scroll
  }
});

function snapToClosestSection(currentScroll) {
  const sections = document.querySelectorAll('section');
  const headerOffset = (window.innerWidth > 600) ? 80 : 0;
  let closest = null;
  let closestDist = Infinity;

  sections.forEach((section) => {
    const top = section.offsetTop - headerOffset;
    const dist = Math.abs(currentScroll - top);
    if (dist < closestDist) {
      closestDist = dist;
      closest = top;
    }
  });

  // Ne snappe que si on est assez proche (< 40% de la hauteur écran)
  if (closest !== null && closestDist < window.innerHeight * 0.4 && closestDist > 5) {
    isSnapping = true;
    lenis.scrollTo(closest, {
      duration: 0.8,
      onComplete: () => {
        isSnapping = false;
      }
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                               Init                                                                        //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {

  // video back
  jQuery('[data-vbg]').youtube_background({
    'volume': 1,
    'muted': false,
    'no-cookie': false,
    'end-at': 0,
    'mobile': true
  });

  const myback = jQuery('#back');
  myback.on('video-background-ready', function (event) {
    $('#back').animate({ 'opacity': 1 }, 3000);
  });

  // web artists
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
  $('#back').animate({ 'opacity': 1 }, 3000);
}

function checkscroll(e) {
  var scrollTop = $(window).scrollTop();
  var windowHeight = $(window).height();
  var targetOffset = $('#section5').offset().top;
  if (targetOffset <= scrollTop + $('#section1').height() + 80) {
    $('#section1').css({ position: 'static' });
  } else {
    $('#section1').css({ position: 'sticky', 'top': 0 });
  }
}

// Scroll-to via Lenis
function scrollto(lacible) {
  var offset = ($(window).width() > 600) ? -80 : 0;
  var target = document.getElementById(lacible);
  if (target) {
    lenis.scrollTo(target, { offset: offset, duration: 1.0 });
  }
}
