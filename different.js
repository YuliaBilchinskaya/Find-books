//стрелочка 

$(function() {
    $.fn.scrollToTop = function() {
        $(this).hide().removeAttr("href");
            if ($(window).scrollTop() != "0") {
                $(this).fadeIn("slow")
            }
            let scrollDiv=$(this);
            $(window).scroll(function() {
                if ($(window).scrollTop() == "0"){
                    $(scrollDiv).fadeOut("slow")
                } else { 
                    $(scrollDiv).fadeIn("slow")
                }
            }); 
                $(this).click(function() {
                    $("html, body").animate({scrollTop:0},"slow")
                })
    }});

$(function() { 
    $("#toTop").scrollToTop(); 
}); 
