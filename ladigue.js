// JavaScript Document
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                               Init                                                                        //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
  //video back
  jQuery('[data-vbg]').youtube_background({
    'volume': 1,
    'muted': false,
    'no-cookie': false,
    'end-at': 0,
    'mobile': true
  });
  const myback = jQuery('#back');
  myback.on('video-background-ready', function (event) {
    $('#back').animate({
      'opacity': 1,
    }, 3000);
  });
  //web artists
  $('.web, .bc, .rs, .itembloc').on('click', function (e) {
    e.preventDefault();
    if ($(this).attr("adresse") != "null") {
      window.open($(this).attr("adresse"), '_blank');
    } else {
      scrollto($(this).attr("cible"));
    }
  })
  $(window).on('scroll', checkscroll);
  $(document).on('click', '.top', function (e) {
    e.preventDefault();
    scrollto('main');
  });

})
/////////////////////////////////////////////////////////////// Les fonctions
function viewvideo() {
  $('#back').animate({
    'opacity': 1,
  }, 3000);
}

function checkscroll(e) {
  var scrollTop = $(window).scrollTop(); // position actuelle du scroll
  var windowHeight = $(window).height(); // hauteur de la fenêtre
  var targetOffset = $('#section3').offset().top; // position de la div

  if (targetOffset <= scrollTop + $('#section1').height() + 80) {
    $('#section1').css({
      position: 'static'
    });
  } else {
    $('#section1').css({
      position: 'sticky',
      'top': 0,
    });
  }
}

function scrollto(lacible) {
  if ($(window).width() > 600) {
    $("body, html").animate({
        scrollTop: $('#' + lacible).offset().top - 80,
      },
      1000);
  } else {
    $("body, html").animate({
        scrollTop: $('#' + lacible).offset().top,
      },
      1000);
  }
}
