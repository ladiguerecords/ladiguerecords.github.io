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

// --- Détection intro ---
function isOnIntro() {
  var intro = document.getElementById('intro');
  if (!intro) return false;
  // On est sur l'intro si le haut de #main n'est pas encore atteint
  var main = document.getElementById('main');
  if (!main) return false;
  return window.scrollY < main.offsetTop - 100;
}

// --- WHEEL : snap forcé sur l'intro ---
// On intercepte AVANT Lenis en capturant en phase capture
document.addEventListener('wheel', function (e) {
  console.log('isOnIntro:', window.scrollY, document.getElementById('main').offsetTop);
  if (!isOnIntro() || isSnapping) return;

  e.preventDefault();
  e.stopImmediatePropagation();
  isSnapping = true;

  // Stopper Lenis pour empêcher tout scroll parasite
  lenis.stop();

  var headerOffset = (window.innerWidth > 600) ? 80 : 0;

  if (e.deltaY > 0) {
    // Scroll vers le bas → aller à #main
    lenis.start();
    lenis.scrollTo(document.getElementById('main'), {
      offset: -headerOffset,
      duration: 1.2,
      onComplete: function () {
        setTimeout(function () {
          isSnapping = false;
        }, 300);
      }
    });
  } else {
    // Scroll vers le haut → retour en haut
    lenis.start();
    lenis.scrollTo(0, {
      duration: 1.0,
      onComplete: function () {
        setTimeout(function () {
          isSnapping = false;
        }, 300);
      }
    });
  }
}, {
  passive: false,
  capture: true
});

// --- TOUCH : snap forcé sur l'intro (mobile) ---
var touchStartY = 0;
var touchHandled = false;

document.addEventListener('touchstart', function (e) {
  touchStartY = e.touches[0].clientY;
  touchHandled = false;
}, {
  passive: true
});

document.addEventListener('touchmove', function (e) {
  if (!isOnIntro() || isSnapping || touchHandled) return;

  var delta = touchStartY - e.touches[0].clientY;
  if (Math.abs(delta) < 30) return;

  touchHandled = true;
  isSnapping = true;
  lenis.stop();

  var headerOffset = (window.innerWidth > 600) ? 80 : 0;

  if (delta > 0) {
    lenis.start();
    lenis.scrollTo(document.getElementById('main'), {
      offset: -headerOffset,
      duration: 1.2,
      onComplete: function () {
        setTimeout(function () {
          isSnapping = false;
        }, 300);
      }
    });
  } else {
    lenis.start();
    lenis.scrollTo(0, {
      duration: 1.0,
      onComplete: function () {
        setTimeout(function () {
          isSnapping = false;
        }, 300);
      }
    });
  }
}, {
  passive: true
});

// --- Snap doux pour les autres sections ---
lenis.on('scroll', function (e) {
  clearTimeout(snapTimeout);

  if (Math.abs(e.velocity) < 0.5 && !isSnapping) {
    snapTimeout = setTimeout(function () {
      snapToClosestSection(e.scroll);
    }, 150);
  }
});

function snapToClosestSection(currentScroll) {
  if (isOnIntro()) return;

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
    if (($(window).width() < 600)) {
      $('#section1').css({
        position: 'sticky',
        top: '0'
      });
    } else {
      $('#section1').css({
        position: 'sticky',
        top: '80px'
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
