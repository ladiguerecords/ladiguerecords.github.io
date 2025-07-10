// JavaScript Document
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                               Init                                                                        //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
  //video back
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
  //web artists
  $('.web, .bc, .rs, .itemblocVG, .itemblocV, .itemblocM').on('click', function (e) {
    e.preventDefault();
    if ($(this).attr("adresse") != "null") {
      window.open($(this).attr("adresse"), '_blank');
    }
  })
});
/////////////////////////////////////////////////////////////// Les fonctions
function viewvideo() {
  $('#back').animate({
    'opacity': 1,
  }, 3000);
}

