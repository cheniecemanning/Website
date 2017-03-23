var pContainerHeight = $('#header').height();

$(window).scroll(function(){

  var wScroll = $(this).scrollTop();

  if (wScroll <= pContainerHeight) {

    $('.content').css({
             
   
   
      'transform' : 'translate(0px, '+ wScroll /95 +'%)'
        
    });


   
  }
  
});


