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

var mouseX = 0;
var mouseY = 0;
var activeX = 0;
var activeY = 0;
var topborder = 0;
var moving = true;


$('#surface').ready(function(){
	scrollUpdate();
	
	/**
	 * If the Teamdesk surface is ready this will begin to check the mouse position
	 * and scroll in the right direction
	 */
	var speedupIntervall = 8;
	var sensityRange = 150;
	var surfaceholder = $('#surfaceholder');
	function scrollUpdate(){
		var x = Math.round($(surfaceholder).scrollLeft());
		var y = Math.round($(surfaceholder).scrollTop());
		var moved_top = false;
		var moved_right = false;
		var moved_bot = false;
		var moved_left = false;
		var speed = 0;
		var speedIntervall = 0;
		if(moving == true){
			for(var i = sensityRange; i > -1; i--){
				if(speedIntervall != speedupIntervall){
					speedIntervall++;
				}else{
					speed++;
					speedIntervall = 0;
				}
				if(moved_top == false){
					if(mouseY == i + topborder){
						$(surfaceholder).scrollTop(y-speed);
						moved_top = true;
					}
				}
				if(moved_right == false){
					if(mouseX == (activeX - i)){
						$(surfaceholder).scrollLeft(x+speed);
						moved_right = true;
					}
				}
				if(moved_bot == false){
					if(mouseY == (activeY - i)){
						$(surfaceholder).scrollTop(y+speed);
						moved_bot = true;
					}
				}
				if(moved_left == false){
					if(mouseX == i){
						$(surfaceholder).scrollLeft(x-speed);
						moved_left = true;
					}
				}
			}
		}
		setTimeout(scrollUpdate, 16);
	}
	
	$('#surface').mousedown(function(e){
		if( e.target == this ){
			e.preventDefault();
			if(moving == false){
				 moving = true;
				 showInfo(autoscroll_scrollstart, 1000);
			 }else{
				 moving = false;
				 showInfo(autoscroll_scrollstop, 1000);
			 }
		}
	});
	
	/**
	 * This will update the mouse position on the TeamDesk Surface
	 */
	var header = $('#header');
	$('#surfaceholder').mousemove(function(event){
		activeX = Math.round($(window).width());
		activeY = Math.round($(window).height());
		mouseX = Math.round(event.pageX);
		mouseY = Math.round(event.pageY);
		topborder = Math.round($(header).height());
	});
});
