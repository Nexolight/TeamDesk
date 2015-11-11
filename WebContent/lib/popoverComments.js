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

$('#popover_comments').ready(function(){
	var mynote = $("div.oneNote[data-id="+$('#popover_comments').attr('data-mynote')+"]");
	
	dynamicResize($('#popover_comments'), 80, 1024);
	fixElementheight($('#popover_holder'));
	fixElementwidth($('#popover_holder'));
	
	$(window).resize(function(){
		dynamicResize($('#popover_comments'), 80, 1024);
	})
	
	reloadDisplayedComments(mynote); //After this it should be called from the function which updates the comment count on a note
	
	placeboValue($('#popoverComments_inputauthor'), note_commentinput_autor, $('#popoverComments_sendcomment'));
	placeboValue($('#popoverComments_inputtext'), note_commentinput_text, $('#popoverComments_sendcomment'));
	
	$('#popoverComments_sendcomment').click(function(){
		saveComment($(mynote));
	});
});

/**
 * This will clear, reload and sort all comments of the given note into the comment area.
 * If the comment don't fit onto the area it scrolls to the bottom.
 * @param target_note
 */
function reloadDisplayedComments(target_note){
	var userIP = getUserIP();
	var serverTime = getServerTime();
	loginfo("popoverComments.js", "reloadCommentsOnChange", "Clear comments in comment area of note "+$(target_note).attr('data-id'));
	$.when($('#popoverComments_historyarea').children('div[data-onedit="false"]').fadeOut(250)).done(function(){
		$('#popoverComments_historyarea').children('div[data-onedit="false"]').remove();
		var oneditelement = $('#popoverComments_historyarea').children('div[data-onedit="true"]:first');
		var comments = $(target_note).find('div.oneNote_commentDataholder').children('div');
		loginfo("popoverComments.js", "reloadCommentsOnChange", "Sort comments in comment area of note "+$(target_note).attr('data-id'));
		var sortedComments = comments.sort(function(a, b){
			var aID = $(a).attr('data-id');
			var bID = $(b).attr('data-id');
			return aID - bID;
		}).each(function(){
			loginfo("popoverComments.js", "reloadCommentsOnChange", "add comment/s "+ $(this).attr('data-id') + " to comment area of note " + $(target_note).attr('data-id'));
			var id = $(this).attr('data-id');
			var author = $(this).attr('data-writer_name');
			var savetime = timestampToRegular($(this).attr('data-savetime'));
			var ip = $(this).attr('data-writer_ip');
			var comment = $(this).attr('data-comment');
			
			var html = "" +
					"<div class='popoverComments_onerow' data-id='"+id+"' style='display:none' data-onedit='false'>" +
						"<div class='popoverComments_logline'>" +
							"<span class='popoverComments_logsegment'>"+note_comment_author+"<span class='popoverComments_logauthor'>"+author+"</span></span>" +
							"<span class='popoverComments_logsegment'>"+note_comment_at+"<span class='popoverComments_logtime'>"+savetime+"</span></span>" +
							"<span class='popoverComments_logsegment'>"+note_comment_ip+"<span class='popoverComments_logip'>"+ip+"</span></span>" +
							"<span class='popoverComments_logsegment' style='display:none'><div class='popoverComments_edit'>"+note_comment_edit+"</div></span>" +
							"<span class='popoverComments_logsegment' style='display:none'>"+ note_comment_edit_until +"<div class='popoverComments_editexpire'></div></span>" +
							"<span class='popoverComments_logsegment' style='display:none'><div class='popoverComments_remove'>"+note_comment_remove+"</div></span>" +
						"</div>" +
						"<div class='popoverComments_commentline'>" +
							comment +
						"</div>" +
					"</div>" +
					"";

			if($(oneditelement).length > 0){
				var oneditid = parseInt($(oneditelement).attr('data-id'));
				var thisid = parseInt(id);
				if(oneditid > thisid){
					$(html).insertBefore($(oneditelement));
					applyRow(id);
				}else if(oneditid < thisid){
					$('#popoverComments_historyarea').append($(html));
					applyRow(id);
				}
			}else{
				$('#popoverComments_historyarea').append($(html));
				applyRow(id);
			}
			
			function applyRow(target_data_id){
				$('#popoverComments_historyarea').children('div[data-id='+target_data_id+']:first').fadeIn(250);
				commentedithandler($('#popoverComments_historyarea').children('div[data-id='+target_data_id+']:first'), userIP, serverTime);
			}
			
			
		});
		
		var toscroll = 0;
		$('#popoverComments_historyarea').children('div').each(function(){
			toscroll += $(this).outerHeight(true);
		})
		toscroll - $('#popoverComments_historyarea').innerHeight();
		if(toscroll > 0){
			$('#popoverComments_historyarea').scrollTop(toscroll);
		}
	});
}

/**
 * This makes the edit and delete button visible if a comment is editable for the user
 * It is when the user has the 
 * @param target_comment 
 * @param myIP If this ip matches the one in the db on a comment it will be editable for some minutes
 * @param serverTime With this it can calculate the countdown for the edit possibility
 */
function commentedithandler(target_comment, myIP, serverTime){
	var commentip = $(target_comment).find('span.popoverComments_logip').html();
	var savetime = getTimeFromTimestamp(regularToTimestamp($(target_comment).find('span.popoverComments_logtime').html()));
	var expiretime = savetime + Number($('#popover_comments').attr('data-timetoedit'));
	var counter = expiretime - getTimeFromTimestamp(regularToTimestamp(serverTime));
	if(commentip == myIP && counter > 0){
		loginfo("popoverComments.js", "commentedithandler", "The comment "+ $(target_comment).attr('data-id') + " is editable - Set timer and buttons");
		var expirefield = $(target_comment).find('div.popoverComments_editexpire');
		var editbtn = $(target_comment).find('div.popoverComments_edit');
		var removebtn = $(target_comment).find('div.popoverComments_remove');
		$(expirefield).closest('span').show();
		$(editbtn).closest('span').show();
		$(removebtn).closest('span').show();
		var timeleft = new Date(counter);
		
		(function countdown(){
			counter -= 1000;
			timeleft = new Date(counter);
			var disp = prependZeros(timeleft.getUTCHours(),2) + ":" + prependZeros(timeleft.getMinutes(),2) + ":" + prependZeros(timeleft.getSeconds(),2);
			$(expirefield).html(disp);
			if(counter <= 0){
				$(target_comment).attr("data-onedit", "false");
				$(target_comment).css("opacity", "1.0");
				$(expirefield).closest('span').fadeOut(250);
				$(editbtn).closest('span').fadeOut(250);
				$(removebtn).closest('span').fadeOut(250);
				loginfo("popoverComments.js", "commentedithandler", "The comment "+ $(target_comment).attr('data-id') + " cannot longer be edited - edit time expired");
			}else{
				setTimeout(countdown,1000);
			}
		})();
		
		$(target_comment).find('div.popoverComments_edit').click(function(){
			changeComment($(target_comment));
		});
		
		$(target_comment).find('div.popoverComments_remove').click(function(){
			removeComment($(target_comment));
		});
	}
}

/**
 * This will save the comment for the given note
 * @param target_note
 */
function saveComment(target_note){
	var onedit = $('#popoverComments_historyarea').find('div.popoverComments_onerow[data-onedit=\"true\"]');
	var author = $('#popoverComments_inputauthor').val();
	var comment = $('#popoverComments_inputtext').val().replace(/\r?\n/g, '<br />');
	var fk_note = $(target_note).attr('data-id');
	if(fk_note != ""){
		if(author != "" && comment != "" && author.replace(" ", "").length >= parseInt(note_comment_author_min_length) && comment.replace(" ", "").length >= parseInt(note_comment_text_min_length)){
			if($(onedit).length <= 0){
				loginfo("popoverComments.js", "saveComment", "Try to save the comment on note " + $(target_note).attr('data-id'));
				$.ajax({
			        type: "POST",
			        url: './addComment',
			        data: {fk_note: fk_note, author: author, comment: comment},
			        success: 	function () {
			        				loginfo("popoverComments.js", "saveComment", "Comment saved on note "  + $(target_note).attr('data-id'));
			        				showInfo(note_comment_saved, 1500);
			        				clearInput();
						     	},
					error:		function(){
								logerror("popoverComments.js", "saveComment", "Can't reach servlet ./addComment or it throws an error");
									handleError(error_unspecified, error_wedontknow);
								}
			    });
			}else{
				loginfo("popoverComments.js", "saveComment", "Try to update the comment "+$(onedit).attr('data-id')+" on note " + $(target_note).attr('data-id'));
				var id_comment = $(onedit).attr('data-id');
				$.ajax({
			        type: "POST",
			        url: './editComment',
			        data: {fk_note: fk_note, id_comment: id_comment, author: author, comment: comment},
			        success: 	function (data) {
			        				if(data == "norowsaffected"){
			        					loginfo("popoverComments.js", "saveComment", "Comment "+$(onedit).attr('data-id')+" cannot be updated on note "+ $(target_note).attr('data-id') +" - IP changed or time expired "  );
			        					handleError(error_server_access_denied, error_comment_edit);
			        				}else{
			        					$(onedit).attr('data-onedit', "false");
			        					loginfo("popoverComments.js", "saveComment", "Comment "+$(onedit).attr('data-id')+" updated on note "  + $(target_note).attr('data-id'));
				        				showInfo(note_comment_updated, 1500);
				        				clearInput();
			        				}
						     	},
					error:		function(){
								logerror("popoverComments.js", "saveComment", "Can't reach servlet ./changeComment or it throws an error");
									handleError(error_unspecified, error_wedontknow);
								}
			    });
			}
			
		}else{
			logerror("popoverComments.js", "saveComment", "The given author or comment is empty or it doesn't match the minimum length: author "+note_comment_author_min_length+", comment "+note_comment_text_min_length+" - will not proceed");
			handleError(error_false_input, error_comment_incomplete + "<br><br>" + note_commentinput_autor + "<br>" + error_gen_min + note_comment_author_min_length + error_gen_chars + "<br><br>" + note_commentinput_text + "<br>" + error_gen_min + note_comment_text_min_length + error_gen_chars);
		}
	}else{
		logerror("popoverComments.js", "saveComment", "The given reference (target_note) it's data-id is null - cannot proceed");
		handleError(error_unspecified, error_wedontknow);
	}
}

/**
 * This sets some values and changes which are needed to differ from a new and an existing comment (edit/new)
 * @param target_comment
 */
function changeComment(target_comment){
	if($(target_comment).attr("data-onedit") == "true"){
		loginfo("popoverComments.js", "changeComment", "Cancel edit mode on comment "+ $(target_comment).attr('data-id'));
		clearInput();
		$(target_comment).find('div.popoverComments_edit').html(note_comment_edit);
		$(target_comment).attr("data-onedit", "false");
		$(target_comment).css("opacity", "1.0");
	}else{
		loginfo("popoverComments.js", "changeComment", "Make comment "+ $(target_comment).attr('data-id') + " ready to edit");
		clearInput();
		$('#popoverComments_historyarea').children('div').each(function(){
			$(this).attr("data-onedit", "false");
		});
		setInput($(target_comment).find('span.popoverComments_logauthor').html(), $(target_comment).find('div.popoverComments_commentline').html().replace(/<br ?\/?>/g, "\n"));
		$(target_comment).find('div.popoverComments_edit').html(note_comment_back);
		$(target_comment).attr("data-onedit", "true");
		$(target_comment).css("opacity", "0.5");
	}
}

/**
 * This will remove the comment from the database
 * @param target_comment
 */
function removeComment(target_comment){
	var fk_note = parseInt($("#popover_comments").attr("data-mynote"));
	var id_comment = parseInt($(target_comment).attr("data-id"));
	
	if($(target_comment).attr("data-onedit") == "true"){
		$(target_comment).find('div.popoverComments_edit').html(note_comment_edit);
		$(target_comment).attr("data-onedit", "false");
		$(target_comment).css("opacity", "1.0");
	}
	
	loginfo("popoverComments.js", "removeComment", "Try to remove comment "+id_comment+" from note "+fk_note);
	$.ajax({
        type: "POST",
        url: './removeComment',
        data: {fk_note: fk_note, id_comment: id_comment},
        success: 	function (data) {
        				if(data == "norowsaffected"){
        					loginfo("popoverComments.js", "removeComment", "Comment "+id_comment+" cannot be removed from note "+fk_note+" - IP changed or time expired ");
        					handleError(error_server_access_denied, error_comment_remove);
        				}else{
        					loginfo("popoverComments.js", "removeComment", "Comment "+id_comment+" removed from note "  + fk_note);
	        				showInfo(note_comment_removed, 1500);
        				}
			     	},
		error:		function(){
					logerror("popoverComments.js", "removeComment", "Can't reach servlet ./removeComment or it throws an error");
						handleError(error_unspecified, error_wedontknow);
					}
    });
}

/**
 * This will clear the input fields and reset the pseudo values
 */
function clearInput(){
	//To clear the content
	$('#popoverComments_inputauthor').val('').change();
	$('#popoverComments_inputtext').val('').change();
}

/**
 * This will set the given values into the input fields
 * @param author
 * @param comment
 */
function setInput(author, comment){
	$('#popoverComments_inputauthor').val(author).change();
	$('#popoverComments_inputtext').val(comment).change();
}

