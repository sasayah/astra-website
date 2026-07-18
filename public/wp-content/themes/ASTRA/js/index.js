	$(function(){
        $('#main .reasonBox li .photo').matchHeight();
        $('.mainVisual .slider').slick({
            autoplay: true,	
            pauseOnHover: false,
            pauseOnFocus: false,
            arrows: true,
            prevArrow: '.mainVisual .arrow .prev',
		    nextArrow: '.mainVisual .arrow .next'
        });
        
	});