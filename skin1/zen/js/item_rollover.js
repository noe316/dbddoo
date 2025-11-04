(function($) {
$(".itemlist .item").hover(function(){
$(this).find(".toggle_img").fadeIn('fast');
$(this).find(".toggle_info").slideDown('fast');

},function(){
$(this).find(".toggle_img").fadeOut('fast');
$(this).find(".toggle_info").slideUp('fast');
});
})(jQuery);