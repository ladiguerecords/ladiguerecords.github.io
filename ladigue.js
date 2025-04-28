// JavaScript Document
var menuopen = false;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                               Init                                                                        //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
  $('#petitmenu').on('click', function (e) {
    e.preventDefault();
    if (!menuopen) {
      menuopen = true;
      callmenu(0, 60);
    } else {
      menuopen = false;
      callmenu(60, 0);
    }
  })
});

function callmenu(quiW, rubW) {
  $('#qui').stop(true, true).animate({
    'width': quiW + '%',
  }, 500);
  $('#rubrik').stop(true, true).animate({
    'width': rubW + '%',
  }, 500);
}
