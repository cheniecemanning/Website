jQuery(function($) {


	/* =============== MAKE MAIN MENU STICKED ON TOP WHEN SCROLL =============== */
	$(window).scroll(function () {
		if ($(this).scrollTop() == $('#header').height() || $(this).scrollTop() > $('#header').height()) {
			$('body').addClass("fixed-nav");
			$('body').css('padding-top', $('#navbar').height() + 'px');
		} else {
			$('body').removeClass("fixed-nav");
			$('body').css('padding-top', 0);
		}
	});
	
	/* =============== SMOOTH SCROOL EFFECT =============== */
	$('#navbar ul li a').on('click',function (e) {
	    e.preventDefault();
	    var target = this.hash,
	    $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top 
	    }, 500, 'swing', function () {
	        window.location.hash = target;
	    });
	});
	
	/* =============== SHOW / HIDE GO TO TOP =============== */
	/* Check to see if the window is top if not then display go top button */
	$(window).scroll(function(){
		if ($(this).scrollTop() > 200) {
			$('#scrollToTop').fadeIn();
		} else {
			$('#scrollToTop').fadeOut();
		}
	});
	/* Click event to scroll to top */
	$('#scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});
});