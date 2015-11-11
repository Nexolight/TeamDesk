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

$('#body').ready(function(){
	firstLoad();
});

$('#header').ready(function(){
	$('#header').mousedown(function(event){
		event.preventDefault();
	});
});

/**
 * This will load the first page depending on the session state.
 */
function firstLoad(){
	loginfo("general.js", "firstload", "Let's check if you have already a valid session");
	//Check if an user session exists.
	$.ajax({
        type: "POST",
        url: './dynamic/checkPermission.jsp',
        async: false,
        success: function (data) {
        	if(data == "ok"){
        		loginfo("general.js", "firstload", "You have already a valid session - welcome back!");
        		loadTDSurface();
        	}else if(data == "notok"){
        		loginfo("general.js", "firstload", "No valid session data avaiable - redirect to authentification page");
        		$.ajax({
        	        type: "POST",
        	        url: './dynamic/logon_part.jsp',
        	        async: false,
        	        success: function (data) {
        	        	$('#content').html(data);
        	        },
        	        error: function(data){
        	        	logerror("general.js", "firstload", "Can't reach logon_part.jsp or it throws an error");
        	            handleError(error_unspecified, error_wedontknow);
        	        }
        	    });
        	}
        },
        error: function (data){
        	logerror("general.js", "firstload", "Can't reach checkPermission.jsp or it throws an error");
        	handleError(error_unspecified, error_wedontknow);
        }
    });
}

/**
 * This will shake the input element and marks it for some seconds as red
 * @param myField JQuery Object
 * @param callback
 */
function redShakeFeedback(myField, callback){
	loginfo("general.js", "redShakeFeedback", "Lets blink the given element!");
	if($(myField).attr("data-rs") != "true"){
		var bk_color = $(myField).css("color");
		$(myField).attr("data-rs", "true");
		$(myField).css("color", "#FF0000");
		var fliptime = 200;
		var flipturns = 6;
		var side = false;
		for(var i = 0; i < flipturns; i++){
			setTimeout(function(){
				if(side == false){
					side = true;
					$(myField).fadeOut(fliptime);
				}else{
					side = false;
					$(myField).fadeIn(fliptime);
				}
			}, i * fliptime);
		}
		setTimeout(function(){
			$(myField).attr("data-rs", "false");
			$(myField).css("color", bk_color);
			if(typeof callback == "function"){
				callback();
			}
		}, flipturns * fliptime);
	}
}


/**
 * This will load the Teamdesk Surface depending on the choosen Group
 */
function loadTDSurface(){
	loginfo("general.js", "loadTDSurface", "Try to load surface");
	$.ajax({
        type: "POST",
        url: './dynamic/td_surface_part.jsp',
        async: false,
        success: function (data) {
        	loginfo("general.js", "loadTDSurface", "Got surface data");
        		if($('#content').children().length > 0){
        			$.when($('#content').children().fadeOut(250)).done(function(){
        				loadSurface();
        			});
        		}else{		
        			loadSurface();
        		}
        		
        		function loadSurface(){
        			$('#content').html("");
        			$('#content').html(data);
        			$('#surfaceholder').ready(function(){
        				$('#surfaceholder').fadeIn(250, function(){
        					fixElementheightOnViewport($('#optionHolder'));
        					$('#optionHolder').show();
        				});
        			});
        		}
        },
        error: function(data){
        	logerror("general.js", "loadTDSurface", "Can't reach td_surface_part.jsp or it throws an error");
        	handleError(error_unspecified, error_wedontknow);
        }
    });
}


/**
 * 
 * ancient function. Ride it off when you have enough time<br>
 * it is possible used only once until the auth process<br>
 * <br>
 * This will check a Server answer for error and handles them
 * The server side error messagte should be like error|[header]|[text]
 * @param data
 * @returns {Boolean}
 */
function checkError(data){
	loginfo("general.js", "checkError", "Check for server side error!");
	if(data.match("^error*")){
		var type = data.split("\|")[1];
		var info = data.split("\|")[2];
		logerror("general.js", "checkError", info);
		handleError(type, info);
		return true;
	}else{
		return false;
	}
}


/**
 * This should be mainly used by the checkError function but it can be used otherwise
 * to show specific errors. This is completely dynamic.
 * It needs the informations from the server error message
 * to show them correctly
 * @param type
 * @param info
 */
function handleError(type, info){
	loginfo("general.js", "handleError", "Try to load error overlay");
	if($("#erroroverlay").length > 0){
		logwarning("general.js", "handleError", "Can't show error overlay. Another error overlay is already there.");
	}else{
		$.ajax({
	        type: "POST",
	        url: './dynamic/errorOverlay.jsp',
	        async: false,
	        success: function (html) {
	        	loginfo("general.js", "handleError", "Got overlay - Hide everything and show error message");
	        	$('#content').children().fadeOut(250,afterFadeOut());
	    		function afterFadeOut(){
	    			$('#content').append(html);
	            	$('#erroroverlay_header').html(type);
	            	$('#erroroverlay_content').prepend(info);
	            	fixElementheight($('#erroroverlay'));
	            	$('#erroroverlay').fadeIn(500, errorHeaderBlink($('#erroroverlay_header')));
	            	 
	            	$('#erroroberlay_form').submit(function(event){
	            		event.preventDefault();
	            		$('#erroroverlay').fadeOut(250, function(){
	            			$('#erroroverlay').remove();
	            			$('#content').children().fadeIn(500);
	            		});
	            	});
	    		}
	        },
	        error: function(){
	        	logerror("general.js", "handleError", "Can't load errorOverlay.jsp - The server is offline for sure!");
	        	alert(error_javaserver_unreachable);
	        }
	    });
	}
	
}


/**
 * This will let a div element blink red. It's made for error Headers
 * @param header
 */
function errorHeaderBlink(header){
	loginfo("general.js", "errorHeaderBlink", "Element is flashing red");
	$(header).ready(function(){
		var origin_color = header.css("background-color");
		var origin_rgb = /rgb\((\d+), (\d+), (\d+)\)/.exec(origin_color);
		var r = origin_rgb[1],
		    g = origin_rgb[2],
		    b = origin_rgb[3];
		var red_now = origin_rgb[1];
		blinkUp();
		
		function blinkUp(){
			if(red_now <= 230){
				red_now++;
				$(header).css("background-color", "rgb(" + red_now + "," + origin_rgb[2] + "," + origin_rgb[3] + ")");
				setTimeout(blinkUp, 5);
			}else{
				setTimeout(blinkDown, 5);
			}
		}
		
		function blinkDown(){
			if(red_now >= origin_rgb[1]){
				red_now--;
				$(header).css("background-color", "rgb(" + red_now + "," + origin_rgb[2] + "," + origin_rgb[3] + ")");
				setTimeout(blinkDown, 5);
			}else{
				setTimeout(blinkUp, 5);
			}
		}
	});
}

/**
 * This will fix the position from static div's to the center of the screen.
 * This one will take the full window to calculate the position
 * @param element
 */
function fixElementheight(element){
	loginfo("general.js", "fixElementheight", "Center the given element vertically on the window");
	var height = $(element).height();
	var body_height = $(window).height();
	var calc = (body_height / 2) - (height / 2);
	$(element).css("top", calc);
}

/**
 * This will fix the position from static div's to the center of the screen.
 * This one will take the full window to calculate the position
 * @param element
 */
function fixElementwidth(element){
	loginfo("general.js", "fixElementwidth", "Center the given element horizontally on the window");
	var width = $(element).width();
	var body_width = $(window).width();
	var calc = (body_width / 2) - (width / 2);
	$(element).css("left", calc);
}

/**
 * This will fix the position from static div's to the center of the screen.
 * This one will take the full window without the header to calculate the position
 * @param element
 */
function fixElementheightOnViewport(element){
	loginfo("general.js", "fixElementheightOnViewport", "Center the given element vertically on the the surface");
	var height = $(element).height();
	var body_height = $(window).height();
	var calc = (body_height / 2) - (height / 2);
	calc = calc + ($('#header').height() / 2);
	$(element).css("top", calc);
}

/**
 * This will flash a div depending on the given propreties
 * @param element the div element
 * @param color the flash color as hex -> #000000
 * @param from the minimum size
 * @param to the maximum size
 */
function flashdiv(element, color, from, to){
	loginfo("general.js", "flashdiv", "Make the given element flashing");
	$(element).attr('data-flashdiv', 'on');
	var shadowbackup = $(element).css("box-shadow");
	var size = from;
	var direction = "up";
	(function go(){
		
		if($(element).attr('data-flashdiv') == "on"){
			if(size <= from){
				direction = "up";
			}
			if(size >= to){
				direction = "down";
			}
			if(direction == "up"){
				size+=2;
			}
			if(direction == "down"){
				size-=2;
			}
			$(element).css("box-shadow", "0px 0px " + size + "px " + color);
			setTimeout(go, 32);
		}else{
			$(element).css("box-shadow", shadowbackup);
		}
	})();
}

/**
 * This remove the flash effect from a div where you've used the flashdiv function
 * @param element
 */
function flashdivStop(element){
	loginfo("general.js", "flashdiv", "Disable flashing effect on the given element");
	$(element).attr('data-flashdiv', 'off');
}


/**
 * This will make an element resizable if the user clicks on a given trigger.
 * Warning this needs actual mouseX and mouseY coordinates outside this function!
 * @param r_element
 * @param r_trigger
 */
function makeResizable(r_element, r_trigger){
	loginfo("general.js", "makeResizable", "Make the given element resizable");
	$(r_trigger).mousedown(function(event){
		event.preventDefault();
	});
	$(r_trigger).ready(function(){
		var mousedown = false;
		var startX = 0;
		var startY = 0;
		var oldW = 0;
		var oldH = 0;
		r_trigger.mousedown(function(event){
			mousedown = true;
			startX = mouseX;
			startY = mouseY;
			oldW = $(r_element).width();
			oldH = $(r_element).height();
			fallowMouse();
			function fallowMouse(){
				var diffX = mouseX - startX;
				var diffY = mouseY - startY;
					if(diffX != 0){
						$(r_element).css("width", (oldW + diffX) + "px");
						oldW = $(r_element).width();
						startX = mouseX;
					}
					if(diffY != 0){
						$(r_element).css("height", (oldH + diffY) + "px");
						oldH = $(r_element).height();
						startY = mouseY;
					}
					
				if(mousedown == true){
					setTimeout(fallowMouse,32);
				}
			}
		});
		$(window).mouseup(function(){
			mousedown = false;
		});
	});
}

/**
 * This makes an element movable in the surface while clicking the given trigger.
 * Warning this needs actual mouseX_onSF and mouseY_onSF coordinates outside this function!
 * @param m_trigger The area where the element can be hold.
 * @param m_element The element to move while holding the cursor pressed on the trigger.
 * @param m_parent The parent element where the movable element can be moved in.
 */
function makeMovable(m_trigger, m_element, m_parent){
	loginfo("general.js", "makeMovable", "Make the given element movable");
	$(m_trigger).ready(function(){
		var mouseX_onSF;
		var mouseY_onSF;
		var parent_width = m_parent.width();
		var parent_height = m_parent.height();
		$(m_parent).ready(function(){
			$(m_parent).mousemove(function(event){
				var tmp_mouseX_onSF = Math.round(event.pageX - $(m_parent).offset().left);
				var tmp_mouseY_onSF = Math.round(event.pageY - $(m_parent).offset().top);
				if((tmp_mouseX_onSF <= 0 || tmp_mouseX_onSF >= parent_width) == false && (tmp_mouseY_onSF <= 0 || tmp_mouseY_onSF >= parent_height) == false){
					mouseX_onSF = tmp_mouseX_onSF;
					mouseY_onSF = tmp_mouseY_onSF;
				}
			});
		});
		var mousedown = false;
		var originTop = 0;
		var originLeft = 0;
		var mStartX = 0;
		var mStartY = 0;
		m_trigger.mousedown(function(){
			parent_width = m_parent.width();
			parent_height = m_parent.height();
			mousedown = true;
			originTop = parseInt($(m_element).css("top"));
			originLeft = parseInt($(m_element).css("left"));
			mStartX = mouseX_onSF;
			mStartY = mouseY_onSF;
			fallowMouse();
			function fallowMouse(){
				var diffX = mouseX_onSF - mStartX;
				var diffY = mouseY_onSF - mStartY;
				if(diffX != 0){
					$(m_element).css("left", (originLeft + diffX) + "px");
					originLeft = parseInt($(m_element).css("left"));
					mStartX = mouseX_onSF;
				}
				if(diffY != 0){
					$(m_element).css("top", (originTop + diffY) + "px");
					originTop = parseInt($(m_element).css("top"));
					mStartY = mouseY_onSF;
				}
				if(mousedown == true){
					setTimeout(fallowMouse, 16);
				}
			}
		});
		$(m_trigger).mouseup(function(){
			mousedown = false;
		});
	});
}

/**
 * This moves an element from a to b
 * @param target_element The element you want to move
 * @param oldX The old X position as int
 * @param oldY The old Y position as int
 * @param newX The new X position as int
 * @param newY The new Y position as int
 * @param fps Frames per second as int
 * @param pjpf Pixel jump per frame as int
 */
function automoveElement(target_element, oldX, oldY, newX, newY, fps, pjpf){
	loginfo("general.js", "automoveElement", "Automatically move the given element");
	var timeout = 1000 / fps;
	var stepsLeft = 0;
	var stepsTop = 0;
	var stepsRight = 0;
	var stepsBottom = 0;
	
	if(oldX < newX){
		var diff = newX - oldX;
		stepsRight = Math.round(diff / pjpf);
	}
	
	if(oldY < newY){
		var diff = newY - oldY;
		stepsBottom = Math.round(diff / pjpf);
	}
	
	if(oldX > newX){
		var diff = oldX - newX;
		stepsLeft = Math.round(diff / pjpf);
	}
	
	if(oldY > newY){
		var diff = oldY - newY;
		stepsTop = Math.round(diff / pjpf);
	}
	
	! function loop(){
		
		if(stepsRight != 0){
			var update = $(target_element)[0].offsetLeft + pjpf;
			$(target_element).css("left", update + "px");
			stepsRight--;
		}
		
		if(stepsBottom != 0){
			var update = $(target_element)[0].offsetTop + pjpf;
			$(target_element).css("top", update + "px");
			stepsBottom--;
		}
		
		if(stepsLeft != 0){
			var update = $(target_element)[0].offsetLeft - pjpf;
			$(target_element).css("left", update + "px");
			stepsLeft--;
		}
		
		if(stepsTop != 0){
			var update = $(target_element)[0].offsetTop - pjpf;
			$(target_element).css("top", update + "px");
			stepsTop--;
		}
		
		if((stepsRight + stepsBottom + stepsLeft + stepsTop) != 0){
			setTimeout(loop, timeout)
		}
	}();
}

/**
 * This will create a nearly unique string.
 * Source: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */
function getUnique(){
	loginfo("general.js", "getUnique", "Get an unique identifier");
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};


/**
 * This will check the extension of a file if its from the correct type.
 * Returns "image", "document", "multimedia", "archive" or "unknown".
 * @param filename or filetype.
 */
function checkExtenssionType(filename){
	
	loginfo("general.js", "checkExtenssionType", "Check type of file " + filename + " depending on it's extension");
	
	var ext = filename.split('.').pop();
	var t_image =		new RegExp("^ase$|^art$|^bmp$|^blp$|^cd5$|^cit$|^cpt$|^cr2$|^cut$|^dds$|^dib$|^djvu$|^egt$|^exif$|^gif$|^gpl$|^grf$|" +
									"^icns$|^ico$|^iff$|^jng$|^jpeg$|^jpg$|^jp2$|^jps$|^lbm$|^max$|^miff$|^mng$|^msp$|^nitf$|^ota$|^pbm$|" +
									"^pc1$|^pc2$|^pc3$|^pcf$|^pcx$|^pdn$|^pgm$|^pi1$|^pi2$|^pi3$|^pict$|^png$|^pnm$|^pns$|^ppm$|^psb$|" +
									"^psd$|^pdd$|^psp$|^px$|^pxm$|^pxr$|^qfx$|^rle$|^sct$|^sgi$|^rgb$|^int$|^bw$|^tga$|^targa$|^icb$|^vda$|" +
									"^vst$|^pix$|^tif$|^tiff$|^vtf$|^xmb$|^xcf$|^xpm$|^mng$", "i");
	var t_document =	new RegExp("^gslides$|^Key$|^keynote$|^nb$|^nbp$|^odp$|^otp$|^pez$|^pot$|^pps$|^ppt$|^pptx$|^prz$|^ssd$|^shf$|" +
									"^show$|^shw$|^slp$|^sspss$|^sti$|^sxi$|^thmx$|^watch$|" +
									"^602$|^awb$|^acl$|^afp$|^ami$|^ans$|^asc$|^aww$|^ccf$|^csv$|^cwk$|^dbk$|^doc$|^docm$|^docx$|^dot$|^dotx$|" +
									"^egt$|^epub$|^ezw$|^fdx$|^ftm$|^ftx$|^gdoc$|^html$|^hwp$|^hwpml$|^log$|^lwp$|^mbp$|^md$|^mcw$|^mobi$|^nb$|" +
									"^nbp$|^odm$|^odt$|^ott$|^omm$|^pages$|^pap$|^pdax$|^pdf$|^rtf$|^quox$|^rpt$|^sdw$|^se$|^stw$|^sxw$|^tex$|^info$|" +
									"^troff$|^txt$|^uof$|^uoml$|^via$|^wpd$|^wps$|^wpt$|^wrd$|^wrf$|^wri$|^xhtml$|^xml$|^xps$|^css$" +
									"", "i");
	var t_media =		new RegExp("^aaf$|^3gp$|^asf$|^avchd$|^avi$|^flv$|^m1v$|^m2v$|^fla$|^m4v$|^mkv$|^wrap$|^mov$|^mpeg$|^mpg$|^mpe$|" +
									"^mp4$|^mxf$|^roq$|^nsv$|^ogg$|^rm$|^svi$|^swf$|^wmv$|^3g2$|^vob$|" +
									"^iff$|^aiff$|^au$|^bwf$|^cdda$|^wav$|^flac$|^la$|^pac$|^m4a$|^ape$|^ofr$|^ofs$|^off$|^rka$|^shn$|^tta$|^wv$|" +
									"^wma$|^brstm$|^ast$|^amr$|^mp2$|^mp3$|^spx$|^gsm$|^aac$|^m4p$|^mpc$|^vqf$|^ra$|^ots$|^swa$|^vox$|^voc$|^dwd$|" +
									"^smp$|^acc$|^bik$", "i");
	var t_archiv =		new RegExp("^4db$|^4dd$|^4dindy$|^4dindx$|^4dr$|^accdb$|^accde$|^adt$|^apr$|^box$|^chml$|^daf$|^dat$|^db$|^dbf$|^egt$|" +
									"^ess$|^eap$|^fdb$|^fp$|^fp3$|^fp5$|^fp7$|^frm$|^gdb$|^gtable$|^kexi$|^kexic$|^kexis$|^ldb$|^mda$|^mdb$|^adp$|" +
									"^mde$|^mdf$|^myd$|^myi$|^ncf$|^nsf$|^ntf$|^nv2$|^odb$|^ora$|^pdb$|^pdi$|^pdx$|^prc$|^sql$|^rec$|^rel$|^rin$|^sdb$|" +
									"^sdf$|^udl$|^wadata$|^waindx$|^wamodel$|^wajournal$|^wdb$|^wmdb$|" +
									"^7z$|^ace$|^alz$|^arc$|^arj$|^bz2$|^cpt$|^sea$|^daa$|^dmg$|^egg$|^ecab$|^ezip$|^ess$|^gho$|^ghs$|^gz$|^lqr$|" +
									"^lha$|^lzip$|^lzo$|^lzma$|^lzx$|^mbw$|^pak$|^par$|^par2$|^rar$|^skb$|^tar$|^tgz$|^tib$|^uha$|^wax$|^xz$|" +
									"^z$|^zoo$|^zip$|^iso$|^nrg$|^img$|^adf$|^dsk$|^d64$|^sdi$|^mds$|^mdx$|^dmg$|^isz$|^cdi$|^cue$|^cif$|^c2d$|" +
									"^daa$|^ccd$|^sub$|^img$|^b6t$", "i");
	if(ext.match(t_image)){
		loginfo("general.js", "checkExtenssionType", "The file " + filename + " is an image");
		return "image";
	}
	
	if(ext.match(t_document)){
		loginfo("general.js", "checkExtenssionType", "The file " + filename + " is a document");
		return "document";
	}
	
	if(ext.match(t_media)){
		loginfo("general.js", "checkExtenssionType", "The file " + filename + " is multimedia");
		return "multimedia";
	}
	
	if(ext.match(t_archiv)){
		loginfo("general.js", "checkExtenssionType", "The file " + filename + " is an archiv");
		return "archiv";
	}
	logwarning("general.js", "checkExtenssionType", "The file " + filename + " has an unknonwn extension");
	return "unknown";
}

/**
 * This will resize a div fluidly
 * @param target_element JQuery element
 * @param destination Int[width,height] 
 * @param fps Int Frames per second
 * @param spf Int Steps per frame
 * @param callback
 * @param multicallback
 */
function fluidResize(target_element, destination, fps, spf, callback, multicallback){
	loginfo("general.js", "fluidResize", "Fluid resize the given element");
	var timeout = 1000 / fps;
	var actW = $(target_element).width();
	var actH = $(target_element).height();
	var directionW = "";
	var directionH = "";
	(function go(){
		if(actW > destination[0]){
			actW -= spf;
			$(target_element).width(actW);
			if(directionW == "plus" && spf > 1){ //reduce spf to solve
				spf--;
			}
			directionW = "minus";
		}
		if(actW < destination[0]){
			actW += spf;
			$(target_element).width(actW);
			if(directionW == "minus" && spf > 1){ //reduce spf to solve
				spf--;
			}
			directionW = "plus";
		}
		if(actH > destination[1]){
			actH -= spf;
			$(target_element).height(actH);
			if(directionH == "plus" && spf > 1){ //reduce spf to solve
				spf--;
			}
			directionH = "minus";
		}
		
		if(actH < destination[1]){
			actH += spf;
			$(target_element).height(actH);
			if(directionH == "minus" && spf > 1){ //reduce spf to solve
				spf--;
			}
			directionH = "plus";
		}
		
		if(actW != destination[0] || actH != destination[1]){
			if(typeof multicallback == "function"){
				multicallback();
			}
			setTimeout(go,timeout);
		}else{
			if(typeof callback == "function"){
				callback();
			}
		}
		
	})();
}

/**
 * This will check if the given extenssion is supported by browsers.
 * @param filename The name of the file. Only the ending is important
 * @param e_type The expected file type. Use "image", or "video"
 * @returns {Boolean} True if supported
 */
function checkExtenssionSupport(filename, e_type){
	loginfo("general.js", "checkExtenssionSupport", "Check if the file " + filename + " is browser compatible by it's extension");
	var ext = filename.split('.').pop();
	switch(e_type){
	case "image":
		if(ext.match(new RegExp("png|jpg|jpeg|gif|tiff|tif|bmp","i"))){
			loginfo("general.js", "checkExtenssionSupport", "The file " + filename + " is browser compatible and from the type: " + ext);
			return true;
		}
		break;
	case "video":
		if(ext.match(new RegExp("flv|webm|mp4|ogg|ogv","i"))){
			loginfo("general.js", "checkExtenssionSupport", "The file " + filename + " is browser compatible and from the type: " + ext);
			return true;
		}
		break;
	}
	logwarning("general.js", "checkExtenssionSupport", "The file " + filename + " with the extension " + ext + " isn't browser compatible.");
	return false;
}

/**
 * This will get the users IP
 */
function getUserIP(){
	loginfo("general.js", "getUserIP", "Try to get the user's IP address");
	var ret;
	$.ajax({
        type: "POST",
        url: './dynamic/getUserIp.jsp',
        async: false,
        data: {},
        success: function (data) {
        	loginfo("general.js", "getUserIP", "Got user IP: " + data);
        	ret = data;
        },
        error: function(data){
        	logerror("general.js", "getUserIP", "Can't reach getUserIp.jsp or it throws an error");
            handleError(error_unspecified, error_wedontknow);
        }
    });
	return ret;
}    

/**
 * This will get the current server time in datetime format
 * @param callback
 */
function getServerTime(callback){
	loginfo("general.js", "getServerTime", "Try to get the server time");
	var ret;
	$.ajax({
        type: "POST",
        url: './dynamic/getCurrentDatetime.jsp',
        async: false,
        data: {},
        success: function (data) {
        	loginfo("general.js", "getServerTime", "Got server time: " + data);
        	ret = data;
        },
        error: function(data){
        	loginfo("general.js", "getServerTime", "Can't reach getCurrentDatetime.jsp or it throws an error");
            handleError(error_unspecified, error_wedontknow);
        }
    });
	return ret;
}


/**
 * This will return a KByte value depending on the given bytes. The return value is rounded to 2 digits after comma.
 * @param i_bytes a amount of bytes
 */
function byteToKByte(i_bytes){
	loginfo("general.js", "byteToKByte", "Convert and round from bytes to kilobytes");
	var result = (i_bytes / 1024);
	result = result.toFixed(2);
	return result;
}


/**
 * This will return a MByte value depending on the given bytes. The return value is rounded to 2 digits after comma.
 * @param i_bytes a amount of bytes
 */
function byteToMByte(i_bytes){
	loginfo("general.js", "byteToMByte", "Convert and round from bytes to megabytes");
	var result = ((i_bytes / 1024) / 1024);
	result = result.toFixed(2);
	return result;
}

/**
 * This will return a GByte value depending on the given bytes. The return value is rounded to 2 digits after comma.
 * @param i_bytes a amount of bytes
 */
function byteToGByte(i_bytes){
	loginfo("general.js", "byteToGByte", "Convert and round from bytes to gigabytes");
	var result = (((i_bytes / 1024) / 1024) / 1024);
	result = result.toFixed(2);
	return result;
}

/**
 * This will return a TByte value depending on the given bytes. The return value is rounded to 2 digits after comma.
 * @param i_bytes a amount of bytes
 */
function byteToTByte(i_bytes){
	loginfo("general.js", "byteToTByte", "Convert and round from bytes to terabytes");
	var result = ((((i_bytes / 1024) / 1024) / 1024) / 1024);
	result = result.toFixed(2);
	return result;
}

/**
 * This will remove a file from the upload directory. Theres no feedback, because this should be run in the background
 * @param filename The Name of the File.
 */
function deleteFile(filename){
	loginfo("general.js", "deleteFile", "Try to remove file " + filename + " from host");
	$.ajax({
        type: "POST",
        url: "./removefile",
        data: {filename:filename},
        success: function () {
        	loginfo("general.js", "deleteFile", "Removed file " + filename + " from host");
        },
        error:		function(){
        	logerror("general.js", "deleteFile", "Can't reach servlet ./removefile or it throws an error");
        }
	});
}

/**
 * This will resolve the 1366x768 format to int[1366,768]
 * @param sizeXY a size in nxn format
 */
function resolveXYSize(sizeXY){
	var xy = sizeXY.split("x");
	var ret = [parseInt(xy[0]),parseInt(xy[1])];
	loginfo("general.js", "resolveXYSize", "Resolve given size("+sizeXY+") to " + " X=" + ret[0] + " Y=" + ret[1]);
	return ret;
}

/**
 * This writes a error line in the console log.
 * @param e_file The File where the error occured
 * @param e_function the function where the error occured
 * @param e_text the text to write into the console
 */
function logerror(e_file, e_function, e_text){
	var prefix 	= "[ERROR]";
	var sub00 	= " from File ";
	var sub01	= "["+e_file+"]";
	var sub02	= logfillup(50, prefix + sub00 + sub01);
	var sub03	= " in function ";
	var sub04	= "["+e_function+"]";
	var sub05	= logfillup(120, prefix + sub00 + sub01 + sub02 + sub03 + sub04);
	var sub06	= e_text;
	
	console.log("%c" + prefix + "%c" + sub00 + "%c" + sub01 + "%c" + sub02 + sub03 + "%c" + sub04 + "%c" + sub05 + sub06, 
				"color: #7a0000; font-weight: bold; background-color: #ffdede;", 	//Prefix
				"color: #000000; font-weight: normal; background-color: #ffdede;", 	//Text
				"color: #2d5285; font-weight: bold; background-color: #ffdede;", 	//File
				"color: #000000; font-weight: normal; background-color: #ffdede;", 	//Text
				"color: #2d5285; font-weight: bold; background-color: #ffdede;",	//Function
				"color: #000000; font-weight: normal; background-color: #FFFFFF;"	//Description
	); 
}

/**
 * This writes a info in the console log.
 * @param i_file The file where the info comes from
 * @param i_function The function where the info comes from
 * @param i_text The info text.
 */
function loginfo(i_file, i_function, i_text){
	var prefix 	= "[INFO]";
	var sub00 	= " from File ";
	var sub01	= "["+i_file+"]";
	var sub02	= logfillup(50, prefix + sub00 + sub01);
	var sub03	= " in function ";
	var sub04	= "["+i_function+"]";
	var sub05	= logfillup(120, prefix + sub00 + sub01 + sub02 + sub03 + sub04);
	var sub06	= i_text;
	
	console.log("%c" + prefix + "%c" + sub00 + "%c" + sub01 + "%c" + sub02 + sub03 + "%c" + sub04 + "%c" + sub05 + sub06, 
				"color: #006600; font-weight: bold; background-color: #e3efe7;", 	//Prefix
				"color: #000000; font-weight: normal; background-color: #e3efe7;", 	//Text
				"color: #2d5285; font-weight: bold; background-color: #e3efe7;", 	//File
				"color: #000000; font-weight: normal; background-color: #e3efe7;", 	//Text
				"color: #2d5285; font-weight: bold; background-color: #e3efe7;",	//Function
				"color: #000000; font-weight: normal; background-color: #FFFFFF;"	//Description
	); 
}

/**
 * This writes a warning in the console log.
 * @param w_file The File where the warning comes from
 * @param w_function The function where the warning comes from
 * @param w_text The warning text.
 */
function logwarning(w_file, w_function, w_text){
	var prefix 	= "[WARNING]";
	var sub00 	= " from File ";
	var sub01	= "["+w_file+"]";
	var sub02	= logfillup(50, prefix + sub00 + sub01);
	var sub03	= " in function ";
	var sub04	= "["+w_function+"]";
	var sub05	= logfillup(120, prefix + sub00 + sub01 + sub02 + sub03 + sub04);
	var sub06	= w_text;
	
	console.log("%c" + prefix + "%c" + sub00 + "%c" + sub01 + "%c" + sub02 + sub03 + "%c" + sub04 + "%c" + sub05 + sub06, 
				"color: #924806; font-weight: bold; background-color: #ebe588;", 	//Prefix
				"color: #000000; font-weight: normal; background-color: #ebe588;", 	//Text
				"color: #2d5285; font-weight: bold; background-color: #ebe588;", 	//File
				"color: #000000; font-weight: normal; background-color: #ebe588;", 	//Text
				"color: #2d5285; font-weight: bold; background-color: #ebe588;",	//Function
				"color: #000000; font-weight: normal; background-color: #FFFFFF;"	//Description
	); 
}

/**
 * This fills empty space into a string until it matches the maxChars value
 * @param maxChars
 * @param textBefore
 */
function logfillup(maxChars, textBefore){
	var size_now = textBefore.length;
	var fill = "";
	for(var i = size_now; i < maxChars; i++){
		fill += " ";
	}
	return fill;
}


/**
 * Kills the user session and redict him to the start page
 */
function destroySession(){
	loginfo("general.js", "destroySession", "Try to kill user session");
	$.when($('#content').children().fadeOut(250)).done(function(){
		$.ajax({
	        type: "POST",
	        url: './dynamic/destroySession.jsp',
	        async: false,
	        data: {},
	        success: function () {
	        	loginfo("general.js", "destroySession", "Killed user session");
	        	location.reload();
	        },
	        error: function(){
	        	logerror("general.js", "destroySession", "Can't reach destroySession.jsp or it throws an error");
	        	handleError(error_unspecified, error_wedontknow);
	        }
	    });
	});
}


/**
 * reload the page as example when the connection abrupts.
 */
function reloadPage(){
	loginfo("general.js", "reloadPage", "Reload page");
	location.reload();
}

/**
 * This turns a default Timestamp (yyyy-MM-dd HH:mm:ss) into dd.MM.yyyy HH:mm:ss
 * @param timestamp yyyy-MM-dd HH:mm:ss
 */
function timestampToRegular(timestampdate){
	loginfo("general.js", "timestampToRegular", "Convert timestamp format (yyyy-MM-dd HH:mm:ss) into dd.MM.yyyy HH:mm:ss format");
	var splitdatetime = timestampdate.split(" ");
	var splitdate = splitdatetime[0].split("-");
	var splittime = splitdatetime[1].split(":");
	return prependZeros(splitdate[2],2) + "." + prependZeros(splitdate[1],2) + "." + prependZeros(splitdate[0],4) + " " + prependZeros(splittime[0],2) + ":" + prependZeros(splittime[1],2) + ":" + prependZeros(splittime[2],2);
}

/**
 * This turns a regular date and time (dd.MM.yyyy HH:mm:ss) into the default Timestamp format yyyy-MM-dd HH:mm:ss
 * @param regular dd.MM.yyyy HH:mm:ss
 */
function regularToTimestamp(regular){
	loginfo("general.js", "regularToTimestamp", "Convert regular time and date format (dd.MM.yyyy HH:mm:ss) into the default timestamp format yyyy-MM-dd HH:mm:ss format");
	var splitdatetime = regular.split(" ");
	var splitdate = splitdatetime[0].split(".");
	var splittime = splitdatetime[1].split(":");
	return prependZeros(splitdate[2],4) + "-" + prependZeros(splitdate[1],2) + "-" + prependZeros(splitdate[0],2) + " " + prependZeros(splittime[0],2) + ":" + prependZeros(splittime[1],2) + ":" + prependZeros(splittime[2],2);
}

/**
 * This returns the current date and time in a userfriendly fromat (dd.MM.yyyy HH:mm:ss)
 */
function getNowRegular(){
	loginfo("general.js", "getNowRegular", "Get the current client date and time in regular format dd.MM.yyyy HH:mm:ss");
	var mydate = new Date();
	return prependZeros(mydate.getDate(),2) + "." + prependZeros(mydate.getMonth()+1,2) + "." + prependZeros(mydate.getFullYear(),4) + " " + prependZeros(mydate.getHours(),2) + ":" + prependZeros(mydate.getMinutes(),2) + ":" + prependZeros(mydate.getSeconds(),2);
}

/**
 * This returns the current date and time in the default timestamp format (yyyy-MM-dd HH:mm:ss)
 */
function getClientTime(){
	loginfo("general.js", "getClientTime", "Get the current client date and time in default timestamp format yyyy-MM-dd HH:mm:ss");
	var mydate = new Date();
	return prependZeros(mydate.getFullYear(),4) + "-" + prependZeros(mydate.getMonth()+1,2) + "-" + prependZeros(mydate.getDate(),2) + " " + prependZeros(mydate.getHours(),2) + ":" + prependZeros(mydate.getMinutes(),2) + ":" + prependZeros(mydate.getSeconds(),2);
}

/**
 * This returns the time in ms from a default timestamp in format yyyy-MM-dd HH:mm:ss
 * @param timestamp
 */
function getTimeFromTimestamp(timestamp){
	loginfo("general.js", "getTimeFromTimestamp", "Get the milliseconds from timestamp: " + timestamp);
	if(timestamp != ""){
		var splitdatetime = timestamp.split(" ");
		var splitdate = splitdatetime[0].split("-");
		var splittime = splitdatetime[1].split(":");
		var years = parseInt(prependZeros(splitdate[0],4));
		var months = parseInt(prependZeros(splitdate[1],2));
		var days = parseInt(prependZeros(splitdate[2],2));
		var hours = parseInt(prependZeros(splittime[0],2));
		var minutes = parseInt(prependZeros(splittime[1],2));
		var seconds = parseInt(prependZeros(splittime[2],2));
		var mydate = new Date(years,months,days,hours,minutes,seconds);
		loginfo("general.js", "getTimeFromTimestamp", "The timestamp: " + timestamp + " consists of " + mydate.getTime() + "ms");
		return mydate.getTime();
	}else{
		logwarning("general.js", "getTimeFromTimestamp", "Timestamp isn't given");
		return null;
	}
}

/**
 * This returns a regular date from a timestamp yyyy-MM-dd HH:mm:ss like dd.mm.yyyy
 * @param timestamp
 */
function getDatefromTimestamp(timestamp){
	loginfo("general.js", "getDatefromTimestamp", "Get a regular date (dd.mm.yyyy) from the default timestamp format yyyy-MM-dd HH:mm:ss");
	if(timestamp != ""){
		var splitdatetime = timestamp.split(" ");
		var splitdate = splitdatetime[0].split("-");
		var years = prependZeros(splitdate[0],4);
		var months = prependZeros(splitdate[1],2);
		var days = prependZeros(splitdate[2],2);
		return days+"."+months+"."+years;
	}else{
		logwarning("general.js", "getDatefromTimestamp", "Timestamp isn't given");
		return timestamp;
	}
}

/**
 * Returns Hour's and Minutes from a timestamp yyyy-MM-dd HH:mm:ss like HH:mm
 * @param timestamp
 */
function getHMfromTimestamp(timestamp){
	loginfo("general.js", "getHMfromTimestamp", "Get a hours and minutes (HH:mm) from the default timestamp format yyyy-MM-dd HH:mm:ss");
	if(timestamp != ""){
		var splitdatetime = timestamp.split(" ");
		var splittime = splitdatetime[1].split(":");
		var hours = prependZeros(splittime[0],2);
		var minutes = prependZeros(splittime[1],2);
		return hours+":"+minutes;
	}else{
		logwarning("general.js", "getHMfromTimestamp", "Timestamp isn't given");
		return timestamp;
	}
}

/**
 * This adds '0' to a String until it's lenght matches the given one.
 * If the input is longer than the given value it will do nothing
 * @param input Your value
 * @param finalLength The lenght of the output value
 */
function prependZeros(input, finalLength){
	var add = "";
	var output = input.toString();
	while((add + output).length < finalLength){
		add = "0" + add;
	}
	output = add + output;
	return output;
}

/**
 * This adds a pseudo text inside a textarea or inputfield which disappears if the user sets the focus to it
 * @param targetfield the target field
 * @param placebotext the placebo text
 * @param submitelement the trigger which will start processing the fields. onmousedown this will remove any value if it's stil the same
 */
function placeboValue(targetfield, placebotext, submitelement){
	loginfo("general.js", "placeboValue", "Add the placebo value '" + placebotext + "' to the given element");
	
	function getVal(){
		if($(targetfield).is("textarea")){
			return $(targetfield).val();
		}
		if($(targetfield).is("input")){
			return $(targetfield).val();
		}
		if($(targetfield).is("div")){
			return $(targetfield).html();
		}
	}
	
	function setVal(value){
		if($(targetfield).is("textarea")){
			$(targetfield).val(value);
		}
		if($(targetfield).is("input")){
			$(targetfield).val(value);
		}
		if($(targetfield).is("div")){
			$(targetfield).html(value);
		}
	}
	
	
	
	var origincss = $(targetfield).css("font-style");
	if(getVal() == ""){
		setVal(placebotext);
		$(targetfield).css("font-style","italic");
	}
	
	$(targetfield).focus(function(){
		if(getVal() == placebotext){
			loginfo("general.js", "placeboValue", "Element with placebo text '" + placebotext + "' has been focused - make it empty");
			setVal("");
			$(targetfield).css("font-style", origincss);
		}
	});
	$(targetfield).blur(function(){
		if(getVal() == ""){
			loginfo("general.js", "placeboValue", "Element with placebo text '" + placebotext + "' has lost focus - restore placebo text");
			setVal(placebotext);
			$(targetfield).css("font-style","italic");
		}
	});
	$(submitelement).mousedown(function(){
		if(getVal() == placebotext){
			loginfo("general.js", "placeboValue", "Element with placebo text '" + placebotext + "' has been clicked - make it empty");
			setVal("");
			$(targetfield).css("font-style", origincss);
		}
	});
	$(targetfield).change(function(){
		if(getVal().length > 0){
			$(targetfield).css("font-style", origincss);
		}else{
			setVal(placebotext);
			$(targetfield).css("font-style","italic");
		}
	});
}

/**
 * This escapes all html based Tags to show them in div as Plaintext and also save them in data attributes
 * @param html
 */
function escapeHTML(html){
	var toescape = {
		    "&": "&amp;",
		    "<": "&lt;",
		    ">": "&gt;",
		    '"': '&quot;',
		    "'": '&#39;',
		    "/": '&#x2F;'
		  };
	
	var escapedHTML = String(html).replace(/[&<>"'\/]/g, function (s) {
	      return toescape[s];
	});
	
	return escapedHTML;
}

/**
 * Get the origin value from escapeHTML back
 * @param escapedhtml
 */
function unescapeHTML(escapedhtml){
	var tounescape = {
	    	"&amp;": "&",
		    "&lt;": "<",
		    "&gt;": ">",
		    '&quot;': '"',
		    '&#39;': "'",
		    '&#x2F;': "/"
		  };
	
	var html = String(escapedhtml).replace(/[&<>"'\/]/g, function (s) {
	      return tounescape[s];
	});
	
	return html;
}

/**
 * This will resize the given element depending on the users screen and the given percentage
 * @param target
 * @param percentageOfDisplay
 * @param maxwidth
 */
function dynamicResize(target, percentageOfDisplay, maxwidth){
	loginfo("general.js", "dynamicResize", "Resized element");
	
	var aX = $(window).width();
	var aY = $(window).height();
	
	var dX = Math.round(aX / 100 * percentageOfDisplay);
	var dY = Math.round(aY / 100 * percentageOfDisplay);
	
	if(dX > maxwidth){
		dX = maxwidth;
	}
	if(dY > (maxwidth * 0.5625)){ //Bigger than the height of the 16:9 aspect ratio of the maxwidth
		dY = Math.round(maxwidth * 0.5625);
	}
	
	$(target).width(dX);
	$(target).height(dY);
}

/**
 * This returns a rgb(r,g,b) string with a outgrayed value from the given rgb(r,g,b) or #000000 Hex value
 * @param originrgb
 * @param dividefactor
 * @returns
 */
function grayout(originrgb, dividefactor){
	var rgb = "";
	if(originrgb.match("^rgb")){
		rgb = originrgb.substring(4, originrgb.length -1).replace(/ /g, "").split(",");
	}
	if(originrgb.match("^#")){
		var tmprgb = originrgb.substring(1, originrgb.length);
		var red = parseInt(tmprgb.substring(0, 2),16);
		var green = parseInt(tmprgb.substring(2, 4),16);
		var blue = parseInt(tmprgb.substring(4, 6),16);
		rgb = [red, green, blue];
	}
	var grayscaled = Math.round((parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / dividefactor);
	loginfo("general.js", "grayout", "Grayed out color: " + originrgb + " to: " + "rgb("+grayscaled+","+grayscaled+","+grayscaled+"). Used devide factor:" + dividefactor + ".");
	return "rgb("+grayscaled+","+grayscaled+","+grayscaled+")";
}


/**
 * Checks if something is a id. That means a number >= 1
 * isNaN doesn't work as it should
 * @param value some value
 */
function isID(value){
	if(parseInt(value) > 0){
		return true;
	}else{
		return false;
	}
}