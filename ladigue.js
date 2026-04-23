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

// --- Snap forcé sur #intro ---
let introScrollLock = false;

function isOnIntro() {
  // On est sur l'intro si le scroll est dans le premier viewport
  return window.scrollY < window.innerHeight * 0.5;
}

function getNextSection() {
  const intro = document.getElementById('intro');
  if (!intro) return null;
  // Cherche le prochain élément section frère
  let next = intro.nextElementSibling;
  while (next && next.tagName !== 'SECTION') {
    next = next.nextElementSibling;
  }
  return next;
}

window.addEventListener('wheel', (e) => {
  if (!isOnIntro() || introScrollLock) return;

  e.preventDefault();
  introScrollLock = true;

  if (e.deltaY > 0) {
    // Scroll vers le bas → section suivante
    const next = getNextSection();
    if (next) {
      const offset = (window.innerWidth > 600) ? -80 : 0;
      lenis.scrollTo(next, {
        duration: 1.0,
        offset: offset,
        onComplete: () => {
          setTimeout(() => { introScrollLock = false; }, 500);
        }
      });
    } else {
      introScrollLock = false;
    }
  } else {
    // Scroll vers le haut → retour tout en
