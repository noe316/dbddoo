(function($) {
	$(document).ready(function() {
		// 맨 위로 이동
		$('#on_top').click(function(e) {
			$('body, html').stop().animate({scrollTop:0}, 500);
			e.preventDefault();
		});
		var scrollTimer = null;
		$(window).scroll(function(e) {
			clearTimeout(scrollTimer);
			scrollTimer = setTimeout(function() {
				var scrollTop = $(window).scrollTop();
				if(scrollTop > 100) $('#on_top').fadeIn(600);
				else $('#on_top').fadeOut(200);
			}, 100);
		});
	});
}(jQuery));