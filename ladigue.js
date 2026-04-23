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

// --- Snap forcé sur l'intro ---
let introScrollLock = false;

window.addEventListener('wheel', (e) => {
  const intro = document.getElementById('backgrounds');
  if (!intro) return;

  const introRect = intro.getBoundingClientRect();
  // On est "sur" l'intro si elle est visible à plus de 50%
  const introVisible = introRect.top < window.innerHeight * 0.5 && introRect.bottom > window.innerHeight * 0.5;

  if (introVisible && !introScrollLock) {
    introScrollLock = true;
    e.preventDefault();

    if (e.deltaY > 0) {
      // Scroll vers le bas → section suivante
      const nextSection = intro.nextElementSibling;
      if (nextSection) {
        const offset = (window.innerWidth > 600) ? -80 : 0;
        lenis.scrollTo(nextSection, {
          duration: 1.0,
          offset: offset,
          onComplete: () => {
            setTimeout(() => { introScrollLock = false; }, 300);
          }
        });
      } else {
        introScrollLock = false;
      }
    } else {
      // Scroll vers le haut → retour en haut
      lenis.scrollTo(0, {
        duration: 1.0,
        onComplete: () => {
          setTimeout(() => { introScrollLock = false; }, 300);
        }
      });
    }
  }
}, { passive: false });

// --- Snap touch pour l'intro (mobile) ---
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  const intro = document.getElementById('backgrounds');
  if (!intro) return;

  const introRect = intro.getBoundingClientRect();
  const introVisible = introRect.top < window.innerHeight * 0.5 && introRect.bottom > window.innerHeight * 0.5;

  if (introVisible && !introScrollLock) {
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;

    if (Math.abs(delta) > 30) { // seuil minimum de swipe
      introScrollLock = true;

      if (delta > 0) {
        const nextSection = intro.nextElementSibling;
        if (nextSection) {
          const offset = (window.innerWidth > 600) ? -80 : 0;
          lenis.scrollTo(nextSection, {
            duration: 1.0,
            offset: offset,
            onComplete: () => {
              setTimeout(() => { introScrollLock = false; }, 300);
            }
          });
        }
      } else {
        lenis.scrollTo(0, {
          duration: 1.0,
          onComplete: () => {
            setTimeout(() => { introScrollLock = false; }, 300);
          }
        });
      }
    }
  }
}, { passive: true });

// --- Snap doux pour les autres sections ---
lenis.on('scroll', ({ scroll, velocity }) => {
  clearTimeout(snapTimeout);

  if (Math.abs(velocity) < 0.5 && !isSnapping) {
    snapTimeout = setTimeout(() => {
      snapToClosestSection(scroll);
    }, 150);
  }
});

function snapToClosestSection(currentScroll) {
  // Ne pas snapper si on est sur l'intro
  const intro = document.getElementById('backgrounds');
  if (intro) {
    const introRect = intro.getBoundingClientRect();
    if (introRect.top < window.innerHeight * 0.5 && introRect.bottom > window.innerHeight * 0.5) {
      return;
    }
  }

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

function scrollto(lacible) {
  var offset = ($(window).width() > 600) ? -80 : 0;
  var target = document.getElementById(lacible);
  if (target) {
    lenis.scrollTo(target, { offset: offset, duration: 1.0 });
  }
}
