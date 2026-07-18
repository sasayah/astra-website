$(function(){
	$('a[href*=\\#]:not([href=\\#])').click(function() {
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
			if ($target.length) {
				if($(this).parents('.menuBox').length){
					setTimeout(function(){
						var targetOffset = $target.offset().top;
						$('html,body').animate({scrollTop: targetOffset - $('#gHeader').innerHeight()}, 1000);
					},100);
				}else{
					var targetOffset = $target.offset().top;
					$('html,body').animate({scrollTop: targetOffset - $('#gHeader').innerHeight()}, 1000);
				}
				return false;
			}
		}
	});
    
    var state = false;
	var scrollpos;
	
	if($(window).width() < 768){
		$('#gHeader .menu a').on('click', function(){
			if(state == false) {
				scrollpos = $(window).scrollTop();
				$('body').addClass('fixed').css({'top': -scrollpos});
				$('.menuBox').stop().slideDown(300);
				$('#gHeader .close').addClass('on');
				state = true;
			} else {
				$('body').removeClass('fixed').css({'top': 0});
				window.scrollTo( 0 , scrollpos );
				$('.menuBox').stop().slideUp(300);
				$('#gHeader .close').removeClass('on');
				state = false;
			}
			return false;	
		});
        $('#gHeader .close a').on('click', function(){
			$('body').removeClass('fixed').css({'top': 0});
				window.scrollTo( 0 , scrollpos );
				$('.menuBox').stop().slideUp(300);
				$('#gHeader .close').removeClass('on');
				state = false;
			
			return false;	
		});
	}
    
    $("#gNavi li:has(ul)").hover(function(){
        $(this).children("ul").slideToggle();
    });

    $(".menuBox li:has(ul) .ico").click(function(){
		$(this).parent().toggleClass("on");
		$(this).next("ul").stop().slideToggle();
		return false;
	});
    
    
	$(window).scroll(function () {
		if(state == false) {
			if ($(this).scrollTop() > 400) {
				$('.btmFix,.fixBox .popup').addClass("on");
			} else {
				$('.btmFix,.fixBox .popup').removeClass("on");
			}
		}
	});

    
	if($('#main .comVoiceList li .ttl').length){  
		$('#main .comVoiceList li .ttl').matchHeight();
	}
    
    if($('#main .comVoiceList li .text').length){  
		$('#main .comVoiceList li .text').matchHeight();
	}
	if($('.wp-pagenavi').length){
		if($('.wp-pagenavi .nextpostslink').length){
			$('.wp-pagenavi .nextpostslink').prev().addClass('nobd');
		}else{
			$('.wp-pagenavi').children().last().addClass('nobd');
		}
	}
	$(window).on('load',function(){
		var localLink = window.location+'';
		if(localLink.indexOf("#") != -1 && localLink.slice(-1) != '#'){	
			localLink = localLink.slice(localLink.indexOf("#")+1);
			$('html,body').animate({scrollTop: $('#'+localLink).offset().top - $('#gHeader').innerHeight()}, 500);
		}
	});
});

const params = location.href;
function getParams(params){
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params_obj = {};
  let match;
  while(match = regex.exec(params)){
    params_obj[match[1]] = match[2];
  }
  return params_obj;
}

if(location.pathname == "/huyouhin" && getParams(params)['location'] == "osaka"){
	console.log(document.getElementsByClassName("inn")[0].textContent)
	document.getElementsByClassName("inn")[0].textContent = "大阪市内の不用品回収"
}