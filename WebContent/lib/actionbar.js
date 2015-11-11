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
$('#optionHolder').ready(function(){
	var mouseover_1 = false;
	var mouseover_2 = false;
	var origin_right= parseInt($('#optionHolder').css("right").replace("px", ""));
	var current_right = origin_right;
	var dest_right = 0;
	var intervall = (origin_right * -1) / 10;
	loginfo("surface.js", "enableActionbar", "Enable Actionbar");
	enableActionbar();
	
	$('#optionHolder').mousedown(function(event){
		event.preventDefault();
	});
	
	/**
	 * Read the JQuery documentation
	 */
	$(window).resize(function(){
		fixElementheightOnViewport($('#optionHolder'));
	});
	
	/**
	 * Read the JQuery documentation
	 */
	$('#optionHolder_slider').mouseover(function(){
		mouseover_1 = true;
	});
	
	/**
	 * Read the JQuery documentation
	 */
	$('#optionHolder_slider').mouseleave(function(){
		mouseover_1 = false;
	});
	
	/**
	 * Read the JQuery documentation
	 */
	$('#optionHolder_options').mouseover(function(){
		mouseover_2 = true;
	});
	
	/**
	 * Read the JQuery documentation
	 */
	$('#optionHolder_options').mouseleave(function(){
		mouseover_2 = false;
	});
	
	/**
	 * Listen to mouseover events and shows the actionbar if there is a mouseover event
	 */
	function enableActionbar(){
		if(mouseover_1 == true || mouseover_2 == true){
			up();
		}else{
			down();
		}
		function up(){
			if(current_right < dest_right){
				current_right = current_right + intervall;
				$('#optionHolder').css("right", current_right + "px");
			}
		}
		
		function down(){
			if(current_right > origin_right){
				current_right = current_right - intervall;
				$('#optionHolder').css("right", current_right + "px");
			}
		}
		setTimeout(enableActionbar, 16);
	}
	
	/**
	 * Read the JQuery documentation
	 */
	$('#option_icon_write').mouseover(function(){
		showTT(this, actionbar_write);
	});
	
	/**
	 * This will load an overlay to create a new note on the pinnwall
	 */
	$('#option_icon_write').click(function(){
		if($('#createNoteOverlay').length == 0){
			loginfo("actionbar.js", "$('#option_icon_write').click(function()...", "Try to load editor overlay");
			$.ajax({
		        type: "POST",
		        data: {mode: "new"},
		        url: './dynamic/createNoteOverlay.jsp',
		        async: false,
		        success: function (html) {
		        	$('#surface').append(html);
		        	loginfo("actionbar.js", "$('#option_icon_write').click(function()...", "Editor loaded!");
		        	//Now move the new note to the users viewport. Thats because its a new note which doesn't have any position in advance
		        	//This should only be executed when the user creates a new note. Not by edit one.
		        	$('#createNoteOverlay').ready(function(){
			        	var dispX = Math.round($(window).width());
			        	var dispY = Math.round($(window).height());
			        	var px_left = Math.round((dispX / 2) - ($('#createNoteOverlay').width() / 2));
			        	var px_top = Math.round((dispY / 2) - ($('#createNoteOverlay').height() / 2) + ($('#header').height() / 2));
			        	$('#createNoteOverlay').offset({ top: px_top, left: px_left});
		        	});
		        },
		        error: function(){
		        	logerror("actionbar.js", "$('#option_icon_write').click(function()...", "Can't reach servlet createNoteOverlay.jsp or it throws an error");
					handleError(error_unspecified, error_wedontknow);
		        }
		    });
		}else{
			logerror("actionbar.js", "$('#option_icon_write').click(function()...", "You already have opened an editor. 2 at the same time are not allowed");
			handleError(error_limiterror, error_newnote_onlyone);
		}
	});
	
	$('#option_icon_archiv').mouseover(function(){
		showTT(this, actionbar_archiv);
	});
	
	$('#option_icon_archiv').click(function(){
		loginfo("actionbar.js", "$('#option_icon_archiv').click(function()...", "Try to load archiv overlay");
		if($('#popover').length == 0){
			$.ajax({
		        type: "POST",
		        url: './dynamic/popoverArchiv.jsp',
		        success: 	function (html) {
					        	$('#surfaceholder').append(html);
					        	loginfo("actionbar.js", "$('#option_icon_archiv').click(function()...", "Archiv overlay loaded");
					     	},
				error:		function(){
								logerror("actionbar.js", "$('#option_icon_archiv').click(function()...", "Can't reach popoverArchiv.jsp or it throws an error");
								handleError(error_unspecified, error_wedontknow);
							}
		    });
		}
	});
	
	$('#option_icon_settings').mouseover(function(){
		showTT(this, actionbar_settings);
	});
	
	$('#option_icon_settings').click(function(){
		loginfo("actionbar.js", "$('#option_icon_settings').click(function()...", "Check if you have already groupadmin permissions");
		
		authorization("check", "", function(answer){
			if(answer == "authorized"){
				loadGrAdmin();
			}else if(answer == "unauthorized"){
				loginfo("actionbar.js", "$('#option_icon_settings').click(function()...", "You don't have groupadmin premissions yet");
				askforpw();
			}else{
				logerror("actionbar.js", "authorization", "The servlet ./groupAdminAuthorization returns an unexpected value: " + answer);
			}
		});
		
		/**
		 * This will show a window to the user where he can enter his password
		 * This function is called when the user isn't already authorized
		 */
		function askforpw(){
			if($("div.ask_windowholder").length == 0){
				loginfo("actionbar.js", "askforpw", "Asking for groupadmin password to authorize");
				var askpw = new askWindow(askwindow_password_needed, askwindow_enter_gradminpw);
				askpw.addUserinput("pw");
				askpw.btnOk(function(){
					authorization("authorize", askpw.getUserinput(), function(answer){
						if(answer == "authorized"){
							askpw.close();
							loadGrAdmin();
						}else if(answer == "unauthorized"){
							loginfo("actionbar.js", "askforpw", "This is the wrong password");
							askpw.invalidInput();
						}else{
							logerror("actionbar.js", "authorization", "The servlet ./groupAdminAuthorization returns an unexpected value: " + answer);
						}
					});
				});
				askpw.btnCancel(function(){
					askpw.close();
				})
				askpw.appendTo($("#surfaceholder"));
			}else{
				logwarning("actionbar.js", "askforpw", "There's already a window where you can enter your password");
			}
		}
		
		/**
		 * @param callback the data value from the business layer is passed thought it. ('authorized'/'unauthorized')
		 * @param groupadmin_pw... is only needed on 'authorize'
		 * @param task 'check', or 'authorize'.
		 */
		function authorization(task, groupadmin_pw, callback){
			$.ajax({
				type: "POST",
				url: "./groupAdminAuthorization",
				data: {task:task, groupadmin_pw:groupadmin_pw},
				success: function(data){
					callback(data);
				},
				error: function(){
					logerror("actionbar.js", "authorization", "Can't reach the servlet ./groupAdminAuthorization or it throws an error");
					handleError(error_unspecified, error_wedontknow);
				}
			});
		}
		
		/**
		 * Loads the Groupadmin GUI in editgroup mode
		 */
		function loadGrAdmin(){
			loginfo("actionbar.js", "loadGrAdmin", "You got the groupadmin permissions... Load the groupadmin gui in edit mode");
			$.ajax({
		        type: "POST",
		        data: {mode: "editgroup"},
		        url: './dynamic/popoverGroupadmin.jsp',
		        success: function (html) {
		        	loginfo("actionbar.js", "loadGrAdmin", "Groupadmin overlay loaded in edit mode!");
		        	$('#content').append(html);
		        },
		        error: function(){
		        	logerror("actionbar.js", "loadGrAdmin", "Can't reach popoverGroupadmin.jsp or it throws an error");
					handleError(error_unspecified, error_wedontknow);
		        }
		    });
		}
	});
	
	$('#option_icon_info').mouseover(function(){
		showTT(this, actionbar_info);
	});
	
	$('#option_icon_info').click(function(){
		loginfo("actionbar.js", "$('#option_icon_info').click(function()...", "Try to load info overlay");
		if($('#popover').length == 0){
			$.ajax({
		        type: "POST",
		        url: './dynamic/popoverInfo.jsp',
		        success: 	function (html) {
					        	$('#surfaceholder').append(html);
					        	loginfo("actionbar.js", "$('#option_icon_info').click(function()...", "Info overlay loaded");
					     	},
				error:		function(){
								logerror("actionbar.js", "$('#option_icon_info').click(function()...", "Can't reach popoverInfo.jsp or it throws an error");
								handleError(error_unspecified, error_wedontknow);
							}
		    });
		}
	});
	
	$('#option_icon_logout').mouseover(function(){
		showTT(this, actionbar_logout);
	});
	
	$('#option_icon_logout').click(function(){
		destroySession();	
	});
});

