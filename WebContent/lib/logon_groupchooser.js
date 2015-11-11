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

$("#logonholder").ready(function(){
	fixElementheight($("#logonholder"));
	makeMovable($("#logonholder_header"), $("#logonholder"), $("#content"));
	$(window).resize(function(){
		fixElementheight($("#logonholder"));
	});
	
	setGroupDescription();
	$("input#logonholder_content_password").focus();
	$("#logonholder_content_select").change(function(){
		setGroupDescription();
		$("input#logonholder_content_password").focus();
	});
	function setGroupDescription(){
		loginfo("logon_groupchooser.js", "setGroupDescription", "Selected group has changed - Try to get Description");
		var groupname = $("#logonholder_content_select").children(":selected").val();
		$.ajax({
	        type: "POST",
	        url: "./dynamic/getGroupDescription.jsp",
	        data: {name: groupname},
	        success: function (data) {
	        	loginfo("logon_groupchooser.js", "setGroupDescription", "Got description");
	        	$('#logonholder_content_textarea').val(data);
	        },
	        error: function(data){
	        	logerror("logon_groupchooser.js", "setGroupDescription", "Can't reach setGroupDescription or it throws an error");
	            handleError(error_unspecified, error_wedontknow);
	        }
	    });
	}
	
	/**
	 * It will check if the premissions are ok and if they are 
	 * it redirects the user to their TeamDesk surface.
	 */
	$("button#logonholder_content_proceeed").click(function(){
		var gr_name = $("#logonholder_content_select").children(":selected").val();
		var gr_pw = $("input#logonholder_content_password").val();
		loginfo("logon_groupchooser.js", "$('#logonholder_content_form').submit()", "Let's check if your login data is valid");
		$.ajax({
	        type: "POST",
	        url: "./dynamic/checkPermission.jsp",
	        data: {groupname: gr_name, password: gr_pw},
	        async: false,
	        success: function (data) {
	        	if(data == "ok"){
	        		loginfo("logon_groupchooser.js", "$('#logonholder_content_form').submit()", "Your login seems to be ok");
	        		loadTDSurface();
	        	}else{
	        		logwarning("logon_groupchooser.js", "$('#logonholder_content_form').submit()", "Your login is invalid");
	        		redShakeFeedback($(".inputspan"));
	        		$("#logonholder_content_password").val("");
	        		$("#logonholder_content_password").focus();
	        	}
	        },
	        error: function (data){
	        	logerror("logon_groupchooser.js", "$('#logonholder_content_form').submit()", "Can't reach checkPermission.jsp or it throws an error");
	        	handleError(error_unspecified, error_wedontknow);
	        }
	    });
	});
	
	$("button#logonholder_content_newgroup").click(function(){
		loginfo("logon_groupchooser.js", "$('button#logonholder_content_newgroup').click(function()...", "Try to load groupadmin overlay");
		$.ajax({
	        type: "POST",
	        data: {mode: "newgroup"},
	        url: './dynamic/popoverGroupadmin.jsp',
	        success: function (html) {
	        	loginfo("logon_groupchooser.js", "$('button#logonholder_content_newgroup').click(function()...", "Groupadmin overlay loaded!");
	        	$('#content').append(html);
	        },
	        error: function(){
	        	logerror("logon_groupchooser.js", "$('button#logonholder_content_newgroup').click(function()...", "Can't reach popoverGroupadmin.jsp or it throws an error");
				handleError(error_unspecified, error_wedontknow);
	        }
	    });
	});
	
	$("input#logonholder_content_password").keypress(function(event){
		if ((event.which || event.keyCode) == 13){
			$("button#logonholder_content_proceeed").click();
		}
	});
	
});

