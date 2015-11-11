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

var ttisup = false;
var warnisup = false;

function showTT(tt_listener, text){
	if(!warnisup){
		ttisup = true;
		$('#infobar').html(text);
		var left = ($(window).width() / 2) - ($('#infobar').width() / 2);
		var top = $('#header').height() + 10;
		$('#infobar').css("left", left);
		$('#infobar').css("top", top);
		$('#infobar').fadeIn(50);
		
		$(tt_listener).mouseleave(function(){
			$('#infobar').fadeOut(50);
			ttisup = false;
		});
	}
}

/**
 * This will show some text in a infobar under the header.
 * @param text
 * @param time
 */
function showInfo(text, time){
	if(!warnisup){
		ttisup = true;
		$('#infobar').html(text);
		var left = ($(window).width() / 2) - ($('#infobar').width() / 2);
		var top = $('#header').height() + 10;
		$('#infobar').css("left", left);
		$('#infobar').css("top", top);
		$('#infobar').fadeIn(500, function(){
			setTimeout(function(){
				$('#infobar').fadeOut(500);
				ttisup = false;
			}, time);
		});
	}
}

/**
 * This will open the empty infobar
 */
function upInfo(){
	if(!warnisup){
		ttisup = true;
		$('#infobar').html("");
		var left = ($(window).width() / 2) - ($('#infobar').width() / 2);
		var top = $('#header').height() + 10;
		$('#infobar').css("left", left);
		$('#infobar').css("top", top);
		$('#infobar').fadeIn(500);
	}
}

/**
 * This will change the information in the infobar.
 * @param txt
 */
function changeInfo(txt){
	if(!warnisup){
		ttisup = true;
		$('#infobar').html(txt);
		var left = ($(window).width() / 2) - ($('#infobar').width() / 2);
		var top = $('#header').height() + 10;
		$('#infobar').css("left", left);
		$('#infobar').css("top", top);
	}
}

/**
 * This will close the infobar
 */
function downInfo(){
	if(!warnisup){
		ttisup = false;
		$('#infobar').fadeOut(500, function(){
			$('#infobar').html("");
		});
	}
}

/**
 * This will show up a red infobar.
 */
function showWarning(text, time){
	warnisup = true;
	$('#infobar').html(text);
	var left = ($(window).width() / 2) - ($('#infobar').width() / 2);
	var top = $('#header').height() + 10;
	$('#infobar').css("left", left);
	$('#infobar').css("top", top);
	$('#infobar').addClass('warnbar');
	$.when(
			$('#infobar').fadeIn(500)
	).then(
			setTimeout(function(){
				$('#infobar').fadeOut(500, function(){
					$('#infobar').removeClass('warnbar');
					warnisup = false;
				});
			}, time)
	);
}