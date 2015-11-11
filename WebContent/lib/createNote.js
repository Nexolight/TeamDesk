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

var caretpos; //To save the cursor position while adding a image or video
var removedAttachments = []; //List of removed Attachments
var allPerformed = false; //used for the lockloop which otherwise could relock the note while the updates are processing
$('#createNoteOverlay').ready(function(){
	var editor = $("div#createNoteOverlay");
	var sourceid = parseInt($(editor).attr("data-edittarget"));
	
	if($(editor).attr("data-mode") == "edit"){
		initLock(function(){
			lockLoop(5000);
		});
	}
	rangy.init(); //enable rangy function to save and restore a cursor position
	$('#createNoteOverlay').fadeIn(500);
	document.execCommand('enableObjectResizing', false, 'true'); //Enable Object resizing inside the content editable div
	flashdiv($('#createNoteOverlay_flashlayer'), $('#createNoteOverlay_flashcolor').css("color"), 0, 50);
	flashdiv($('#createNoteOverlay_prioholder'), $('#createNoteOverlay_flashcolor').css("color"), 0, 50);
	makeResizable($('#createNoteOverlay'),$('#createNoteOverlay_resize'));
	makeMovable($('#createNoteOverlay_prioholder'), $('#createNoteOverlay'), $('#surface'));
	
	addTooltips();
	reorderEditOptions();
	
	
	//Prevent default action on the options holder
	$('#createNoteOverlay_editoptions_holder').mousedown(function(event){
		if( event.target == this ){
			event.preventDefault();
		}
	});
	
	//Remove/leave the new Editor without any changes
	$('#createNoteOverlay_close').click(function(){
		if($('#createNoteOverlay').attr("data-mode") == "edit"){
			stopLock(sourceid);
		}
		$('#createNoteOverlay').fadeOut(500, function(){
			$('#createNoteOverlay').remove();
		});
		allPerformed = true;
		sourceVisible(true);
	});

	//Save the note
	$('#createNoteOverlay_apply').click(function(){
		if($(editor).attr("data-mode") == "new"){
			saveNote();
		}
		if($(editor).attr("data-mode") == "edit"){
			updateNote()
			//stopLock() function is not needed - the above function will call it when finished
		}
	});
	
	placeboValue($('input#createNoteOverlay_title'), note_emptytitle, $("div#createNoteOverlay_apply"));
	placeboValue($('div#createNoteOverlay_notecontent'), note_emptycontent, $("div#createNoteOverlay_apply"));
	
	var is_bold = false;
	$('#edit_icon_bold').mousedown(function(event){
		if(is_bold){
			$('#edit_icon_bold').removeClass("option_icon_small_selected");
			is_bold = false;
		}else{
			$('#edit_icon_bold').addClass("option_icon_small_selected");
			is_bold = true;
		}
		event.preventDefault();
		document.execCommand("bold", false, null);
	});
	
	var is_italic = false;
	$('#edit_icon_italic').mousedown(function(event){
		if(is_italic){
			$('#edit_icon_italic').removeClass("option_icon_small_selected");
			is_italic = false;
		}else{
			$('#edit_icon_italic').addClass("option_icon_small_selected");
			is_italic = true;
		}
		event.preventDefault();
		document.execCommand("italic", false, null);
	});
	
	var is_underlined = false;
	$('#edit_icon_underlined').mousedown(function(event){
		if(is_underlined){
			$('#edit_icon_underlined').removeClass("option_icon_small_selected");
			is_underlined = false;
		}else{
			$('#edit_icon_underlined').addClass("option_icon_small_selected");
			is_underlined = true;
		}
		event.preventDefault();
		document.execCommand("underline", false, null);
	});
	
	$('#createNoteOverlay_notecontent').mouseup(function(){
		if(document.queryCommandState("bold")){
			$('#edit_icon_bold').addClass("option_icon_small_selected");
			is_bold = true;
		}else{
			$('#edit_icon_bold').removeClass("option_icon_small_selected");
			is_bold = false;
		}
		
		if(document.queryCommandState("italic")){
			$('#edit_icon_italic').addClass("option_icon_small_selected");
			is_italic = true;
		}else{
			$('#edit_icon_italic').removeClass("option_icon_small_selected");
			is_italic = false;
		}
		
		if(document.queryCommandState("underline")){
			$('#edit_icon_underlined').addClass("option_icon_small_selected");
			is_underlined = true;
		}else{
			$('#edit_icon_underlined').removeClass("option_icon_small_selected");
			is_underlined = false;
		}
	});
	
	$('#edit_icon_image').mousedown(function(event){
		if($('#createNoteOverlay_notecontent').is(":focus")){
			caretpos = rangy.saveSelection(); //Save cursor position
		}else{
			caretpos = null;
		}
		
		event.preventDefault();
		if($('#popover').length == 0){
			$.ajax({
		        type: "POST",
		        url: './dynamic/popoverAddImage.jsp',
		        async: false,
		        success: 	function (html) {
					        	$('#surfaceholder').append(html);
					     	},
				error:		function(){
								handleError(error_unspecified, error_wedontknow);
							}
		    });
		}
		
	});
	
	$('#edit_icon_video').mousedown(function(event){
		if($('#createNoteOverlay_notecontent').is(":focus")){
			caretpos = rangy.saveSelection(); //Save cursor position
		}else{
			caretpos = null;
		}
		
		event.preventDefault();
		if($('#popover').length == 0){
			$.ajax({
		        type: "POST",
		        url: './dynamic/popoverAddMovie.jsp',
		        async: false,
		        success: 	function (html) {
					        	$('#surfaceholder').append(html);
					     	},
				error:		function(){
								handleError(error_unspecified, error_wedontknow);
							}
		    });
		}
		
	});
	
	$('#edit_icon_table').mousedown(function(event){
		if($('#createNoteOverlay_notecontent').is(":focus")){
			caretpos = rangy.saveSelection(); //Save cursor position
		}else{
			caretpos = null;
		}
		
		event.preventDefault();
		if($('#popover').length == 0){
			$.ajax({
		        type: "POST",
		        url: './dynamic/popoverAddTable.jsp',
		        async: false,
		        success: 	function (html) {
					        	$('#surfaceholder').append(html);
					     	},
				error:		function(){
								handleError(error_unspecified, error_wedontknow);
							}
		    });
		}
	});
	
	$('#edit_icon_timer').mousedown(function(event){
		if($('#createNoteOverlay_notecontent').is(":focus")){
			caretpos = rangy.saveSelection(); //Save cursor position
		}else{
			caretpos = null;
		}
		
		event.preventDefault();
		if($('#popover').length == 0){
			$.ajax({
		        type: "POST",
		        url: './dynamic/popoverSetTimer.jsp',
		        async: false,
		        success: 	function (html) {
					        	$('#surfaceholder').append(html);
					     	},
				error:		function(){
								handleError(error_unspecified, error_wedontknow);
							}
		    });
		}
	});
	
	//Show attachment remove button
	$(document).on({
		mouseenter:function(){
			$(this).find('div.attachment_remove').fadeTo(100, 1.0, null);
		},
		mouseleave:function(){
			$(this).find('div.attachment_remove').fadeTo(100, 0, null);
		}
	}, 'div.attachment_row');
	
	//Open overlay to add a new attachment
	$('#note_attachmentpiece_add').click(function(){
		if($('#popover').length == 0){
			$.ajax({
		        type: "POST",
		        url: './dynamic/popoverAddAttachment.jsp',
		        async: false,
		        success: 	function (html) {
					        	$('#surfaceholder').append(html);
					     	},
				error:		function(){
								handleError(error_unspecified, error_wedontknow);
							}
		    });
		}
	});
	
	var clickback = null;
	$('#createNoteOverlay_attachmentholder > div.note_attachmentpiece').click(function(e){
		var targetclass = $(e.target).attr('class');
		if(clickback == targetclass && clickback != null){ //Go back to the notecontent when the icon is the same as the already opened tab
			$.when($('#createNoteOverlay div.attachment_tab').fadeOut(100)).done(function(){
				$('#createNoteOverlay_notecontent').fadeIn(100);
				clickback = null;
			})
		}else{ //Perform a tabchange
			$.when($('#createNoteOverlay div.attachment_tab').fadeOut(100), $('#createNoteOverlay_notecontent').fadeOut(100)).done(function(){ //The second when is already hidden on a tabchange
				switch(targetclass){
					case "note_attachmentpiece_add":
						//do nothing
						break;
					case "note_attachmentpiece_media":
						$('#createNoteOverlay_att_media').fadeIn(100);
						clickback = "note_attachmentpiece_media";
						break;
					case "note_attachmentpiece_image":
						$('#createNoteOverlay_att_image').fadeIn(100);
						clickback = "note_attachmentpiece_image";
						break;
					case "note_attachmentpiece_doc":
						$('#createNoteOverlay_att_doc').fadeIn(100);
						clickback = "note_attachmentpiece_doc";
						break;
					case "note_attachmentpiece_archiv":
						$('#createNoteOverlay_att_archiv').fadeIn(100);
						clickback = "note_attachmentpiece_archiv";
						break;
				}
			})
		}
	});
	
	$('#createNoteOverlay_prioholder').mousedown(function(event){
		if( event.target == this){
			event.preventDefault();
		}
	});
	
	$('#createNoteOverlay_prioholder_text').mousedown(function(event){
		if( event.target == this){
			event.preventDefault();
		}
	});
	
	var bgcolor = $("#createNoteOverlay_prioselect option:selected").attr("data-bgcolor");
	var fontcolor = $("#createNoteOverlay_prioselect option:selected").attr("data-fontcolor");
	changeColors();
	
	$('#createNoteOverlay_prioselect').change(function(){
		bgcolor = $("#createNoteOverlay_prioselect option:selected").attr("data-bgcolor");
		fontcolor = $("#createNoteOverlay_prioselect option:selected").attr("data-fontcolor");
		changeColors();
	});
	
	/**
	 * This will change the color of the priority background and text.
	 */
	function changeColors(){
		$('#createNoteOverlay_prioholder').css("background-color", bgcolor);
		$('#createNoteOverlay_prioholder_text').css("color", fontcolor);
	}
	
	$('#createNoteOverlay_notefooter').mousedown(function(event){
		if( event.target == this){
			event.preventDefault();
		}
	});
	
	$('#createNoteOverlay_resize').mousedown(function(event){
			event.preventDefault();
	});
	
	//Update the colors in the editor. It have to be different because its in the editor
	$('#createNoteOverlay_colors').change(function(){
		updateCreateNoteColors();
	});
	
	$('#createNoteOverlay_attachementholder').mousedown(function(event){
		event.preventDefault();
	});
	
	/*
	 * 
	 * 
	 * 
	 * 
	 * 
	 * Have to order the above code later!
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 */
	
	setTimeout(function(){
		handleMode($(editor));
	},100);
	
});

/**
 * This will insert a html tag at the current cursor position. Because of compatibility issues i have to use this instead of the simple "insertHTML"
 * Source: http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
 * @param html the html tag
 * @param delay the delay between the function call and its affect
 */
function insertTag(html, delay){
	if(delay == null){
		delay = 0;
	}
	if(!$('#createNoteOverlay_notecontent').is(":focus")){
		$('#createNoteOverlay_notecontent').focus();
		if(caretpos != null){
			rangy.restoreSelection(caretpos); //restore cursor position
		}else{
			$('#createNoteOverlay_notecontent').eq(-1).click();
		}
	}
	setTimeout(function(){
		var sel, range;
	    if (window.getSelection) {
	        // IE9 and non-IE
	        sel = window.getSelection();
	        if (sel.getRangeAt && sel.rangeCount) {
	            range = sel.getRangeAt(0);
	            range.deleteContents();
	            // Range.createContextualFragment() would be useful here but is
	            // only relatively recently standardized and is not supported in
	            // some browsers (IE9, for one)
	            var el = document.createElement("div");
	            el.innerHTML = html;
	            var frag = document.createDocumentFragment(), node, lastNode;
	            while ( (node = el.firstChild) ) {
	                lastNode = frag.appendChild(node);
	            }
	            range.insertNode(frag);

	            // Preserve the selection
	            if (lastNode) {
	                range = range.cloneRange();
	                range.setStartAfter(lastNode);
	                range.collapse(true);
	                sel.removeAllRanges();
	                sel.addRange(range);
	            }
	        }
	    } else if (document.selection && document.selection.type != "Control") {
	        // IE < 9
	        document.selection.createRange().pasteHTML(html);
	    }
	    updateCreateNoteColors();
	}, delay)
}

/**
 * This will insert a Link into the right attachment tab. 
 * @param a_type The type of the attachement. Use "image", "document", "multimedia", "archive" or "unknown".
 * @param a_url The link to the source
 * @param a_ext The file extennsion
 * @param a_name The name for the attachment
 * @param a_size The filesize which will be shown. Use Bytes otherwise the the whole input text will be added
 * @param originip if you dont want to set the ip automatically
 * @param origintime if you dont want to set the time automatically
 * @param id only if the attachment exist in the database
 */
function insertAttachment(a_type, a_url, a_ext, a_name, a_size, originip, origintime, id){
	var f_host;
	var f_size;
	if(a_size != null){
		if(isNaN(a_size)){
			f_size = a_size;
		}else{
			var sizetype;
			if(a_size < 1024){
				a_size = a_size;
				sizetype = "Byte";
			}else if(a_size < 1048576){
				a_size = byteToKByte(a_size);
				sizetype = "KB";
			}else if(a_size < 1073741824){
				a_size = byteToMByte(a_size);
				sizetype = "MB";
			}else if(a_size < 1099511627776){
				a_size = byteToGByte(a_size);
				sizetype = "GB";
			}else if(a_size < 1125899906842624){
				a_size = byteToTByte(a_size)
				sizetype = "TB";
			}else{
				a_size = byteToTByte(a_size)
				sizetype = "TB";
			}
			f_size = a_size+" "+sizetype;
		}
		f_host = attachment_host_internal;
	}else{
		f_host = attachment_host_external;
		f_size = unknown_filesize;
	}
	
	
	var add_by;
	var add_time;
	
	if(originip){
		add_by = originip;
	}else{
		add_by = getUserIP();
	}
	
	if(origintime){
		add_time = origintime;
	}else{
		add_time = getServerTime();
		add_time = add_time.substring(0, add_time.length - 3); //Remove the seconds I think they are a little bit useless
	}
	if(!id){
		id = "";
	}

	var i_tag = "<div class='attachment_row' data-id='"+id+"'>" +
					"<div class='attachment_icon'>" +
						"<span>"+a_ext+"</span>" +
					"</div>"+
					"<div class='attachment_info'>" +
						"<a href='"+a_url+"' target='_blank'>"+a_name+"</a><div class='attachment_remove'></div>" +
						"<span class='attachment_infoline'>"+attachment_type+": <span class='attachment_filetype'>"+a_ext+"</span> | "+attachment_host+": <span class='attachment_host'>"+f_host+"</span> - <span class='attachment_size'>"+f_size+"</span></span>" +
						"<span class='attachment_infoline'>"+attachment_uploader+": <span class='attachment_uploader'>"+add_by+"</span> - <span class='attachment_uploadtime'>"+add_time+"</span></span>" +
					"</div>"+
				"</div>";
	switch(a_type){
	case "image":
		$('#createNoteOverlay_att_image').append($(i_tag).click(function(){
			removeAttachment($(this));
		}));
		break;
	case "document":
		$('#createNoteOverlay_att_doc').append($(i_tag).click(function(){
			removeAttachment($(this));
		}));
		break;
	case "multimedia":
		$('#createNoteOverlay_att_media').append($(i_tag).click(function(){
			removeAttachment($(this));
		}));
		break;
	case "archiv":
		$('#createNoteOverlay_att_archiv').append($(i_tag).click(function(){
			removeAttachment($(this));
		}));
		break;
	case "unknown":
		$('#createNoteOverlay_att_archiv').append($(i_tag).click(function(){
			removeAttachment($(this));
		}));
		break;
	}
	
	//Make removable
	function removeAttachment(element){
		var attrow = $(element).closest("div.attachment_row");
		var arrrow = [$(attrow).find("a:first").attr("href"), parseInt($(attrow).attr("data-id"))];
		removedAttachments.push(arrrow);
		$("div.attachment_row").fadeTo(100, 0, function(){
			$(attrow).remove();
			updateAttachmentTabs_ineditor();
			$("div.attachment_row").fadeTo(100, 1.0, null);
		})
	}
	
	updateAttachmentTabs_ineditor();
	updateCreateNoteColors();
}

/**
 * This will update the attachment tabs and their content numbers... This is just for the editor not the surface
 */
function updateAttachmentTabs_ineditor(){
	var images = $('#createNoteOverlay_att_image > div').size();
	var multimedia = $('#createNoteOverlay_att_media > div').size();
	var document = $('#createNoteOverlay_att_doc > div').size();
	var archiv = $('#createNoteOverlay_att_archiv > div').size();
	
	var all = images + multimedia + document + archiv;
	
	var attholder = $('#createNoteOverlay_attachmentholder');
	var actionholder = $(attholder).find('div.note_attachmentpiece_actionholder')
	var attp_images = $(attholder).find('div.note_attachmentpiece_image');
	var attp_media = $(attholder).find('div.note_attachmentpiece_media');
	var attp_doc = $(attholder).find('div.note_attachmentpiece_doc');
	var attp_archiv = $(attholder).find('div.note_attachmentpiece_archiv');
	
	var actvisible = $('#createNoteOverlay_customcontent div.attachment_tab:visible');

	if(all > 0){
		$(actionholder).removeClass('note_attachmentpiece_singel');
		$(actionholder).addClass('note_attachmentpiece_start');
	}else{
		$(actionholder).removeClass('note_attachmentpiece_start');
		$(actionholder).addClass('note_attachmentpiece_singel');
	}
	
	if(images > 0){
		$(attp_images).parent('div').show();
		$(attp_images).find('div.note_attachmentnumber').html(images);
	}else{
		$(attp_images).parent('div').hide();
		$(attp_images).find('div.note_attachmentnumber').html('');
		switchback();
	}
	
	if(multimedia > 0){
		$(attp_media).parent('div').show();
		$(attp_media).find('div.note_attachmentnumber').html(multimedia);
	}else{
		$(attp_media).parent('div').hide();
		$(attp_media).find('div.note_attachmentnumber').html('');
		switchback();
	}
	
	if(document > 0){
		$(attp_doc).parent('div').show();
		$(attp_doc).find('div.note_attachmentnumber').html(document);
	}else{
		$(attp_doc).parent('div').hide();
		$(attp_doc).find('div.note_attachmentnumber').html('');
		switchback();
	}
	
	if(archiv > 0){
		$(attp_archiv).parent('div').show();
		$(attp_archiv).find('div.note_attachmentnumber').html(archiv);
	}else{
		$(attp_archiv).parent('div').hide();
		$(attp_archiv).find('div.note_attachmentnumber').html('');
		switchback();
	}
	
	/**
	 * Fade out the propably opened attachment tabs and switch back to the notecontent
	 */
	function switchback(){
		if($(actvisible).find("div").size() == 0){
			$.when($(actvisible).fadeOut(100)).done(function(){
				$('#createNoteOverlay_notecontent').fadeIn(100, function(){
				});
			});
		}
	}
	
	$('#createNoteOverlay_attachmentholder > div.note_attachmentpiece:visible').each(function(){
		$(this).removeClass("note_attachmentpiece_sub");
		$(this).removeClass("note_attachmentpiece_end");
		$(this).addClass("note_attachmentpiece_sub");
	});
	
	$('#createNoteOverlay_attachmentholder > div.note_attachmentpiece:visible').last().removeClass("note_attachmentpiece_sub");
	$('#createNoteOverlay_attachmentholder > div.note_attachmentpiece:visible').last().removeClass("note_attachmentpiece_end");
	$('#createNoteOverlay_attachmentholder > div.note_attachmentpiece:visible').last().addClass("note_attachmentpiece_end");
}

/**
 * This will update the colors from the actually opened overlay.
 * This one is just for the Editor section!
 */
function updateCreateNoteColors(){
	var colorscheme_id = $('#createNoteOverlay_colors').find(':selected').attr('data-id');
	$.ajax({
        type: "POST",
        url: './dynamic/getNotecolors.jsp',
        async: false,
        data: {colorscheme_id : colorscheme_id},
        success: 	function (data) {
        	if(data != "nodata"){ //receive the new colors and apply them in the editor. It's just a preview, the important key will be saved otherwise
        		//Be carefull a db change will affect this part.
        		var colors = data.split(';');
        		var content_font = colors[0];
        		var content_background = colors[1];
        		var title_font = colors[2];
        		var title_background = colors[3];
        		var link_font = colors[4];
        		var borders = colors[5];
        		var table_header_background = colors[6];
        		var table_cell_01_background = colors[7];
        		var table_cell_02_background = colors[8];
        		var table_header_font = colors[9];
        		var table_cell_01_font = colors[10];
        		var table_cell_02_font = colors[11];
        		
        		$('#createNoteOverlay_notecontent').css('color', content_font);
        		$('#createNoteOverlay_notecontent').css('background-color', content_background);       		
        		$('#createNoteOverlay_customcontent > div.attachment_tab').each(function(){
        			$(this).css('color', content_font);
        			$(this).css('background-color', content_background);
        			
        			$(this).children('div.attachment_row').each(function(){
        				$(this).css('border-color', borders);
        				$(this).find('a').css('color', link_font);
        			});
        		});
        		
        		$('#createNoteOverlay_customcontent > a').each(function(){
        			$(this).css('color', link_font);
        		});

        		$('#createNoteOverlay_title').css('color', title_font);
        		$('#createNoteOverlay_title').css('background-color', title_background);

        		$('#createNoteOverlay_notecontent').find('table.notetable_zebra').each(function(){
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
        		
        		$('#createNoteOverlay_notecontent').find('table.notetable').each(function(){
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

        		
        	}else{//the template color has the data-id 0 that will cause this answer from the server or also if it's not avaiable
        		$('#createNoteOverlay_notecontent').css('color', "");
        		$('#createNoteOverlay_notecontent').css('background-color', "");       		
        		$('#createNoteOverlay_customcontent > div.attachment_tab').each(function(){
        			$(this).css('color', "");
        			$(this).css('background-color', "");
        			
        			$(this).children('div.attachment_row').each(function(){
        				$(this).css('border-color', "");
        				$(this).find('a').css('color', "");
        			});
        		});
        		
        		$('#createNoteOverlay_customcontent > a').each(function(){
        			$(this).css('color', "");
        		});

        		$('#createNoteOverlay_title').css('color', "");
        		$('#createNoteOverlay_title').css('background-color', "");

        		$('#createNoteOverlay_notecontent').find('table.notetable_zebra').each(function(){
        			$(this).css('border-color', "");
        			$(this).find('th.notetable_zebra').each(function(){
        				$(this).css('background-color', "");
        				$(this).css('color', "");
        				$(this).css('border-color', "");
        			});
        			$(this).find('td.notetable_zebra_0').each(function(){
        				$(this).css('background-color', "");
        				$(this).css('color', "");
        				$(this).css('border-color', "");
        			});
        			$(this).find('td.notetable_zebra_1').each(function(){
        				$(this).css('background-color', "");
        				$(this).css('color', "");
        				$(this).css('border-color', "");
        			});
        		});
        		
        		$('#createNoteOverlay_notecontent').find('table.notetable').each(function(){
        			$(this).css('border-color', "");
        			$(this).find('th.notetable').each(function(){
        				$(this).css('color', ""); //Content font instead of table font because the table is not colorized
        				$(this).css('border-color', "");
        			});
        			$(this).find('td.notetable').each(function(){
        				$(this).css('color', "");
        				$(this).css('border-color', "");
        			});
        		});
        	}
        },
        error:		function(data){
        	handleError(error_unspecified, error_wedontknow);
        }
	});
}

/**
 * This will upload a file with the given name to the server.
 * The final path is defined by the server
 * @param f_target The target file input field. As example 'document.getElementById('id').files[0]'
 * @param f_filename The name to save the file with.
 */
function uploadFile(f_target, f_filename, callback){
	loginfo("createNote.js", "uploadFile", "Try to upload file " + f_filename);
	var fd = new FormData();
	fd.append("bindata", f_target);
	fd.append("filename", f_filename);
	upInfo();
	$.ajax({
        type: "POST",
        url: './uploadfile',
        xhr:		function(){
        	var xhr = $.ajaxSettings.xhr();
        	xhr.upload.onprogress = function(evt)
        	{
        	    if (evt.lengthComputable)
        	    {
        	        var percent = parseInt((evt.loaded / evt.total) * 100);
        	        changeInfo(uploadinf_upload + percent + "/100%");
        	        loginfo("createNote.js", "uploadFile", "Upload in progress - "+percent+"%");
        	    }
        	};
        	return xhr;
        },
        data: fd,
        processData: false, 
        contentType: false,
        success: 	function (data) {
        		changeInfo(upload_successful);
        		loginfo("createNote.js", "uploadFile", "Upload file "+f_filename+" successful");
        		downInfo();
        		callback();
        },
        error:		function(){
        	downInfo();
        	logerror("createNote.js", "uploadFile", "Servlet uploadFile is not reachable or it throws an error");
        	handleError(error_unspecified, error_wedontknow);
        }
	});
}

/**
 * Checks and react to the data-mode attribute new/edit and handles the editor different
 * @param target
 */
function handleMode(editor){
	var mode = $(editor).attr("data-mode");
	
	if(mode == "new"){
		loginfo("createNote.js", "handleMode", "Editor is open - You're about to create a new note");
	}
	
	if(mode == "edit"){
		var sourceid = $(editor).attr("data-edittarget");
		var source = $("div.oneNote[data-id="+sourceid+"]");
		
		if($(editor) && $(source)){
			loginfo("createNote.js", "handleMode", "Editor is open - You're about to edit the note "+$(source).attr("data-id"));
			
			//Copy the propreties
			$(editor).css("width", $(source).css("width"));
			$(editor).css("height", $(source).css("height"));
			$(editor).css("top", $(source).css("top"));
			$(editor).css("left", $(source).css("left"));
			$(editor).attr("data-displaydate", getDatefromTimestamp($(source).attr("data-showtime")));
			$(editor).attr("data-displaytime", getHMfromTimestamp($(source).attr("data-showtime")));
			$(editor).attr("data-archivedate", getDatefromTimestamp($(source).attr("data-archivetime")))
			$(editor).attr("data-archivetime", getHMfromTimestamp($(source).attr("data-archivetime")))
			
			
			//make the source invisible - because of the different shape at the same position this locks better without the source note
			sourceVisible(false);
			
			//Copy the title
			$("input#createNoteOverlay_title").val($(source).find("div.note_header").find("div.note_title").text());
			$("input#createNoteOverlay_title").change();
			
			//Copy the content
			$("div#createNoteOverlay_notecontent").html($(source).find("div.note_notecontent").html());
			$("div#createNoteOverlay_notecontent").change();
			
			/**
			 * searchforplayer is a function from surface.js just btw
			 * Search players and add them including the resize handler. But for comparison later you have to exclude them and also the resize handler
			 */
			$.when(searchforplayer($("div#createNoteOverlay_notecontent"))).done(function(){
				$("div#createNoteOverlay_notecontent").find("div.videoholder").each(function(){
					resizableElement($(this).children().first());
				});
			});
			
			//Copy the used colors
			var sourcecolorid = $(source).attr("data-fkcolors");
			var colorshemetoselect = $("select#createNoteOverlay_colors").children("[data-id='"+sourcecolorid+"']").val();
			$("select#createNoteOverlay_colors").val(colorshemetoselect);
			updateCreateNoteColors();
			
			//Copy the level of the note
			var sourcelevel = $(source).find("div.oneNote_prioholder_text").text();
			$("select#createNoteOverlay_prioselect").val(sourcelevel);
			$("select#createNoteOverlay_prioselect").change();
			
			//Copy the attachments - I know this is a mess! I hate myself for differ the editor from the notes in the surface!
			$(source).find("div.note_customcontent").find("div.attachment_tab").each(function(){
				$(this).find("div.attachment_row").each(function(){
					var id = $(this).attr("data-id");
					var type = checkExtenssionType($(this).find("span.attachment_filetype").text());
					var url = $(this).find("div.attachment_info").children("a:first").attr("href");
					var ext = $(this).find("span.attachment_filetype").text();
					var name = $(this).find("div.attachment_info").children("a:first").text();
					var size = $(this).find("div.attachment_info").find("span.attachment_size").text();
					var originip = $(this).find("div.attachment_info").find("span.attachment_uploader").text();
					var origintime = $(this).find("div.attachment_info").find("span.attachment_uploadtime").text();
					insertAttachment(type, url, ext, name, size, originip, origintime, id);
				});
			});
		}else{
			handleError(error_handle_edit, error_handle_edit_eas);
			logerror("createNote.js", "handleMode", "Would try to load the source note into the editor but one of them was not found");
		}
	}
}

/**
 * This will add a resize trigger (defined in css div.frame_resize) into the same container of the
 * given element. and will make the given child resizable. The Parent should be able to handle this fi you use this function
 * @param childofcontainer
 */
function resizableElement(childofcontainer){
	loginfo("createNote.js", "resizableElement", "Add a resize handler for a given element");
	var uniqueScale = getUnique();
	var resizetrigger = "<div unselectable='on' class='frame_resize' id='"+uniqueScale+"'><div>"
	$(childofcontainer).parent().append(resizetrigger);
	makeResizable($(childofcontainer), $("#"+uniqueScale));
}


/**
 * This saves the current editor state as a new note
 */
function saveNote(){
	loginfo("createNote.js", "saveNote", "Try to save a new note");
	cleanattachments();
	
	//The id from the priority table.
	var priority_id = parseInt($('#createNoteOverlay_prioselect').find(':selected').data('id')); 
	
	//The id form the used colorsheme.
	var colorsheme = $('#createNoteOverlay_colors').find(':selected').data('id'); 
	
	//The main html content inside main part of the note
	//Prepare the videos first   
	$('#createNoteOverlay_notecontent').find('div.videoholder[data-host=\"internal\"]').each(function(){
		$(this).attr('data-vwidth', $(this).children().first().width());
		$(this).attr('data-vheight', $(this).children().first().height());
		$(this).children().remove();
	});
	
	$('#createNoteOverlay_notecontent').find('div.videoholder[data-host=\"external\"]').find('div.frame_resize').remove();
	$('#createNoteOverlay_notecontent').find('span.rangySelectionBoundary').remove();
	
	var maincontent =  $('#createNoteOverlay_notecontent').html(); 
	
	//The note position.
	var posX = Math.round($('#createNoteOverlay')[0].offsetLeft); 
	var posY = Math.round($('#createNoteOverlay')[0].offsetTop);
	
	//The dimension of the note
	var size = Math.round($('#createNoteOverlay').width()) + "x" + Math.round($('#createNoteOverlay').height()); 
	
	//The title of the note
	var title = $('#createNoteOverlay_title').val();
	
	//The display and archive times.
	var displaydate = $('#createNoteOverlay').data('displaydate');
	var displaytime = $('#createNoteOverlay').data('displaytime');
	var archivedate = $('#createNoteOverlay').data('archivedate');
	var archivetime = $('#createNoteOverlay').data('archivetime');
	
	//Get the attachments
	var attachments = getAttachments("all");
	
	$.ajax({
        type: "POST",
        url: './addNote',
        data: {priority_id:priority_id,colorsheme:colorsheme,maincontent:maincontent,attachments:attachments,displaydate:displaydate,displaytime:displaytime,archivedate:archivedate,archivetime:archivetime,posX:posX,posY:posY,size:size,title:title},
        success: 	function () {
        				loginfo("createNote.js", "saveNote", "Saved new note");
        				$('#createNoteOverlay_close').click();
			     	},
		error:		function(){
						logerror("createNote.js", "saveNote", "Can't reach servlet addNote or it throws an error");
						handleError(error_save, error_while_save);
					}
    });
}

/**
 * 
 * @param include "all" will return every listed atatchment no matter if it already exist in the db "new" returns only attachments which dont exist in the db
 * @returns String with info in a fromat like this [att link]~[att name]~[att type]~[att host]~[att size]~[att uplaoder]~[uploadtime]$ the $ is used to define a row
 */
function getAttachments(include){
	
	// they will be added later
	var attachments = ""; 
	var attachmenttypes = ["#createNoteOverlay_att_image","#createNoteOverlay_att_media", "#createNoteOverlay_att_doc", "#createNoteOverlay_att_archiv"]; //Shorter code
	
	//Make the attachments splitable
	for(var i = 0; i < attachmenttypes.length; i++){
		$(attachmenttypes[i]).children('div.attachment_row').each(function(){
			var myid = $(this).attr('data-id');
			var attlink = $(this).children('div.attachment_info:first').children('a:first').attr('href');
			var attname = $(this).children('div.attachment_info:first').children('a:first').html();
			var atttype = $(this).children('div.attachment_info:first').find('span.attachment_filetype').html();
			var atthost = $(this).children('div.attachment_info:first').find('span.attachment_host').html();
			var attsize
			if(atthost == attachment_host_external){
				atthost = "1"; // 1 = external hosted
				attsize = "0"; // Size is unknown
			}else{
				atthost = "0"; // 0 = internal hosted
				attsize = $(this).children('div.attachment_info:first').find('span.attachment_size').html(); //Take the given size
			}
			var attuploader = $(this).children('div.attachment_info:first').find('span.attachment_uploader').html();
			var attuploadtime = $(this).children('div.attachment_info:first').find('span.attachment_uploadtime').html();				
			
			var oneatt = attlink + "~" + attname + "~" + atttype + "~" + atthost + "~" + attsize + "~" + attuploader + "~" + attuploadtime +"$";
			if(include == "all"){
				attachments += oneatt;
			}
			
			if(include == "new"){
				if(myid == ""){
					attachments += oneatt;
				}
			}
		});
	}
	
	if(attachments != ""){
		attachments = attachments.substring(0, attachments.length -1); //to split it up easier later.
		return attachments;
	}else{
		return "";	
	}
}

/**
 * This checks the differences between the source and calls the update functions depending on them
 */
function updateNote(){
	var editor = $("div#createNoteOverlay");
	var sourceid = $(editor).attr("data-edittarget");
	var source = $("div.oneNote[data-id="+sourceid+"]");
	var note_id = $(source).attr("data-id");
	
	loginfo("createNote.js", "updateNote", "Try to update note " + note_id);
	
	if($(editor) && $(source)){
		
		cleanattachments(); //Clean removed attachments
		
		loginfo("createNote.js", "updateNote", "Compare source note with editor and call update functions");
		
		//To add the editor at the end if it's not null
		var changes = 0; 
		
		//To show a general error if one occurs
		var errors = 0;
		
		//size
		var s_size = parseInt($(source).css("width")) + "x" + parseInt($(source).css("height"));
		var e_size = parseInt($(editor).css("width")) + "x" + parseInt($(editor).css("height"));
		
		//position
		var s_pos = Math.round($(source)[0].offsetLeft) + "x" + Math.round($(source)[0].offsetTop);
		var e_pos = Math.round($(editor)[0].offsetLeft) + "x" + Math.round($(editor)[0].offsetTop);
		
		//showtime
		var s_displaydate = getDatefromTimestamp($(source).attr("data-showtime"));
		var s_displaytime = getHMfromTimestamp($(source).attr("data-showtime"));
		var e_displaydate = $(editor).attr("data-displaydate");
		var e_displaytime = $(editor).attr("data-displaytime");
		
		//archivetime - not clean
		var s_archivedate = getDatefromTimestamp($(source).attr("data-archivetime"));
		var s_archivetime = getHMfromTimestamp($(source).attr("data-archivetime"));
		var e_archivedate = $(editor).attr("data-archivedate");
		var e_archivetime = $(editor).attr("data-archivetime");
		
		//title - clean
		var s_title = $(source).find("div.note_header").find("div.note_title").text();
		var e_title = $("input#createNoteOverlay_title").val();
		
		var added_attachments = getAttachments("new");
		
		//content (e_content) clean
		var s_content_tmp = $(source).find("div.note_notecontent").clone();
		$(s_content_tmp).find("div.videoholder[data-host=\"internal\"]").each(function(){
			$(this).children().remove();
		});
		var s_content = $(s_content_tmp).html();
		var e_content_tmp = $("div#createNoteOverlay_notecontent").clone();
		$(e_content_tmp).find("div.videoholder").each(function(){
			if($(this).attr("data-host") == "internal"){
				$(this).attr("data-vwidth", $(this).children().first().width());
				$(this).attr("data-vheight", $(this).children().first().height());
				$(this).children().remove();
			}else{
				$(this).find("div.frame_resize").remove();
			}
		});
		$(e_content_tmp).find('span.rangySelectionBoundary').remove();
		var e_content = $(e_content_tmp).html();
		
		//priority/level fk clean
		var s_level = parseInt($(source).attr('data-level_id'));
		var e_level = parseInt($("#createNoteOverlay_prioselect option:selected").attr("data-id"));
		
		//color fk clean
		var s_color = parseInt($(source).attr('data-fkcolors'));
		var e_color = parseInt($("#createNoteOverlay_colors option:selected").attr("data-id"));
		
		/*
		 * Perform size update
		 */
		if(s_size != e_size){
			var width = Math.round($('#createNoteOverlay').width());
			var height = Math.round($('#createNoteOverlay').height()); 
			loginfo("createNote.js", "updateNote", "Size of note "+note_id+" has changed from "+s_size+" to "+e_size);
			$.ajax({
		        type: "POST",
		        url: './updateNotesize',
		        data: {note_id: note_id, width: width, height: height},
		        async: false,
		        success: 	function (data) {
						    	if(data != "norowsaffected"){
						    		loginfo("createNote.js", "updateNote", "Updated size of note "+note_id+" from "+s_size+" to "+e_size);
						    		changes++;
								}else{
									logwarning("createNote.js", "updateNote", "Unable to update size of note "+note_id);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "updateNote", "Can't reach servlet updateNotesize or it throws an error");
								errors++;
							}
		    });
		}
		
		/*
		 * Perform position update
		 */
		if(s_pos != e_pos){
			var oldXY = resolveXYSize(s_pos)
			var newXY = resolveXYSize(e_pos)
			
			loginfo("createNote.js", "updateNote", "Position of note "+note_id+" has changed from "+oldXY[0]+"x|"+oldXY[1]+"y to "+newXY[0]+"x|"+newXY[1]+"y");
			$.ajax({
		        type: "POST",
		        url: './updateNoteposition',
		        data: {note_id: note_id, posX: newXY[0], posY: newXY[1]},
		        async: false,
		        success: 	function (data) {
						    	if(data != "norowsaffected"){
						    		loginfo("createNote.js", "updateNote", "Updated position of note "+note_id+" from "+oldXY[0]+"x|"+oldXY[1]+"y to "+newXY[0]+"x|"+newXY[1]+"y");
						    		changes++;
								}else{
									logwarning("createNote.js", "updateNote", "Unable to update position of note "+note_id);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "updateNote", "Can't reach servlet updateNoteposition or it throws an error");
								errors++;
							}
		    });
		}
		
		/**
		 * Perform showtime change
		 */
		if((s_displaydate != e_displaydate) || (s_displaytime != e_displaytime)){
			var displaydate = e_displaydate;
			var displaytime = e_displaytime;
			loginfo("createNote.js", "updateNote", "Showtime of note "+note_id+" has changed from "+s_displaydate+" " +s_displaytime+ " to "+e_displaydate+ " " +e_displaytime);
			$.ajax({
		        type: "POST",
		        url: './updateNoteshowtime',
		        data: {note_id: note_id, displaydate:displaydate,displaytime:displaytime},
		        async: false,
		        success: 	function (data) {
						    	if(data != "norowsaffected"){
						    		loginfo("createNote.js", "updateNote", "Updated showtime of note "+note_id+" from "+s_displaydate+" " +s_displaytime+ " to "+e_displaydate+ " " +e_displaytime);
						    		changes++;
								}else{
									logwarning("createNote.js", "updateNote", "Unable to update showtime of note "+note_id);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "updateNote", "Can't reach servlet updateNoteshowtime or it throws an error");
								errors++;
							}
		    });
		}
		
		/**
		 * Perform archivetime change
		 */
		if((s_archivedate != e_archivedate) || (s_archivetime != e_archivetime)){
			var archivedate = e_archivedate;
			var archivetime = e_archivetime;
			loginfo("createNote.js", "updateNote", "Archivetime of note "+note_id+" has changed from "+s_archivedate+" " +s_archivetime+ " to "+e_archivedate+ " " +e_archivetime);
			$.ajax({
		        type: "POST",
		        url: './updateNotearchivetime',
		        data: {note_id: note_id, archivedate:archivedate,archivetime:archivetime},
		        async: false,
		        success: 	function (data) {
						    	if(data != "norowsaffected"){
						    		loginfo("createNote.js", "updateNote", "Updated archivetime of note "+note_id+" from "+s_archivedate+" " +s_archivetime+ " to "+e_archivedate+ " " +e_archivetime);
						    		changes++;
								}else{
									logwarning("createNote.js", "updateNote", "Unable to update archivetime of note "+note_id);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "updateNote", "Can't reach servlet updateNotearchivetime or it throws an error");
								errors++;
							}
		    });
		}
		
		/**
		 * Perform title change
		 */
		if(s_title != e_title){
			var title = e_title;
			loginfo("createNote.js", "updateNote", "Title of note "+note_id+" has changed from "+s_title+" to "+e_title);
			$.ajax({
		        type: "POST",
		        url: './updateNotetitle',
		        data: {note_id: note_id, title: title},
		        async: false,
		        success: 	function (data) {
						    	if(data != "norowsaffected"){
						    		loginfo("createNote.js", "updateNote", "Updated title of note "+note_id+" from "+s_title+" to "+e_title);
						    		changes++;
								}else{
									logwarning("createNote.js", "updateNote", "Unable to update title of note "+note_id);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "updateNote", "Can't reach servlet updateNotetitle or it throws an error");
								errors++;
							}
		    });
		}
		
		/**
		 * Perform content change
		 */
		if(s_content != e_content){
			var content = e_content; //Don't use the html of the note directly! Use the e_content which is already prepared to save.
			loginfo("createNote.js", "updateNote", "Content text of note "+note_id+" has changed");
			$.ajax({
		        type: "POST",
		        url: './updateNotetext',
		        data: {note_id: note_id, content: content},
		        async: false,
		        success: 	function (data) {
						    	if(data != "norowsaffected"){
						    		loginfo("createNote.js", "updateNote", "Updated content text of note "+note_id);
						    		changes++;
								}else{
									logwarning("createNote.js", "updateNote", "Unable to update content text of note "+note_id);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "updateNote", "Can't reach servlet updateNotetext or it throws an error");
								errors++;
							}
		    });
		}
		
		/**
		 * Perform a level change
		 */
		if(s_level != e_level){
			var level = e_level;
			loginfo("createNote.js", "updateNote", "Priority/Level of note "+note_id+" has changed");
			$.ajax({
		        type: "POST",
		        url: './updateNotelevel',
		        data: {note_id: note_id, level: level},
		        async: false,
		        success: 	function (data) {
						    	if(data != "norowsaffected"){
						    		$(source).attr('data-level_id', level) //Workaround because the unlock of the note will regain the level color over this foreign key. Otherwise the unlock would override the changes with the old value
						    		loginfo("createNote.js", "updateNote", "Updated priority/level of note "+note_id);
						    		changes++;
								}else{
									logwarning("createNote.js", "updateNote", "Unable to update priority/level of note "+note_id);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "updateNote", "Can't reach servlet updateNotelevel or it throws an error");
								errors++;
							}
		    });
		}
		
		/**
		 * Perform a color change
		 */
		if(s_color != e_color){
			var color = e_color
			loginfo("createNote.js", "updateNote", "Colorsheme of note "+note_id+" has changed");
			$.ajax({
		        type: "POST",
		        url: './updateNotecolors',
		        data: {note_id: note_id, color: color},
		        async: false,
		        success: 	function (data) {
						    	if(data != "norowsaffected"){
						    		loginfo("createNote.js", "updateNote", "Updated colorsheme of note "+note_id);
						    		changes++;
								}else{
									logwarning("createNote.js", "updateNote", "Unable to update colorsheme of note "+note_id);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "updateNote", "Can't reach servlet updateNotecolors or it throws an error");
								errors++;
							}
		    });
		}
		
		/**
		 * Add new attachments
		 */
		if(added_attachments != ""){
			loginfo("createNote.js", "updateNote", "Got new attachments which reference note "+note_id);
			$.ajax({
		        type: "POST",
		        url: './addAttachments',
		        data: {note_id: note_id, attachments: added_attachments},
		        async: false,
		        success: 	function (data) {
						    	if(data != "norowsaffected"){
						    		loginfo("createNote.js", "updateNote", "Added new attachments to note "+note_id);
						    		changes++;
								}else{
									logwarning("createNote.js", "updateNote", "Unable to add new attachments to "+note_id);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "updateNote", "Can't reach servlet addAttachments or it throws an error");
								errors++;
							}
		    });
		}
		
		/**
		 * Add editor when something has changed
		 */
		if(changes > 0){
			loginfo("createNote.js", "updateNote", "You've changed note "+note_id);
			$.ajax({
		        type: "POST",
		        url: './addEditor',
		        data: {note_id: note_id},
		        success: 	function () {
					    		loginfo("createNote.js", "updateNote", "Added editor to note "+note_id);
					    		changes++;
					     	},
				error:		function(){
								logerror("createNote.js", "updateNote", "Can't reach servlet addEditor or it throws an error");
								errors++;
							}
		    });
		}
		
		if(errors > 0){
			handleError(error_unspecified, error_wedontknow);
		}
		$('#createNoteOverlay_close').click(); //close the popover now
		
	}else{
		handleError(error_handle_edit, error_handle_edit_eas);
		logerror("createNote.js", "updateNote", "Would try to compare the source note with the editor but one of them was not found");
	}
	
}

/**
 * This adds the tooltips to the editor
 */
function addTooltips(){
	$('#createNoteOverlay_resize').mouseover(function(){
		showTT($(this), note_resize);
	});
	
	$('#createNoteOverlay_apply').mouseover(function(){
		showTT($(this), note_apply);
	});
	
	$('#createNoteOverlay_close').mouseover(function(){
		showTT($(this), note_discard);
	});
	
	$('#createNoteOverlay note_attachementpiece_add').mouseover(function(){
		showTT($(this), note_add_attachement);
	});
	
	$('#createNoteOverlay div.note_attachmentpiece_image').mouseover(function(){
		showTT($(this), attachment_image);
	})
	
	$('#createNoteOverlay div.note_attachmentpiece_doc').mouseover(function(){
		showTT($(this), attachment_doc);
	})
	
	$('#createNoteOverlay div.note_attachmentpiece_archiv').mouseover(function(){
		showTT($(this), attachment_archiv);
	})
	
	$('#createNoteOverlay div.note_attachmentpiece_media').mouseover(function(){
		showTT($(this), attachment_media);
	})
	
	$('#edit_icon_bold').mouseover(function(){
		showTT(this, note_edit_bold);
	});
	$('#edit_icon_italic').mouseover(function(){
		showTT(this, note_edit_italic);
	});
	$('#edit_icon_underlined').mouseover(function(){
		showTT(this, note_edit_underlined);
	});
	$('#edit_icon_image').mouseover(function(){
		showTT(this, note_edit_image);
	});
	$('#edit_icon_video').mouseover(function(){
		showTT(this, note_edit_video);
	});
	$('#edit_icon_table').mouseover(function(){
		showTT(this, note_edit_table);
	});
	$('#edit_icon_timer').mouseover(function(){
		showTT(this, note_edit_timer);
	});
	
	$('#createNoteOverlay_prioselect').mouseover(function(e){
		if($(e.target).is('option')){
			var tooltip = $(e.target).attr("data-description"); //does not work in Chrome for some reasons.
			showTT(this, tooltip);
		}
	});
}

/**
 * This will reorder the edit icons while the user is resizing his new note
 */
function reorderEditOptions(){
	var elements_width = $('.option_icon_small').outerWidth(true);
	var elements_height = 0;
	var element_height = $('.option_icon_small').outerHeight(true);
	var parts = 0;
	$('.option_icon_small').each(function() {
		elements_height = elements_height + element_height;
		parts++;
	});
	var holder_height = $('#createNoteOverlay_editoptions_holder').height();
	var holder_width = $('#createNoteOverlay_editoptions_holder').width();
	var rows = Math.floor(holder_height / element_height);
	var cells;
	cells = Math.ceil(parts / rows);
	$('#createNoteOverlay_editoptions_holder').width(cells * elements_width);
	setTimeout(reorderEditOptions, 64);
}

/**
 * Use this to make the source visible/invisible if the editor is used to edit a note
 * @param bool
 */
function sourceVisible(bool){
	var editor = $("div#createNoteOverlay");
	var mode = $(editor).attr("data-mode");
	if(mode == "edit"){
		var sourceid = $(editor).attr("data-edittarget");
		var source = $("div.oneNote[data-id="+sourceid+"]");
		if(bool == true){
			$(source).fadeTo(500, 100);
		}
		if(bool == false){
			$(source).fadeTo(500, 0);
		}
	}
}

/**
 * This locks the note for some seconds -> defined in the serverside Notecontent class
 * @param callback
 */
function initLock(callback){
	var editor = $("div#createNoteOverlay");
	var sourceid = parseInt($(editor).attr("data-edittarget"));
	$.ajax({
        type: "POST",
        data: {note_id: sourceid},
        url: './initLock',
        success: 	function (data) {
        				if(data == "norowsaffected"){
        					logwarning("createNote.js", "initLock", "Can't initial lock note - you can proceed but someone could disturb your changes after you saved the note");
        					handleError(error_cant_lock_note, error_cant_lock_note_i);
        				}else{
        					loginfo("createNote.js", "initLock", "Initial locked note for other users");
        				}
			        	if(callback && typeof(callback) === "function" ){
			        		callback();
			        	}
			     	},
		error:		function(){
						logerror("createNote.js", "initLock", "Can't initial lock note - servlet ./initLock is unreachable or throws an error - you can proceed but someone could disturb your changes after you saved the note");
						handleError(error_cant_lock_note, error_cant_lock_note_i);
					}
    });
}

/**
 * This sends automatically lock commands to the server while the user is editing. If it doesn't the note will be unlocked for other users after few seconds
 * @param intervall
 */
function lockLoop(intervall){
	var editor = $("div#createNoteOverlay");
	var sourceid = parseInt($(editor).attr("data-edittarget"));
	! function loop(){
		if($("div#createNoteOverlay").length > 0 && allPerformed == false){
			$.ajax({
		        type: "POST",
		        data: {note_id: sourceid},
		        url: './updateLock',
		        success: 	function (data) {
						    	if(data == "norowsaffected"){
						    		logwarning("createNote.js", "lockLoop", "Can't update note lock - you can proceed but someone could disturb your changes after you saved the note");
								}else{
									loginfo("createNote.js", "lockLoop", "Updated note lock");
									setTimeout(loop, intervall);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "lockLoop", "Can't update note lock - servlet ./updateLock is unreachable or throws an error - you can proceed but someone could disturb your changes after you saved the note");
							}
		    });
		}
	}();
}

/**
 * This stops the lock of a note with the given id
 * @param note_id
 */
function stopLock(note_id){
	$.ajax({
        type: "POST",
        data: {note_id: note_id},
        url: './stopLock',
        success: 	function (data) {
        				if(data == "norowsaffected"){
        					logwarning("createNote.js", "stopLock", "Can't unlock note - Most possible reason is that your ip changed until you've edited the note");
        				}else{
        					loginfo("createNote.js", "stopLock", "Unlocked note for other users");
        				}
			     	},
		error:		function(){
						logerror("createNote.js", "stopLock", "Can't unlock note - servlet ./stopLock is unreachable or throws an error - Don't worry the note will unlock itself after few seconds");
					}
    });
}

/**
 * This removes files and or db entrys from a saved or updated note which are not longer needed
 */
function cleanattachments(){
	var editor = $("div#createNoteOverlay");
	var sourceid = parseInt($(editor).attr("data-edittarget"));
	
	loginfo("createNote.js", "cleanattachments", "Remove unused attachments from DB and/or file host");
	
	//Remove canceled attachment files
	for(var i = 0; i < removedAttachments.length; i++){
		var thislink = removedAttachments[i][0];
		var attid = removedAttachments[i][1];
		if(thislink.match("^\./.*")){ //Internal hosted
			var filename = thislink.replace("./upload/", "");
			removeHostedFile(filename)
			if(!isNaN(attid) && !isNaN(sourceid)){
				removeDBAttachmentEntry(attid, sourceid);
			}

		}else{ //external hosted
			if(!isNaN(attid) && !isNaN(sourceid)){
				removeDBAttachmentEntry(attid, sourceid);
			}
		}
	}
	
	function removeHostedFile(filename){
		$.ajax({
	        type: "POST",
	        url: './removefile',
	        data: {filename: filename},
	        success: 	function (data) {
					    	if(data != "notfound"){
					    		loginfo("createNote.js", "removeHostedFile", "Removed the file " + filename + " from file host");
							}else{
								logwarning("createNote.js", "removeHostedFile", "Can't remove the file " + filename + " from file host - file not found");
							}
				     	},
			error:		function(){
							logerror("createNote.js", "removeHostedFile", "Can't reach servlet ./removefile or it throws an error");
						}
	    });
	}
	
	function removeDBAttachmentEntry(attachment_id, note_id){
		if(attachment_id != "" && note_id != ""){
			$.ajax({
		        type: "POST",
		        url: './removeAttachment',
		        data: {note_id: note_id, attachment_id: attachment_id},
		        success: 	function (data) {
						    	if(data != "norowsaffected"){
						    		loginfo("createNote.js", "removeDBAttachmentEntry", "Removed the attachment " + attachment_id + " from note " + note_id);
								}else{
									logwarning("createNote.js", "removeDBAttachmentEntry", "Can't remove the attachment " + attachment_id + " from note " + note_id);
								}
					     	},
				error:		function(){
								logerror("createNote.js", "removeDBAttachmentEntry", "Can't reach servlet ./removeAttachment or it throws an error");
							}
		    });
		}
	}
}

