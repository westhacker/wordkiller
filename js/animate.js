// JavaScript Document
function testAnim(x) {
    $(x).addClass('animated rubberBand').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated rubberBand');
    });
  };
  
function rightAnim(x) {
    $(x).addClass('animated rubberBand').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated rubberBand');
    });
  };
  
function wrongAnim(x) {
    $(x).addClass('animated tada').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated tada');
    });
  };
  
function choosedict(x) {
    $(x).addClass('animated fadeOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated fadeOutLeft');
	  decidedict()
    });
  };
  
function choosemode() {
    $("#mode"+numQ).addClass('animated rollOut').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated rollOut');
	  if(numQ==0)initclassic();
	  if(numQ==1)initmatch();
	  if(numQ==2)initpvp();
    });
  };