// JavaScript Document
var menuopen = false;
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
 /* const firstElement = $('[data-vbg]')[0];
  const firstInstance = VIDEO_BACKGROUNDS.get(firstElement);
	console.log(firstElement);*/
  const myback = jQuery('#back');
  myback.on('video-background-ready', function (event) {
    $('#back').animate({
      'opacity': 1,
    }, 3000);
  });
  //menu
  $('#petitmenu').on('click', function (e) {
    e.preventDefault();
    if (!menuopen) {
      menuopen = true;
      callmenu(0, 50);
    } else {
      menuopen = false;
      callmenu(50, 0);
    }
  })
  //web artists
  $('.web, .bc, .rs, .itemblocVG, .itemblocV, .itemblocM').on('click', function (e) {
    e.preventDefault();
    if ($(this).attr("adresse") != "null") {
      window.open($(this).attr("adresse"), '_blank');
    }
  })
});
/////////////////////////////////////////////////////////////// Les fonctions
function callmenu(quiW, rubW) {
  $('#qui').stop(true, true).animate({
    'width': quiW + '%',
  }, 500);
  $('#rubrik').stop(true, true).animate({
    'width': rubW + '%',
  }, 500);
}
