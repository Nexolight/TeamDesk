/**
*
* Copyright (C) 2014-2015 Inc. All Rights Reserved.
* 
* Federal Departement of Defence, Civil Protection and Sport,
* Armed Forces Command Support Organisation
* 
* and
* 
* Lucy von Känel - snow.dream.ch@gmail.com
* 
* ---------------------------------------------------------------------
* This file (code) is part of the project "TeamDesk"
* as well as a subject of the Artistic Licence 2.0.
* 
* See LICENCE.txt or https://opensource.org/licenses/Artistic-2.0
* 
* The code comes "as is". There is no waranty about it's functionality,
* merchantability and / or fitness for a particular purpose.
* No matter if expressed or implied.
* ---------------------------------------------------------------------
*
*/

$('div#mmHolder').ready(function(){
	var vpX = $(window).width();
	var vpY = $(window).height();
	var mmShrinkX = $('div#surface').width() / $('div#mmHolder').width();
	var mmShrinkY = $('div#surface').height() / $('div#mmHolder').height();
	var vpShrinkX = vpX / mmShrinkX;
	var vpShrinkY = vpY / mmShrinkY;
	setMMSize();
	shrink();
	refreshMMPos();
	
	$(window).on("resize", function(){
		vpX = $(window).width();
		vpY = $(window).height();
		setMMSize();
		shrink();
	});
	
	/**
	 * This will set the size of the minimap viewport
	 */
	function shrink(){
		mmShrinkX = $('div#surface').width() / $('div#mmHolder').width();
		mmShrinkY = $('div#surface').height() / $('div#mmHolder').height();
		vpShrinkX = vpX / mmShrinkX;
		vpShrinkY = vpY / mmShrinkY;
		$('div#mmViewport').width(vpShrinkX);
		$('div#mmViewport').height(vpShrinkY);
	}
	
	/**
	 * This sets the size of the minimap depending on the given end with. The resizement is linear
	 */
	function setMMSize(){
		var originSize = [parseInt($("div#surface").width()), parseInt($("div#surface").height())];
		var sizeNow = originSize;
		var endwith = 200;
		
		while(sizeNow[0] >= endwith){
			sizeNow[0] = sizeNow[0] * 0.9999;
			sizeNow[1] = sizeNow[1] * 0.9999;
		}
		$('div#mmHolder').width(Math.round(sizeNow[0]));
		$('div#mmHolder').height(Math.round(sizeNow[1]));
	}
	
	/**
	 * This will update the viewport position on the minimap.
	 */
	function refreshMMPos(){
		var mmViewport = $('div#mmViewport');
		var surfaceholder = $('div#surfaceholder');
		$('#surfaceholder').scroll(function(){
			$(mmViewport).css("top", $(surfaceholder).scrollTop() / mmShrinkY);
			$(mmViewport).css("left", $(surfaceholder).scrollLeft() / mmShrinkX);
		});
	}
	
	$('div#mmHolder').mousedown(function(event){
		if( event.target == this){
			event.preventDefault();
		}
	});
	
	$('div#mmViewport').mousedown(function(event){
			event.preventDefault();
	});
});