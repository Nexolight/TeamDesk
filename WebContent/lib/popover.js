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

var move_bkup;
$('#popover').ready(function(){
	loginfo("popover.js", "$('#popover').ready(function()...", "Popover is ready");
	
	if(typeof moving !== 'undefined'){
		move_bkup = moving;
		moving = false;
	}

	fixElementheight($('#popover_holder'));
	fixElementwidth($('#popover_holder'));
	makeMovable($('#popover_header'), $('#popover_holder'), $('#content'));
	flashdiv($('#popover_holder'), $('#popover_flash').css("color"), 25, 50);
	$('#popover_holder').fadeIn(500);
	$('#popover_cancel').click(function(){
		closePopover();
	});
	$('#popover_shadow').fadeIn(500);
	
	$(window).resize(function(){
		fixElementheight($('#popover_holder'));
		fixElementwidth($('#popover_holder'));
	});
	
	$(window).keydown(function(event){
		if ((event.which || event.keyCode) == 27){
			closePopover();
		}
	});
});

/**
 * This will close the popover and restore the autoscroll state
 * @param callback
 */
function closePopover(callback){
	loginfo("popover.js", "closePopover", "Close popover");
	$('#popover_holder').fadeOut(300);
	$('#popover_shadow').fadeOut(300, function(){
		$('#popover').remove();
		if(typeof moving !== 'undefined'){
			moving = move_bkup;
		}
		if(typeof callback == "function"){
			callback();
		}
	});
}