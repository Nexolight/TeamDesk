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

//The Surface is the wall which contains all notes
$('#surface').ready(function(){
	keepalive(function(){
		init_Notes();
		keepaliveLoop(30000);
		$(document).on("keydown", function(event){//The User should not reload the page
			if ((event.which || event.keyCode) == 116){
				loginfo("surface.js", "$('#surface').ready(function()", "F5 Pressed");
				event.preventDefault(); 
				reloadSurface();
			}
		}); 
	});
});


var notesource; //This is needed don't delete

/**
 * This closes the connections, reloads the surface and opens the conenctions again.
 */
function reloadSurface(){
	loginfo("surface.js", "reloadSurface", "Reload connection");
	notesource.close();
	surfaceClear(function(){
		setTimeout(function(){
			init_Notes();
		},250);
	});
}

/**
 * This will close the open connection, then update the settings and after this it will reconnect.
 * @param timeout This function should be used as client side reaction to a server side disconnect broadcast. The timeout which is given from the server should be used.
 * @param callback
 */
function reloadALL(timeout, callback){
	loginfo("surface.js", "reloadALL", "Reload settings and connection");
	notesource.close();
	surfaceClear(function(){
		var acttimer = 0;
		upInfo();
		changeInfo(reloadtimer_timetowait.replace("[seconds]", timeout / 1000));
		countdown();
		function countdown(){
			setTimeout(function(){
				changeInfo(reloadtimer_timetowait.replace("[seconds]", (timeout - acttimer) / 1000));
				if(acttimer < timeout){
					acttimer = acttimer + 1000;
					countdown();
				}else{
					downInfo();
					reloadGroupSettings();
					init_Notes(function(){
						if(typeof callback == "function"){
							callback();
						}
					});
				}
			},1000);
			
		}
	});
}

/**
 * This will reload the size of the usable surface 
 */
function reloadGroupSettings(){
	
	loginfo("surface.js", "reloadGroupSettings", "Try to reload the size settings from our group");
	
	$.ajax({
        type: "POST",
        url: './getGroupSizes',
        success: 	function (data) {
			        	if(data.match("^[0-9]*[xX][0-9]*$")){
			        		loginfo("surface.js", "reloadGroupSettings", "Got the size of the groups note surface");
			        		setSurfaceRes(resolveXYSize(data));
			        	}else{
			        		logerror("surface.js", "reloadGroupSettings", "Can't get the size of the groups note surface - You need to reload the page");
			        		location.reload();
			        	}
			     	},
		error:		function(){
						logerror("surface.js", "reloadGroupSettings", "Cannot reach Servlet ./getGroupSizes or it throws an error");
						handleError(error_unspecified, error_wedontknow);
					}
    });
	
	/**
	 * This changes the surface size
	 * @param newsize [width, height]
	 */
	function setSurfaceRes(newsize){
		loginfo("surface.js", "setSurfaceRes", "Set the surface size to width:" + newsize[0] + " height:" + newsize[1]);
		var surface = $("div#surface");
		fluidResize($(surface), newsize, 30, 10, function(){
			$(window).trigger("resize");
		}, function(){
			$(window).trigger("resize");
		});
	}
}

/**
 * This will clear the whole surface and reload all notes
 * and starts to listen to them
 * @param callback
 */
function init_Notes(callback){
	loginfo("surface.js", "init_Notes", "Lets try to open the live update connection");
	notesource = new EventSource('./initializeNotes');
	if(typeof(notesource) !== "undefined") {
		notesource.onopen = function(event){
			loginfo("surface.js", "init_Notes", "Connection is open - now listen to updates");
		}
		
		notesource.onmessage = function(event){ 
			var received = event.data;
			if(received.match("^hello$")){
				loginfo("surface.js", "init_Notes", "Got a keep-alive packet from server");
			}else if (received.match("^reconnectdelay_[0-9]*$")){
				loginfo("surface.js", "init_Notes", "Got a reload request from server");
				var reconnectdelay = parseInt(received.split("_")[1]);
				reloadALL(reconnectdelay);
			}else if(received.match("^groupdeleted$")){
				loginfo("surface.js", "init_Notes", "Got a kick request from server");
				notesource.close();
				surfaceClear(function(){
					showWarning(info_group_deleted, 5000);
					setTimeout(function(){
						location.reload(true);
					},5000);
				})
				
				
			}else{
				loginfo("surface.js", "init_Notes", "Update received");
				handleNoteUpdates(received,function(){
					setTimeout(function(){
						orderNotesBy_LvL_LV();
					},50); // Timeout because of reasons idk. callback doesn't work here and the first load contains usually a huge amount of data to process.
				});
			}
		}
		
		notesource.onerror = function(event){
			showWarning(error_connection_lost, 2500);
			logwarning("surface.js", "init_Notes", "Lost connection - try to clear and then reconnect");
			surfaceClear();
			//....A default browser should reconnect automatically
		}
		
	}else{
		handleError(error_push, error_push_info); //If this is called the whole application will not work.
	}
	
	if(callback && typeof(callback) === "function" ){
		callback();
	}
}

/**
 * This will call the server from time to time to tell it
 * that the client is still there. It will do it only once.
 * @param callback
 */
function keepalive(callback){
	$.ajax({
        type: "POST",
        url: './lifecycle',
        success: 	function () {
			        	if(callback && typeof(callback) === "function" ){
			        		loginfo("surface.js", "keepalive", "Sent a keep-alive packet to the server");
			        		callback();
			        	}
			     	},
		error:		function(){
						logerror("surface.js", "keepalive", "Cannot reach /lifecycle or it throws an error");
						handleError(error_unspecified, error_wedontknow);
					}
    });
}

/**
 * This will call the server from time to time to tell it
 * that the client is still there. It will do it in a loop.
 * @param intervall
 */
function keepaliveLoop(intervall){
	! function loop(){
		$.ajax({
	        type: "POST",
	        url: './lifecycle',
	        success: 	function () {
	        				setTimeout(loop, intervall);
	        				loginfo("surface.js", "keepaliveLoop", "Sent a keep-alive packet to the server");
				     	},
			error:		function(){
							logerror("surface.js", "keepaliveLoop", "Cannot reach /lifecycle or it throws an error");
							handleError(error_unspecified, error_wedontknow);
						}
	    });
		
	}();
}

/**
 * This will change the received updates in the Users surface.
 * It's highly depending on the server side messages!
 * If you change anything keep in mind that Querys.getGroupNotes, Servlet InitializeNotes and this function
 * have very high dependencies with each other.
 * @param received The commands to execute from the server
 */
function handleNoteUpdates(received, callback){
	loginfo("surface.js", "handleNoteUpdates", "Process note updates");
	var json_received = JSON.parse(received);
	
	//Search for comments to delete
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "REMOVE_COMMENTS"){
			var json_commentcollection = json_received[oneTypeCommandArr];
			$.each(json_commentcollection, function(key, value){
				var json_commentobject = value;
				var comment_id;
				var fk_note;

				//Get comment id and note fk from every comment
				$.each(json_commentobject, function(key, subvalue){
					switch(key){
					case "id":
						comment_id = subvalue;break;
					case "fk_note":
						fk_note = subvalue;break;
					}
				});
				sync_removeComment(comment_id, fk_note);
			})
		}
	}
	
	//Search for attachments to delete
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "REMOVE_ATTACHMENTS"){
			var json_attachmentcollection = json_received[oneTypeCommandArr];
			$.each(json_attachmentcollection, function(key, value){
				var json_attachmentobject = value;
				var attachment_id;
				var fk_note;

				//Get attachment id and note fk from every attachment
				$.each(json_attachmentobject, function(key, subvalue){
					switch(key){
					case "id":
						attachment_id = subvalue;break;
					case "fk_note":
						fk_note = subvalue;break;
					}
				});
				sync_removeAttachment(attachment_id, fk_note);
			})
		}
	}
	
	//Search for notes to delete
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "REMOVE_NOTES"){
			var json_notecollection = json_received[oneTypeCommandArr];
			$.each(json_notecollection, function(key, value){
				var json_noteobject = value;
				var note_id;
				var note_uuid;

				//Get id and uuid from every note
				$.each(json_noteobject, function(key, subvalue){
					switch(key){
					case "containerID":
						note_id = subvalue;break;
					case "uuid":
						note_uuid = subvalue;break;
					}
				});
				sync_removeNote(note_id, note_uuid);
			})
		}
	}
	
	
	//Search for new notes to add
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "ADD_NOTES"){
			var json_notecollection = json_received[oneTypeCommandArr];
			$.each(json_notecollection, function(key, value){
				var json_noteobject = value;
				var note_id;
				var note_uuid;

				//Every value for one note
				$.each(json_noteobject, function(key, subvalue){
					switch(key){
					case "containerID":
						note_id = subvalue;break;
					case "uuid":
						note_uuid = subvalue;break;
					}
				});
				sync_addNote(note_id, note_uuid);
			})
		}
	}
	
	//Search for new notecontent to add
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "ADD_NOTECONTENTS"){
			var json_notecontentcollection = json_received[oneTypeCommandArr];
			$.each(json_notecontentcollection, function(key, value){
				var json_notecontentobject = value;
				var notecontent_id;
				var notecontent_title;
				var notecontent_content;
				var notecontent_showtime;
				var notecontent_archivetime;
				var notecontent_savetime;
				var notecontent_lastview;
				var notecontent_archived;
				var notecontent_pos_x;
				var notecontent_pos_y;
				var notecontent_fk_level;
				var notecontent_size;
				var notecontent_fk_group;
				var notecontent_fk_colors;
				var notecontent_locked;
				var notecontent_locked_by;
				var notecontent_locked_at;

				//Every value for one notecontent
				$.each(json_notecontentobject, function(key, subvalue){
					switch(key){
					case "id":
						notecontent_id = subvalue;break;
					case "title":
						notecontent_title = subvalue;break;
					case "content":
						notecontent_content = subvalue;break;
					case "showtime":
						notecontent_showtime = subvalue;break;
					case "archivetime":
						notecontent_archivetime = subvalue;break;
					case "savetime":
						notecontent_savetime = subvalue;break;
					case "lastview":
						notecontent_lastview = subvalue;break;
					case "archived":
						notecontent_archived = subvalue;break;
					case "pos_x":
						notecontent_pos_x = subvalue;break;
					case "pos_y":
						notecontent_pos_y = subvalue;break;
					case "fk_level":
						notecontent_fk_level = subvalue;break;
					case "size":
						notecontent_size = subvalue;break;
					case "fk_group":
						notecontent_fk_group = subvalue;break;
					case "fk_colors":
						notecontent_fk_colors = subvalue;break;
					case "locked":
						notecontent_locked = subvalue;break;
					case "locked_by":
						notecontent_locked_by = subvalue;break;
					case "locked_at":
						notecontent_locked_at = subvalue;break;
					
					}
				});
				sync_addNotecontent(notecontent_id,notecontent_title,notecontent_content,notecontent_showtime,notecontent_archivetime,notecontent_savetime,
						notecontent_lastview,notecontent_pos_x,notecontent_pos_y,notecontent_fk_level,notecontent_size,notecontent_fk_colors,notecontent_locked, notecontent_locked_by, notecontent_locked_at);
			})
		}
	}
		
	//Search for comment changes
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "CHANGE_COMMENTS"){
			var json_commentchangecollection = json_received[oneTypeCommandArr];
			$.each(json_commentchangecollection, function(key, value){
				var json_commentchangeobject = value;

				//var id; will never change
				var comment_id;
				var fk_note;
				var comment = null;
				var writer_ip = null;
				//var savetime; will never change
				var writer_name = null;

				//Every value for a possible commentchange
				$.each(json_commentchangeobject, function(key, subvalue){
					switch(key){
					
					//case "id": will never change
					case "id_comment":
						comment_id = subvalue;break;
					case "fk_note":
						fk_note = subvalue;break;
					case "comment":
						comment = subvalue;break;
					case "writer_ip":
						writer_ip = subvalue;break;
					//case "savetime": will never change
					case "writer_name":
						writer_name = subvalue;break;
					}
				});
				sync_changeComment(comment_id, fk_note, comment, writer_ip, writer_name);
			})
		}
	}
		
	//Search for notecontent changes
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "CHANGE_NOTECONTENTS"){
			var json_notecontentchangecollection = json_received[oneTypeCommandArr];
			$.each(json_notecontentchangecollection, function(key, value){
				var json_notecontentchangeobject = value;
				
			  	//var id; will never change
			  	var id_note;
				var title;
				var content;
				var showtime;
				var archivetime;
				//var savetime; will never change
				var lastview;
				//var archived; Can change but will be removed at the same time
				var pos_x;
				var pos_y;
				var fk_level;
				var size;
				//var fk_group; will never change 
				var fk_colors;
				var locked;
				var locked_at;
				var locked_by;

				//Every value for a possible notecontent change
				$.each(json_notecontentchangeobject, function(key, subvalue){
					switch(key){
					//case "id": will never change
					case "id_note":
						id_note = subvalue;break;
					case "title":
						title = subvalue;break;
					case "content":
						content = subvalue;break;
					case "showtime":
						showtime = subvalue;break;
					case "archivetime":
						archivetime = subvalue;break;
					//case "savetime": will never change
					case "lastview":
						lastview = subvalue;break;
					//case "archived": will never change
					case "pos_x":
						pos_x = subvalue;break;
					case "pos_y":
						pos_y = subvalue;break;
					case "fk_level":
						fk_level = subvalue;break;
					case "size":
						size = subvalue;break;
					//case "fk_group": will never change
					case "fk_colors":
						fk_colors = subvalue;break;
					case "locked":
						locked = subvalue;break;
					case "locked_at":
						locked_at = subvalue;break;
					case "locked_by":
						locked_by = subvalue;break;
					}
				});
				
			  	if(pos_x || pos_y){
			  		sync_changeNoteposition(id_note, pos_x, pos_y);
			  	}
			  	
			  	if(fk_level){
			  		sync_changeNotelevel(id_note, fk_level);
			  	}
			  	
			  	if(fk_colors || fk_colors == 0){
			  		sync_changeNotecolors(id_note, fk_colors);
			  	}
			  	
			  	if(showtime || archivetime || lastview || size){
			  		sync_changeNoteproperties(id_note, showtime, archivetime, lastview, size);
			  	}
			  	
			  	if(title || content){
			  		sync_changeNotecontent(id_note, title, content);
			  	}

			  	if(locked == true || locked == false){
			  		sync_changelock(id_note, locked, locked_by, locked_at);
			  	}
			  	
			})
		}
	}
	
	//Search for new attachments to add
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "ADD_ATTACHMENTS"){
			var json_attachmentcollection = json_received[oneTypeCommandArr];
			$.each(json_attachmentcollection, function(key, value){
				var json_attachmentobject = value;
				var attachment_id;
				var attachment_link;
				var attachment_info;
				var attachment_log;
				var attachment_fk_note;

				//Every value for one attachment
				$.each(json_attachmentobject, function(key, subvalue){
					switch(key){
					case "id":
						attachment_id = subvalue;break;
					case "link":
						attachment_link = subvalue;break;
					case "info":
						attachment_info = subvalue;break;
					case "log":
						attachment_log = subvalue;break;
					case "fk_note":
						attachment_fk_note = subvalue;break;
					}
				});
				sync_addAttachment(attachment_id, attachment_link, attachment_info, attachment_log, attachment_fk_note);
			})
		}
	}
	
	//Search for new comments to add
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "ADD_COMMENTS"){
			var json_commentcollection = json_received[oneTypeCommandArr];
			$.each(json_commentcollection, function(key, value){
				var json_commentobject = value;
				var comment_id;
				var comment_fk_note;
				var comment_comment;
				var comment_writer_ip;
				var comment_savetime;
				var comment_writer_name;

				//Every value for one comment
				$.each(json_commentobject, function(key, subvalue){
					switch(key){
					case "id":
						comment_id = subvalue;break;
					case "fk_note":
						comment_fk_note = subvalue;break;
					case "comment":
						comment_comment = subvalue;break;
					case "writer_ip":
						comment_writer_ip = subvalue;break;
					case "savetime":
						comment_savetime = subvalue;break;
					case "writer_name":
						comment_writer_name = subvalue;break;
					}
				});
				sync_addComment(comment_id, comment_fk_note, comment_comment, comment_writer_ip, comment_savetime, comment_writer_name);
			})
		}
	}
	
	//Search for new editors to add
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "ADD_EDITORS"){
			var json_editorcollection = json_received[oneTypeCommandArr];
			$.each(json_editorcollection, function(key, value){
				var json_editorobject = value;
				var editor_id;
				var editor_fk_note;
				var editor_editor_ip;
				var editor_edit_time;

				//Every value for one editor
				$.each(json_editorobject, function(key, subvalue){
					switch(key){
					case "id":
						editor_id = subvalue;break;
					case "fk_note":
						editor_fk_note = subvalue;break;
					case "editor_ip":
						editor_editor_ip = subvalue;break;
					case "edit_time":
						editor_edit_time = subvalue;break;
					}
				});
				sync_addEditor(editor_id,editor_fk_note,editor_editor_ip,editor_edit_time);
			})
		}
	}
	
	if(typeof(callback) == "function"){
		callback();
	}
}


/**
 * As a Part of the live updates, this will add a new "note". The Note is just the basic framework without content
 * @param note_id
 * @param note_uuid
 * 
 */
function sync_addNote(note_id, note_uuid){
	loginfo("surface.js", "sync_addNote", "ADD NOTE id: " + note_id + " uuid: " + note_uuid);
	var html = "" +
			"<div class='oneNote' data-id='"+note_id+"' id='"+note_uuid+"' data-showtime='' " +
			"data-archivetime='' data-savetime='' data-lastview='' data-locked='' data-locked_at='' data-locked_by='' data-fkcolors='' data-colors='' " +
			"data-active='false' data-level_id='' style='display:none'>" +
			
				"<div class='oneNote_flashlayer'></div>" +
				"<div class='oneNote_prioholder' data-description=''>" +
					"<div class='oneNote_prioholder_text'></div>" +
				"</div>" +
				"<div class='oneNote_maincontent'>" +
					"<div class='note_attachmentholder'>" +

						"<div class='note_attachmentpiece_actionholder note_attachmentpiece_start' style='display:none;'>" +
							"<div class='note_attachmentpiece_atticon note_attachmentpiece_start'></div>" +
						"</div>" +
					
						"<div class='note_attachmentpiece note_attachmentpiece_sub' style='display:none;'>" +
							"<div class='note_attachmentpiece_media'>" +
								"<div class='note_attachmentnumber'></div>" +
							"</div>" +
						"</div>" +
						"<div class='note_attachmentpiece note_attachmentpiece_sub' style='display:none;'>" +
							"<div class='note_attachmentpiece_image'>" +
								"<div class='note_attachmentnumber'></div>" +
							"</div>" +
						"</div>" +
						"<div class='note_attachmentpiece note_attachmentpiece_sub' style='display:none;'>" +
							"<div class='note_attachmentpiece_doc'>" +
								"<div class='note_attachmentnumber'></div>" +
							"</div>" +
						"</div>" +
						"<div class='note_attachmentpiece note_attachmentpiece_end' style='display:none;'>" +
							"<div class='note_attachmentpiece_archiv'>" +
								"<div class='note_attachmentnumber'></div>" +
							"</div>" +
						"</div>" +
					"</div>" +
					"<div class='note_customcontent'>" +
						"<div class='note_header'>" +
							"<div class='note_title'></div>" +
							"<div class='note_edit'></div>" +
							"<div class='note_archive'></div>" +
						"</div>" +
						"<div class='note_notecontent'></div>" +
						"<div class='attachment_tab note_att_image' spellcheck='false'></div>" +
						"<div class='attachment_tab note_att_doc' spellcheck='false'></div>" +
						"<div class='attachment_tab note_att_archiv' spellcheck='false'></div>" +
						"<div class='attachment_tab note_att_media' spellcheck='false'></div>" +
					"</div>" +
					"<div class='oneNote_showComments'>" +
						"<span>0</span>" +
					"</div>" +
					"<div class='oneNote_commentDataholder'>" +
					"</div>" +
					"<div class='note_footer'>" +
						"<ul class='note_defaultinfoholder'>" +
							"<li class='note_created note_footerrow'></li>" +
						"</ul>" +
						"<div class='note_footerexpandtrigger note_footerexpandtrigger_close'></div>" +
						"<ul class='note_expandholder'>" +
						"</ul>" +
					"</div>" +
				"</div>" +
			"</div>" +
			"";
	$('#surface').append(html);
	var myself = $("div.oneNote[data-id="+note_id+"]");
	makeMovable($(myself).find('.oneNote_prioholder'), $(myself), $('#surface'));
	switchtablistener($(myself));
	commentbtnlistener($(myself));
	expandlistener($(myself));
	tooltiplistener($(myself));
	movelistener($(myself));
	editbtnlistener($(myself));
	archivebtnlistener($(myself));
}

/**
 * As a Part of the live updates, this will add new notecontent to a note
 * @param nc_id This is the id of the note where this notecontent and parameters will be applied
 * @param nc_title
 * @param nc_content
 * @param nc_showtime
 * @param nc_archivetime
 * @param nc_savetime
 * @param nc_lastview
 * @param nc_pos_x
 * @param nc_pos_y
 * @param nc_fk_level
 * @param nc_size
 * @param nc_fk_colors
 * @param nc_locked
 * @param nc_locked_by
 * @param nc_locked_at
 */
function sync_addNotecontent(nc_id, nc_title, nc_content, nc_showtime, 
		nc_archivetime, nc_savetime, nc_lastview, nc_pos_x, 
		nc_pos_y, nc_fk_level, nc_size, nc_fk_colors, nc_locked, nc_locked_by, nc_locked_at){
	
	loginfo("surface.js", "sync_addNotecontent", "ADD NOTECONTENT to note with id: " + nc_id + " (title: " + nc_title + ")");
	
	var myParent = $("div.oneNote[data-id="+nc_id+"]");
	
	$(myParent).css("left", nc_pos_x + "px");
	$(myParent).css("top", nc_pos_y + "px");
	
	var size = resolveXYSize(nc_size);
	
	$(myParent).css("width", size[0] + "px");
	$(myParent).css("height", size[1] + "px");
	
	$(myParent).find('.note_title').append(nc_title);
	$(myParent).find('.note_notecontent').append(nc_content);
	$(myParent).attr('data-showtime', nc_showtime);
	$(myParent).attr('data-archivetime', nc_archivetime);
	$(myParent).attr('data-savetime', nc_savetime);
	$(myParent).attr('data-lastview', nc_lastview);
	$(myParent).attr('data-locked', nc_locked);
	$(myParent).attr('data-fkcolors', nc_fk_colors);
	$(myParent).attr('data-level_id', nc_fk_level);
	
	activelistener($(myParent));
	
	var mysavetime = timestampToRegular(nc_savetime);
	$(myParent).find('ul.note_defaultinfoholder').find('li.note_created').html(note_created + mysavetime.substr(0, mysavetime.length - 3));
	searchforplayer($(myParent));
	sync_changeNotelevel(nc_id, nc_fk_level, function(){
		sync_changelock(nc_id, nc_locked, nc_locked_by, nc_locked_at);
	});
	if(nc_fk_colors != 0 && nc_fk_colors){
		sync_changeNotecolors(nc_id, nc_fk_colors);
	}
	$(myParent).fadeIn(2000);
}

/**
 * As a Part of the live updates, this will add new attachments to a note
 * @param attachment_id
 * @param attachment_link
 * @param attachment_info
 * @param attachment_log
 * @param attachment_fk_note
 */
function sync_addAttachment(attachment_id, attachment_link, attachment_info, attachment_log, attachment_fk_note){
	loginfo("surface.js", "sync_addAttachment", "ADD ATTACHMENT id: " + attachment_id + " fk_note: " + attachment_fk_note);
	
	var myParent = $("div.oneNote[data-id="+attachment_fk_note+"]");
	
	var attinfo = attachment_info.split("~");
	var attlog = attachment_log.split("~");
	
	var attlink = attachment_link;//The attachment link
	var attname = attinfo[0]; //The attachment name
	var atttype = attinfo[1]; //The attachment filetype
	var atthost	= attinfo[2]; //The attachment host 1 = external 0 = internal
	
	var attsize = attinfo[3]; //The attachment size
	
	
	var attuploader = attlog[0]; //The uploader
	var attuploadtime = attlog[1]; //The Uploadtime
	
	if(attinfo[2] == "1"){
		atthost = attachment_host_external;
		attsize = unknown_filesize;
	}else{
		atthost = attachment_host_internal;
	}
	
	if(attname == ""){
		attname = attlink.split("/").pop();
	}

	//Get the specific colors if they exist
	var linkstyle = "";
	var borderstyle = "";
	if($(myParent).attr('data-colors') != ""){
		var colors = JSON.parse($(myParent).attr('data-colors'));
		var link_font = colors[4];
		var borders = colors[5];
		linkstyle = "style='color:"+link_font+";'";
		borderstyle = "style='border-color:"+borders+";'";
	}

	
	var html = "<div class='attachment_row' data-id="+attachment_id+" "+borderstyle+">" +
					"<div class='attachment_icon'>" +
						"<span>"+atttype+"</span>" +
					"</div>"+
					"<div class='attachment_info'>" +
						"<a href='"+attachment_link+"' "+linkstyle+" target='_blank'>"+attname+"</a>" +
						"<span class='attachment_infoline'>"+attachment_type+": <span class='attachment_filetype'>"+atttype+"</span> | "+attachment_host+": <span class='attachment_host'>"+atthost+"</span> - <span class='attachment_size'>"+attsize+"</span></span>" +
						"<span class='attachment_infoline'>"+attachment_uploader+": <span class='attachment_uploader'>"+attuploader+"</span> - <span class='attachment_uploadtime'>"+attuploadtime+"</span></span>" +
					"</div>"+
				"</div>";
	
	var cat = checkExtenssionType(atttype);
	switch(cat){
	case "image":
		$(myParent).find('div.note_att_image').append(html);
		break;
	case "document":
		$(myParent).find('div.note_att_doc').append(html);
		break;
	case "multimedia":
		$(myParent).find('div.note_att_media').append(html);
		break;
	case "archiv":
		$(myParent).find('div.note_att_archiv').append(html);
		break;
	case "unknown":
		$(myParent).find('div.note_att_archiv').append(html);
		break;
	}
	updateAttachmentTabs_insurface($(myParent));
}


/**
 * As a Part of the live updates, this will add new editors to the note
 * @param editor_id
 * @param fk_note
 * @param editor_ip
 * @param edit_time
 */
function sync_addEditor(editor_id,fk_note,editor_ip,edit_time){
	loginfo("surface.js", "sync_addEditor", "ADD EDITOR id: " + editor_id + " fk_note: " + fk_note);
	var myParent = $("div.oneNote[data-id="+fk_note+"]");
	var html = "<li class='note_expandrow' data-id='"+editor_id+"'>"+ note_editor + editor_ip + " - " + timestampToRegular(edit_time) +"</li>";
	$(myParent).find('ul.note_expandholder').append(html);
	
	$(myParent).find('ul.note_expandholder').find('li.note_expandrow').sort(function(a,b){
	    return $(a).attr("data-id") - $(b).attr("data-id");
	}).each(function(){
		var me = $(this).detach();
		$(myParent).find('ul.note_expandholder').prepend(me);
	});
}

/**
 * As a Part of the live updates, this will add new comments to the note
 * @param comment_id
 * @param comment_fk_note
 * @param comment_comment
 * @param comment_writer_ip
 * @param comment_savetime
 * @param comment_writer_name
 */
function sync_addComment(comment_id, comment_fk_note, comment_comment, comment_writer_ip, comment_savetime, comment_writer_name){
	loginfo("surface.js", "sync_addComment", "ADD COMMENT id: " + comment_id + " fk_note: " + comment_fk_note);
	var myParent = $("div.oneNote[data-id="+comment_fk_note+"]");
	var html = "" +
			"<div style='display:none' class='oneNote_commentData' " +
			"data-id='"+comment_id+"' " +
			"data-comment='"+escapeHTML(comment_comment)+"' " +
			"data-writer_ip='"+comment_writer_ip+"' " +
			"data-savetime='"+comment_savetime+"' " +
			"data-writer_name='"+escapeHTML(comment_writer_name)+"'" +
			"></div>" +
			"";
	$(myParent).find('div.oneNote_commentDataholder').append(html);
	updateCommentCount($(myParent));
}

/**
 * As a part of the live updates, this removes a comment with the given ID and fk of the note
 * @param comment_id
 * @param fk_note
 */
function sync_removeComment(comment_id, fk_note){
	var myParent = $("div.oneNote[data-id="+fk_note+"]");
	var myComment = $(myParent).find("div.oneNote_commentDataholder").children("div.oneNote_commentData[data-id="+comment_id+"]");
	if($(myComment).attr('data-id') == comment_id){
		$.when(
				$(myComment).remove()
		).then(
				loginfo("surface.js", "sync_removeComment", "REMOVE COMMENT id: " + comment_id + " fk_note: " + $(myParent).attr('data-id')),
				updateCommentCount($(myParent))
		);
	}else{
		logwarning("surface.js", "sync_removeComment", "Cannot remove comment " + comment_id + " from note "+$(myParent).attr('data-id')+" - not found");
	}
}

/**
 * As a part of the live updates, this removes an attachment with the given ID and fk of the note
 * @param attachment_id
 * @param fk_note
 */
function sync_removeAttachment(attachment_id, fk_note){
	var myParent = $("div.oneNote[data-id="+fk_note+"]");
	var ok = false;
	$(myParent).find("div.attachment_tab").each(function(){
		var found = $(this).children("div.attachment_row[data-id="+attachment_id+"]");
		if($(found).length > 0 && $(found).attr('data-id') == attachment_id){
			ok = true;
			$.when(
					$(found).remove()
			).then(
					loginfo("surface.js", "sync_removeAttachment", "REMOVE ATTACHMENT id: " + attachment_id + " fk_note: " + $(myParent).attr('data-id')),
					updateAttachmentTabs_insurface(myParent)
			);
		}
	});
	if(!ok){
		logwarning("surface.js", "sync_removeAttachment", "Cannot remove attachment " + attachment_id + " from note "+$(myParent).attr('data-id')+" - not found");
	}
}

/**
 * As a part of the live updates, this will remove a whole note with the given id
 * @param note_id
 */
function sync_removeNote(note_id){
	var myself = $("div.oneNote[data-id="+note_id+"]");
	if ($(myself)){
		$.when(
				$(myself).fadeOut(2000, function(){
					$(myself).remove();
				})
		).then(
				loginfo("surface.js", "sync_removeNote", "REMOVE NOTE id: " + note_id)
		);
	}else{
		logwarning("surface.js", "sync_removeNote", "Cannot remove note " + note_id + " - not found");
	}
}

/**
 * As a part of the live updates this will apply changes to a comment with the given id inside the note with the given fk
 * @param comment_id 
 * @param fk_note
 * @param comment null or text
 * @param writer_ip null or ip
 * @param writer_name null or text
 */
function sync_changeComment(comment_id, fk_note, comment, writer_ip, writer_name){
	var myParent = $("div.oneNote[data-id="+fk_note+"]");
	var myself = $(myParent).find('div.oneNote_commentDataholder').children('div[data-id='+comment_id+']:first');
	if($(myself).length > 0){
		var changes = 0;
		if(comment != null){
			$(myself)[0].setAttribute('data-comment', comment);
			loginfo("surface.js", "sync_changeComment", "CHANGE COMMENT text of comment " + comment_id + " in note " + fk_note);
			changes++;
		}
		if(writer_ip != null){
			$(myself)[0].setAttribute('data-writer_ip', writer_ip);
			loginfo("surface.js", "sync_changeComment", "CHANGE COMMENT writer ip of comment " + comment_id + " in note " + fk_note);
			changes++;
		}
		if(writer_name != null){
			$(myself)[0].setAttribute('data-writer_name', writer_name);
			loginfo("surface.js", "sync_changeComment", "CHANGE COMMENT writer name of comment " + comment_id + " in note " + fk_note);
			changes++;
		}
		if(changes > 0){
			updateDisplayedComments(myParent);
		}
	}else{
		logwarning("surface.js", "sync_changeComment", "Cannot change comment " + comment_id + " in note "+fk_note+" - not found");
	}
}

/**
 * As a part of the live updates this will change the note position of the note with the given id
 * @param id_note
 * @param pos_x
 * @param pos_y
 */
function sync_changeNoteposition(id_note, pos_x, pos_y){
	var myNote = $("div.oneNote[data-id="+id_note+"]");
	if($(myNote)){
		var old_x = $(myNote)[0].offsetLeft;
		var old_y = $(myNote)[0].offsetTop;
		if(!pos_x){
			pos_x = old_x;
		}
		if(!pos_y){
			pos_y = old_y;
		}
		
		loginfo("surface.js", "sync_changeNoteposition", "CHANGE NOTEPOSITION Move note " +id_note+ " from position " + old_x + "x|" + old_y + "y to " + pos_x + "x|" + pos_y + "y");
		automoveElement($(myNote), old_x, old_y, pos_x, pos_y, 60, 10);
	}else{
		logwarning("surface.js", "sync_changeNoteposition", "Cannot move note. Note " + id_note + " - not found");
	}
}

/**
 * As a part of the live updates this will change the note level of the note with the given id to the level with the given id
 * This also changes the color of the note priority holder
 * @param id_note
 * @param fk_level
 * @param callback
 */
function sync_changeNotelevel(id_note, fk_level, callback){
	var myNote = $("div.oneNote[data-id="+id_note+"]");
	if($(myNote)){
		$(myNote).attr('data-level_id', fk_level);
		$.ajax({ //Set the level of the note
	        type: "POST",
	        url: './dynamic/getLevelDetailsById.jsp',
	        data: {levelid:fk_level},
	        success: 	function (data) {
	        				if(data != "nodata"){
	        					var mylevel = data.split("~");
	        					$(myNote).find('div.oneNote_prioholder_text').html(mylevel[1]); //weight
	        					$(myNote).find('div.oneNote_prioholder').attr('data-description', mylevel[2]);
	        					$(myNote).find('div.oneNote_prioholder').css('color', mylevel[3]); //color
	        					$(myNote).find('div.oneNote_prioholder').css('background-color', mylevel[4]); //background-color
	        					flashdivStop($(myNote).find('div.oneNote_prioholder'));
	        					flashdivStop($(myNote).find('div.oneNote_flashlayer'));
	        					flashdivStop($(myNote).find('div.oneNote_showComments'));
	        					if(mylevel[5] == "1"){ //Its the blink value in the db.
	        						setTimeout(function(){
	        							flashdiv($(myNote).find('div.oneNote_prioholder'), $(myNote).find('div.oneNote_prioholder').css("background-color"), 0,50);
		        						flashdiv($(myNote).find('div.oneNote_flashlayer'), $(myNote).find('div.oneNote_prioholder').css("background-color"), 0,50);
		        						flashdiv($(myNote).find('div.oneNote_showComments'), $(myNote).find('div.oneNote_prioholder').css("background-color"), 0,50);
	        						}, 32) //The timeout used in the function to check if the divs are still flashing is 16 - use 32 to be sure that it stops properly before reapply
	        						
	        					}
	        					loginfo("surface.js", "sync_changeNotelevel", "CHANGE LEVEL of note "+id_note+" to level " +mylevel[1]);
	        					if(typeof callback == "function"){
	        						callback();
	        					}
	        					
	        				}else{
	        					//Dont show an error message it colud be problematic because this 
	        					//server page will be called multiple times in a short period.
	        					logwarning("surface.js", "sync_changeNotelevel", "Can't get level details because level id "+ fk_level+ " doesn't exist");
	        				}
				     	},
			error:		function(){
							//Same as above
							logerror("surface.js", "sync_changeNotelevel", "Can't change level - getLevelDetailsById.jsp is unreachable or trows an error");
						}
	    });	
	}else{
		logwarning("surface.js", "sync_changeNotelevel", "Can't change level of note " + id_note + " - not found");
	}
		
}

/**
 * As a part of the live updates this will change the colors of a note with the given id to the given fk_color details
 * @param id_note
 * @param fk_color
 * @param callback
 */
function sync_changeNotecolors(id_note, fk_color, callback){
	var myNote = $("div.oneNote[data-id="+id_note+"]");
	if($(myNote)){
		var colors = "";
		var content_font = "";
		var content_background = "";
		var title_font = "";
		var title_background = "";
		var link_font = "";
		var borders = "";
		var table_header_background = "";
		var table_cell_01_background = "";
		var table_cell_02_background = "";
		var table_header_font = "";
		var table_cell_01_font = "";
		var table_cell_02_font = "";
		if(parseInt(fk_color) != 0 && fk_color){
			$.ajax({ //Set the basic colors of the note
		        type: "POST",
		        url: './dynamic/getNotecolors.jsp',
		        async: false,
		        data: {colorscheme_id:fk_color},
		        success: 	function (data) {
		        				if(data != "nodata"){
		        					$(myNote).attr('data-fkcolors', fk_color);
		        					colors = data.split(';');
		        	        		content_font = colors[0];
		        	        		content_background = colors[1];
		        	        		title_font = colors[2];
		        	        		title_background = colors[3];
		        	        		link_font = colors[4];
		        	        		borders = colors[5];
		        	        		table_header_background = colors[6];
		        	        		table_cell_01_background = colors[7];
		        	        		table_cell_02_background = colors[8];
		        	        		table_header_font = colors[9];
		        	        		table_cell_01_font = colors[10];
		        	        		table_cell_02_font = colors[11];
		        	        		
		        	        		setColors(colors,content_font,content_background,title_font,title_background,link_font,borders, 
		        				    		table_header_background,table_cell_01_background,table_cell_02_background,table_header_font,
		        				    		table_cell_01_font,table_cell_02_font
		        				    		);
		        	        		loginfo("surface.js", "sync_changeNotecolors", "CHANGE COLOR of note "+id_note+" to colorsheme " + fk_color);
		        	        		
		        				}else{
		        					logwarning("surface.js", "sync_changeNotecolors", "Can't get colors because color id "+ fk_color+ " doesn't exist");
		        				}
					     	},
				error:		function(){
								//Same as above
								logerror("surface.js", "sync_changeNotecolors", "Can't change colors - getNotecolors.jsp is unreachable or trows an error");
							}
		    });	
		}else{
			logwarning("surface.js", "sync_changeNotecolors", "The given color id is 0 or undefined - use template color");
			$(myNote).attr('data-fkcolors', '0');
    		setColors(colors,content_font,content_background,title_font,title_background,link_font,borders, 
		    		table_header_background,table_cell_01_background,table_cell_02_background,table_header_font,
		    		table_cell_01_font,table_cell_02_font
		    		);
		}
	}else{
		logwarning("surface.js", "sync_changeNotecolors", "Can't change color of note " + id_note + " - not found");
	}
	
	/**
	 * Finally set the color
	 */
	function setColors(	colors,
			    		content_font,
			    		content_background,
			    		title_font,
			    		title_background,
			    		link_font,
			    		borders, 
			    		table_header_background,
			    		table_cell_01_background,
			    		table_cell_02_background,
			    		table_header_font,
			    		table_cell_01_font,
			    		table_cell_02_font){
			$(myNote).attr('data-colors', JSON.stringify(colors));
			
			//Note and Attachment background and font color
			$(myNote).find('div.note_notecontent').css('color', content_font);
			$(myNote).find('div.attachment_tab').css('color', content_font);
			$(myNote).find('div.note_notecontent').css('background-color', content_background);
			$(myNote).find('div.attachment_tab').css('background-color', content_background);
			
			//Title background and font color
			$(myNote).find('div.note_title').css('color', title_font);
			$(myNote).find('div.note_title').css('background-color', title_background);
			
			//Link font color
			$(myNote).find('div.note_notecontent').find('a').css('color', link_font);
			//Attachments will be added later the color will be applied in the depending function
			
			//Style of striped tables
			$(myNote).find('table.notetable_zebra').each(function(){
				$(this).css('border-color', borders);
				$(this).find('th.notetable_zebra').each(function(){
					$(this).css('background-color', table_header_background);
					$(this).css('color', table_header_font);
					$(this).css('border-color', borders);
				});
				$(this).find('td.notetable_zebra_0').each(function(){
					$(this).css('background-color', table_cell_01_background);
					$(this).css('color', table_cell_01_font);
					$(this).css('border-color', borders);
				});
				$(this).find('td.notetable_zebra_1').each(function(){
					$(this).css('background-color', table_cell_02_background);
					$(this).css('color', table_cell_02_font);
					$(this).css('border-color', borders);
				});
			});
			
			//Style of non-striped tabels
			$(myNote).find('table.notetable').each(function(){
				$(this).css('border-color', borders);
				$(this).find('th.notetable').each(function(){
					$(this).css('color', content_font); //Content font instead of table font because the table is not colorized
					$(this).css('border-color', borders);
				});
				$(this).find('td.notetable').each(function(){
					$(this).css('color', content_font);
					$(this).css('border-color', borders);
				});
			});
			if(typeof callback == "callback"){
				callback();
			}
	}
}

/**
 * As a part of the live updates this will change the main visible content of a note with the given id
 * @param id_note
 * @param title
 * @param content
 */
function sync_changeNotecontent(id_note, title, content){
	var myNote = $("div.oneNote[data-id="+id_note+"]");
	if($(myNote)){
		
		if(title){
			$(myNote).find("div.note_header:first").children("div.note_title:first").text(title);
		}
		
		if(content){
			$(myNote).find("div.note_notecontent:first").html(content);
			searchforplayer($(myNote));
		}
		
		
		loginfo("surface.js", "sync_changeNotecontent", "CHANGE TITLE/TEXT of note " + id_note);
	}else{
		logwarning("surface.js", "sync_changeNotecontent", "Can't change title/text of note " + id_note + " - not found");
	}
}

/**
 * As a part of the live updates this will change the propreties of a note with the given id
 * @param id_note
 * @param showtime
 * @param archivetime
 * @param lastview
 * @param size
 */
function sync_changeNoteproperties(id_note, showtime, archivetime, lastview, size){
	var myNote = $("div.oneNote[data-id="+id_note+"]");
	if($(myNote)){
		if(showtime){
			$(myNote).attr("data-showtime", showtime);
			loginfo("surface.js", "sync_changeNoteproperties", "CHANGE SHOWTIME of note " + id_note);
		}
		
		if(archivetime){
			if(archivetime == "null"){
				$(myNote).attr("data-archivetime", "");
			}else{
				$(myNote).attr("data-archivetime", archivetime);
			}
			loginfo("surface.js", "sync_changeNoteproperties", "CHANGE ARCHIVETIME of note " + id_note);
		}
		
		if(lastview){
			$(myNote).attr("data-lastview", lastview);
			loginfo("surface.js", "sync_changeNoteproperties", "CHANGE LASTVIEW of note " + id_note);
		}
		
		if(size){
			var xy = resolveXYSize(size);
			fluidResize($(myNote), xy, 60, 8);
			loginfo("surface.js", "sync_changeNoteproperties", "CHANGE SIZE of note " + id_note);
		}
	}else{
		logwarning("surface.js", "sync_changeNoteproperties", "Can't change propreties of note " + id_note + " - not found");
	}
}

/**
 * As a part of the live updates this will change the lock state of a note with the given id.
 * Use this function after a possible level change. Otherwise you will get the wrong colors
 * @param id_note
 * @param locked
 * @param locked_by
 * @param locked_at
 */
function sync_changelock(id_note, locked, locked_by, locked_at){
	var myNote = $("div.oneNote[data-id="+id_note+"]");
	if($(myNote)){
		var rgborigin = $(myNote).find("div.oneNote_prioholder").css("background-color");		
		if(locked == true){
			$(myNote).attr("data-locked", "1");
			$(myNote).find("div.oneNote_prioholder").css("background-color", grayout(rgborigin, 3));
			$(myNote).attr("data-locked_at", locked_at);
			$(myNote).attr("data-locked_by", locked_by);
			loginfo("surface.js", "sync_changelock", "LOCKED note " + id_note);
		}else if(locked == false){
			$(myNote).attr("data-locked", "0");	
			
			sync_changeNotelevel(id_note, $(myNote).attr("data-level_id")); //Can be used to reset the color
			
			$(myNote).attr("data-locked_at", "");
			$(myNote).attr("data-locked_by", "");
			loginfo("surface.js", "sync_changelock", "UNLOCKED note " + id_note);
		}
	}else{
		logwarning("surface.js", "sync_changelock", "Can't change lock state of note " + id_note + " - not found");
	}
}

/**
 * This will update the Attachment Tabs of a note. This is only for the surface not the editor
 * @param target_note The affected note
 */
function updateAttachmentTabs_insurface(target_note){
	loginfo("surface.js", "updateAttachmentTabs_insurface", "Update Attachment counts and icons on note: "+$(target_note).attr("data-id"));
	var images = $(target_note).find('div.note_att_image > div').size();
	var multimedias = $(target_note).find('div.note_att_media > div').size();
	var documents = $(target_note).find('div.note_att_doc > div').size();
	var archives = $(target_note).find('div.note_att_archiv > div').size();
	
	var all = images + multimedias + documents + archives;
	
	if(all > 0){
		$(target_note).find('div.note_attachmentpiece_actionholder').show();
	}else{
		$(target_note).find('div.note_attachmentpiece_actionholder').hide();
	}
	
	if(images > 0){
		$(target_note).find('div.note_attachmentpiece_image').find('div.note_attachmentnumber').html(images);
		$(target_note).find('div.note_attachmentpiece_image').parent('div').show();
	}else{
		$(target_note).find('div.note_attachmentpiece_image').find('div.note_attachmentnumber').html('');
		$(target_note).find('div.note_attachmentpiece_image').parent('div').hide();
		switchback();
	}
	
	if(multimedias > 0){
		$(target_note).find('div.note_attachmentpiece_media').find('div.note_attachmentnumber').html(multimedias);
		$(target_note).find('div.note_attachmentpiece_media').parent('div').show();
	}else{
		$(target_note).find('div.note_attachmentpiece_media').find('div.note_attachmentnumber').html('');
		$(target_note).find('div.note_attachmentpiece_media').parent('div').hide();
		switchback();
	}
	
	if(documents > 0){
		$(target_note).find('div.note_attachmentpiece_doc').find('div.note_attachmentnumber').html(documents);
		$(target_note).find('div.note_attachmentpiece_doc').parent('div').show();
	}else{
		$(target_note).find('div.note_attachmentpiece_doc').find('div.note_attachmentnumber').html('');
		$(target_note).find('div.note_attachmentpiece_doc').parent('div').hide();
		switchback();
	}
	
	if(archives > 0){
		$(target_note).find('div.note_attachmentpiece_archiv').find('div.note_attachmentnumber').html(archives);
		$(target_note).find('div.note_attachmentpiece_archiv').parent('div').show();
	}else{
		$(target_note).find('div.note_attachmentpiece_archiv').find('div.note_attachmentnumber').html('');
		$(target_note).find('div.note_attachmentpiece_archiv').parent('div').hide();
		switchback();
	}
	
	/**
	 * Fade out the propably opened attachment tabs and switch back to the notecontent
	 */
	function switchback(){
		$.when($(target_note).find('div.attachment_tab').fadeOut(100)).done(function(){
			$(target_note).find('div.note_notecontent').fadeIn(100, function(){
			});
		});
	}

	//Reorder start and end
	$(target_note).find('div.note_attachmentpiece:visible').each(function(){
		$(this).removeClass("div.note_attachmentpiece_sub");
		$(this).removeClass("div.note_attachmentpiece_end");
		$(this).addClass("div.note_attachmentpiece_sub");
	});
	
	if(all > 0){
			$(target_note).find('div.note_attachmentpiece:visible').last().addClass('note_attachmentpiece_end');
	}
}

/**
 * This will change the displayed value of containing comments
 * and also calls reloadDisplayedComments if it's avaiable
 * @param target_note
 */
function updateCommentCount(target_note){
	loginfo("surface.js", "updateCommentCount", "Update Comment count on note: "+$(target_note).attr("data-id"));
	var count = $(target_note).find("div.oneNote_commentDataholder").children("div").length;
	$(target_note).find("div.oneNote_showComments").children("span:first").html(count);
	updateDisplayedComments(target_note);
}

/**
 * This will update displayed notes if they are actually displayed
 * @param target_note
 */
function updateDisplayedComments(target_note){
	if (typeof(reloadDisplayedComments) != 'undefined' && $("#popover_comments").length > 0) {
		if(parseInt($(target_note).attr("data-id")) == parseInt($("#popover_comments").attr("data-mynote"))){
			loginfo("surface.js", "updateDisplayedComments", "An updated comment is currently displayed - Apply in overlay");
			reloadDisplayedComments(target_note);
		}	
	}
}

/**
 * This will listen for tabchanges and perform them in the given note
 * @param target_note
 */
function switchtablistener(target_note){
	loginfo("surface.js", "switchtablistener", "Add switchtablistener to note: "+$(target_note).attr("data-id"));
	var clickback = null;
	$(target_note).find('div.note_attachmentpiece').click(function(e){
		loginfo("surface.js", "switchtablistener", "Perform a tabchange");
		var targetclass = $(e.target).attr('class');
		if(clickback == targetclass && clickback != null){ //Go back to the notecontent when the icon is the same as the already opened tab
			$.when($(target_note).find('div.attachment_tab').fadeOut(100)).done(function(){
				$(target_note).find('div.note_notecontent').fadeIn(100);
				clickback = null;
			})
		}else{ //Perform a tabchange
			$.when($(target_note).find('div.attachment_tab').fadeOut(100), $(target_note).find('div.note_notecontent').fadeOut(100)).done(function(){ //The second when is already hidden on a tabchange
				switch(targetclass){
					case "note_attachmentpiece_atticon":
						//do nothing
						break;
					case "note_attachmentpiece_media":
						$(target_note).find('div.note_att_media').fadeIn(100);
						clickback = "note_attachmentpiece_media";
						break;
					case "note_attachmentpiece_image":
						$(target_note).find('div.note_att_image').fadeIn(100);
						clickback = "note_attachmentpiece_image";
						break;
					case "note_attachmentpiece_doc":
						$(target_note).find('div.note_att_doc').fadeIn(100);
						clickback = "note_attachmentpiece_doc";
						break;
					case "note_attachmentpiece_archiv":
						$(target_note).find('div.note_att_archiv').fadeIn(100);
						clickback = "note_attachmentpiece_archiv";
						break;
				}
			})
		}
	});
}



/**
 * Adds all tooltips to a note
 * @param target_note
 */
function tooltiplistener(target_note){
	loginfo("surface.js", "tooltiplistener", "Add tooltiplistener to note: "+$(target_note).attr("data-id"));
	$(target_note).find('div.note_attachmentpiece_media').mouseover(function(){
		showTT($(this), attachment_media);
	});
	
	$(target_note).find('div.note_attachmentpiece_image').mouseover(function(){
		showTT($(this), attachment_image);
	});
	
	$(target_note).find('div.note_attachmentpiece_doc').mouseover(function(){
		showTT($(this), attachment_doc);
	});
	
	$(target_note).find('div.note_attachmentpiece_archiv').mouseover(function(){
		showTT($(this), attachment_archiv);
	});
	
	$(target_note).find('div.oneNote_prioholder').mouseover(function(){
		showTT($(this), note_priority + ": " + $(this).data('description'));
	});
	
	$(target_note).find('div.note_edit').mouseover(function(){
		showTT($(this), edit_note);
	});
	
	$(target_note).find('div.note_archive').mouseover(function(){
		showTT($(this), archive_note);
	});
	
	$(target_note).find('div.note_footerexpandtrigger').mouseover(function(){
		showTT($(this), expand_footer);
	});
	
	$(target_note).find('li.note_lastview').mouseover(function(){
		showTT($(this), $(this).html());
	});
	
	$(target_note).find('div.oneNote_showComments').mouseover(function(){
		showTT($(this), note_comments);
	});
}

/**
 * This will order the Notes depending on their level and then depending on their data-lastview state
 * Call this function after all notes are added on the first load or after each update of one of these two attributes
 * This function uses the Z-Index. Take a note, that the overlays z-indexes starts over 900'000.
 * That means you will get problems when there are more than 900'000 notes deployed on the surface. However THIS is unrealistic.
 * 
 */
function orderNotesBy_LvL_LV(){
	loginfo("surface.js", "orderNotesBy_LvL_LV", "Reorder notes by their priority and lastview attribute");
	var notes = $("div.oneNote");
	var sortedNotes = notes.sort(function(a, b){
		var aLvL = parseInt($(a).find("div.oneNote_prioholder_text").html());
		var aLastView = getTimeFromTimestamp($(a).attr("data-lastview"));
		var bLvL = parseInt($(b).find("div.oneNote_prioholder_text").html());
		var bLastView = getTimeFromTimestamp($(b).attr("data-lastview"));
		return bLvL - aLvL || aLastView - bLastView;
	});
	for(var i = 0; i < sortedNotes.length; i++){
		$(sortedNotes[i]).css("z-index", i);
	};
}
 

/**
 * Clears the surface from everything. This should be used if the browser reconnect to the server
 * This will not clear the editor.
 */
function surfaceClear(callback){
	loginfo("surface.js", "surfaceClear", "Clear surface");
	$("div#surface").find('div.oneNote').remove();
	if(typeof callback == "function"){
		callback();
	}
}

/**
 * This adds a listener for the expand button on the bottom of the note. It shows and expands or hide and closes the hidden area
 * @param target_note
 */
function expandlistener(target_note){
	loginfo("surface.js", "expandlistener", "Add expandlistener to note: "+$(target_note).attr("data-id"));
	$(target_note).find('div.note_footerexpandtrigger').click(function(){
		if($(this).parent('div.note_footer').find('ul.note_expandholder').css('display') == "none"){
			loginfo("surface.js", "expandlistener", "Expand the footer of the target note");
			$(this).removeClass('note_footerexpandtrigger_close');
			$(this).addClass('note_footerexpandtrigger_open');
			$(this).parent('div.note_footer').find('ul.note_expandholder').slideDown(250);
		}else{
			loginfo("surface.js", "expandlistener", "Close the footer of the target note");
			$(this).removeClass('note_footerexpandtrigger_open');
			$(this).addClass('note_footerexpandtrigger_close');
			$(this).parent('div.note_footer').find('ul.note_expandholder').slideUp(250);
		}
	});
}

/**
 * Listen if the user clicks on the note, then set the active attribute of this one to true and all others to false
 * This is just a workarround to prevent a video from stop playing.
 * 
 * This will update also the lastview value.
 * 
 * @param target_note
 */
function activelistener(target_note){
	loginfo("surface.js", "activelistener", "Add activelistener to note: "+$(target_note).attr("data-id"));
	$(target_note).mousedown(function(){
		$(this).closest('div.oneNote').attr('data-active', 'true');
		loginfo("surface.js", "activelistener", "Marked note as active and/or update lastview");
		var now = regularToTimestamp(getServerTime());
		//var now = getClientTime(); Faster but uses client date instead of the server date
		$(this).closest('div.oneNote').attr('data-lastview', now);
		var note_id = parseInt($(this).closest('div.oneNote').attr('data-id'));
		loginfo("surface.js", "activelistener", "Try to update lastview of note "+note_id);
		$.ajax({
	        type: "POST",
	        url: './updateLastview',
	        data: {note_id: note_id},
	        success: 	function (data) {
					    	if(data != "norowsaffected"){
								loginfo("surface.js", "activelistener", "Updated lastview of note "+note_id);
							}else{
								logerror("surface.js", "activelistener", "Unable to update lastview of note "+note_id);
							}
				     	},
			error:		function(){
						logerror("surface.js", "activelistener", "Can't reach servlet updateLastview or it throws an error");
							handleError(error_unspecified, error_wedontknow);
						}
	    });
	})
	$(target_note).blur(function(){
		loginfo("surface.js", "activelistener", "Marked note as not active");
		$(this).attr('data-active', 'false');
	});
}

/**
 * Listen if the comment is moved by the user. It's indicated by a mousedown and mouseup event
 * If he does it will update the db
 * @param target_note
 */
function movelistener(target_note){
	var note_id = parseInt($(target_note).attr("data-id"));
	loginfo("surface.js", "movelistener", "Add movelistener to note: "+note_id);
	var md = false;
	var mdX;
	var mdY;
	
	$(window).mouseup(function(){
		if(md == true && mdX && mdY  && mdX != 0 && mdY != 0){
			if(!checklock(target_note)){ //Check if note is locked
				md = false;
				var muX = $(target_note)[0].offsetLeft;
				var muY = $(target_note)[0].offsetTop;
				if(!(mdX == muX) || !(mdY == muY)){
					loginfo("surface.js", "movelistener", "Try to update position of note "+note_id+" from "+mdX+"x|"+mdY+"y to "+muX+"x|"+muY+"y");
					$.ajax({
				        type: "POST",
				        url: './updateNoteposition',
				        data: {note_id: note_id, posX: muX, posY: muY},
				        success: 	function (data) {
								    	if(data != "norowsaffected"){
											loginfo("surface.js", "movelistener", "Updated position of note "+note_id+" from "+mdX+"x|"+mdY+"y to "+muX+"x|"+muY+"y");
										}else{
											logerror("surface.js", "movelistener", "Unable to update position of note "+note_id);
										}
							     	},
						error:		function(){
									logerror("surface.js", "movelistener", "Can't reach servlet updateNoteposition or it throws an error");
										handleError(error_unspecified, error_wedontknow);
									}
				    });
				}
			}else{
				sync_changeNoteposition(note_id, mdX, mdY); //send the note back
				logwarning("surface.js", "movelistener", "The note "+note_id+" is locked you can't move it - I send it back!");
			}
			
		}else{
			md = false;
		}
	})
	
	$(target_note).mousedown(function(){
		md = true;
		mdX = $(target_note)[0].offsetLeft;
		mdY = $(target_note)[0].offsetTop;
	});
}

/**
 * Listen for clicks on the comments button in a note and opens the comment section
 * @param target_note
 */
function commentbtnlistener(target_note){
	loginfo("surface.js", "commentbtnlistener", "Add commentbtnlistener to note: "+$(target_note).attr("data-id"));
	$(target_note).find("div.oneNote_showComments").click(function(){
		loginfo("surface.js", "commentbtnlistener", "Try to load the comment overlay");
		$.ajax({
	        type: "POST",
	        url: './dynamic/popoverComments.jsp',
	        data: {target_dataid: $(target_note).attr("data-id")},
	        success: 	function (html) {
	        				loginfo("surface.js", "commentbtnlistener", "Got comment overlay");
				        	$('#surfaceholder').append(html);
				     	},
			error:		function(){
						logerror("surface.js", "commentbtnlistener", "Can't reach popoverComments.jsp or it throws an error");
							handleError(error_unspecified, error_wedontknow);
						}
	    });
	});
}

/**
 * This will search for videos inside a note and apply the player
 * if a player already exist it will replace it
 * @param target_note
 */
function searchforplayer(target_note){
	if($(target_note)){
		$(target_note).find('div.videoholder[data-host=\"internal\"]').each(function(){
			if($(this).children()){
				$(this).children().remove();
			}
			loginfo("surface.js", "searchforplayer", "Found a internal hostet video in note "+$(target_note).attr('data-id')+" - Apply player");
			var uniqueFrame = getUnique();
			var style = "style='width:"+$(this).attr('data-vwidth')+"px;height:"+$(this).attr('data-vheight')+"px;'";
			var source = $(this).attr('data-videolink');
			var ext = $(this).attr('data-type');
			var vtag = "" +
					"<video unselectable='on' id='"+uniqueFrame+"' class='projekktor' "+style+">" +
						"<source src='"+source+"' type='video/"+ext+"' />" +
					"</video>" +
					"";
			$(this).append(vtag);
			projekktor('#'+uniqueFrame,{
				volume: 0.8,
				playerFlashMP4: './lib/projekktor/swf/StrobeMediaPlayback/StrobeMediaPlayback.swf',
				playerFlashMP3: './lib/projekktor/swf/StrobeMediaPlayback/StrobeMediaPlayback.swf',
				controls: true
			}, function(player){
				window.p = player;
			});
		});
	}else{
		logwarning("surface.js", "searchforplayer", "Would search for player and apply it but the target note is invalid");
	}
}

/**
 * This is a listener for the edit button of a note which will proceed to the editor when clicked
 * @param target_note
 */
function editbtnlistener(target_note){
	loginfo("surface.js", "editbtnlistener", "Add editbtnlistener to note: "+$(target_note).attr("data-id"));
	var editbtn = $(target_note).find("div.note_header").find("div.note_edit");
	$($(editbtn)).click(function(){
		if(!checklock(target_note)){
			if($('#createNoteOverlay').length == 0){
				loginfo("surface.js", "editbtnlistener", "Try to load editor overlay");
				$.ajax({
			        type: "POST",
			        data: {mode: "edit", id: $(target_note).attr("data-id")},
			        url: './dynamic/createNoteOverlay.jsp',
			        async: false,
			        success: function (html) {
			        	$('#surface').append(html);
			        	loginfo("surface.js", "editbtnlistener", "Editor loaded!");
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
			        	logerror("surface.js", "editbtnlistener", "Can't reach createNoteOverlay.jsp or it throws an error");
						handleError(error_unspecified, error_wedontknow);
			        }
			    });
			}else{
				logerror("surface.js", "editbtnlistener", "You already have opened an editor. 2 at the same time are not allowed");
				handleError(error_limiterror, error_newnote_onlyone);
			}
		}else{
			logwarning("surface.js", "editbtnlistener", "The note " + $(target_note).attr("data-id") + " is locked - you can't edit it right now");
		}
	});
}

/**
 * This is a listener for the archiv button of a note which will proceed archive/remove the note
 * @param target_note
 */
function archivebtnlistener(target_note){
	var note_id = parseInt($(target_note).attr("data-id"));
	loginfo("surface.js", "archivebtnlistener", "Add archivebtnlistener to note: "+note_id);
	var archivbtn = $(target_note).find("div.note_header").find("div.note_archive");
	$($(archivbtn)).click(function(){
		if(!checklock(target_note)){
			loginfo("surface.js", "archivebtnlistener", "Try to archive/remove note "+note_id);
			$.ajax({
		        type: "POST",
		        data: {note_id: note_id},
		        url: './archiveNote',
		        async: false,
		        success: function (data) {
		        	if(data == "archived"){
		        		loginfo("surface.js", "archivebtnlistener", "Archived note "+note_id);
		        	}
		        	if(data == "removed"){
		        		loginfo("surface.js", "archivebtnlistener", "Removed note "+note_id);
		        	}
		        	
		        	if(data == "norowsaffected"){
		        		logerror("surface.js", "archivebtnlistener", "Unable to archive/remove note "+note_id);
		        	}
		        },
		        error: function(){
		        	logerror("surface.js", "archivebtnlistener", "Can't reach servlet ./archiveNote or it throws an error");
					handleError(error_unspecified, error_wedontknow);
		        }
		    });
		}else{
			logwarning("surface.js", "archivebtnlistener", "The note " + $(target_note).attr("data-id") + " is locked - you can't archive it right now");
		}
	});
}

/**
 * This checks if the note is locked and shows a warning when it is
 * @param target_note
 */
function checklock(target_note){
	if($(target_note).attr("data-locked") == "1"){
		var locked_at = timestampToRegular($(target_note).attr("data-locked_at"));
		var locked_by = $(target_note).attr("data-locked_by");
		showWarning( warning_cantperform_onedit + " " + 
				warning_cantperform_onedit_usr + locked_by + " " + 
				warning_cantperform_onedit_at + locked_at + " ", 5000);
		logwarning("surface.js", "checklock", "The note " + $(target_note).attr("data-id") + " is locked by "+locked_by+" at "+locked_at+"- can't perform this action");
		return true;
	}else{
		return false;
	}
}
