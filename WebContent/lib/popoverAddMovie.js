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

$('#popover_AddMovie').ready(function(){
	
	var fullpath = "";
	var maxXSize = Math.round($('#createNoteOverlay_notecontent').width())
	var maxYSize = Math.round($('#createNoteOverlay_notecontent').height())
		
	$('#popover_AddMovie_sizeX').val(maxXSize);
	
	$('#popover_browse').click(function(){
		$('#popover_fileorigin').click();
	});
	
	$('#popover_fileorigin').change(function(){
		if($('#popover_fileorigin').val() != ""){
			var path = $('#popover_fileorigin').val();
			$('#popover_file').val(path);
			var ext = "." + path.split('.').pop();
			fullpath = "./upload/" + getUnique() + ext;
			$('#popover_AddMovie_path').val(fullpath);
		}
	});
	
	$('#popover_AddMovie_path').click(function(){
		if($('#popover_file').val() != "" || $('#popover_fileorigin').val() != ""){
			$('#popover_AddMovie_path').val("");
			$('#popover_file').val("");
			$('#popover_fileorigin').val("");
			fullpath = "";
		}
	});
	
	$('#popover_apply').click(function(){
		var filename;
		var finallink;
		if(fullpath != ""){
			filename = fullpath.split('/').pop();
			finallink = fullpath;
		}else{
			filename = $('#popover_AddMovie_path').val().split('/').pop();
			finallink = $('#popover_AddMovie_path').val();
		}
		//The input field containing the url
		if($('#popover_AddMovie_path').val() != 0){
			var scaleX = $('#popover_AddMovie_sizeX').val();
			var scaleY = $('#popover_AddMovie_sizeY').val();
			if(scaleX.match("^([0-9]*)$|^$") && scaleY.match("^([0-9]*)$|^$")){
				
				if((!isNaN(scaleX) && parseInt(scaleX) > maxXSize) || (!isNaN(scaleY) && parseInt(scaleY) > maxYSize)){
					if(!isNaN(scaleX) && parseInt(scaleX) > maxXSize){
						$('#popover_AddMovie_sizeX').val(maxXSize);
					}
					if(!isNaN(scaleY) && parseInt(scaleY) > maxYSize){
						$('#popover_AddMovie_sizeY').val(maxYSize);
					}
					showWarning(warn_popover_oversized_element, 2500);
				}else{
					var style = "";
					if(scaleX != "" && scaleY != ""){
						style = "style='width:"+scaleX+"px;height:"+scaleY+"px;'";
					}else if(scaleX != "" && scaleY == ""){
						style = "style='width:"+scaleX+"px;height:auto;'";
					}else if(scaleX == "" && scaleY != ""){
						style = "style='width:auto;height:"+scaleY+"px;'";
					}
					
					//The input field with the name of the file to upload.
					if($('#popover_file').val() != 0){
						if(checkExtenssionSupport(filename, "video")){
							if(fullpath != ""){
								uploadFile(document.getElementById('popover_fileorigin').files[0], filename, function(){
									var ext = filename.split('.').pop().toLowerCase();
									var uniqueFrame = getUnique();
									var uniqueHolder = getUnique();
									insertTag("" +
											"<div id='"+uniqueHolder+"' contenteditable='false' unselectable='on' class='videoholder' data-videolink='"+finallink+"' data-type='"+ext+"' data-vwidth='' data-vheight='' data-host='internal'>" +
												"<video unselectable='on' id='"+uniqueFrame+"' class='projekktor' "+style+">" +
													"<source src='"+finallink+"' type='video/"+ext+"' />" +
												"</video>" +
											"</div>", 50);
									$('#'+uniqueFrame).ready(function(){
										setTimeout(function(){
											//Projekktor dont like the auto attribute but the browsers do, so this will gain the value in pixels
											var width = $('#'+uniqueFrame).width();
											var height = $('#'+uniqueFrame).height();
											$('#'+uniqueFrame).height(height);
											$('#'+uniqueFrame).width(width);
											projekktor('#'+uniqueFrame,{
												volume: 0.8,
												playerFlashMP4: './lib/projekktor/swf/StrobeMediaPlayback/StrobeMediaPlayback.swf',
												playerFlashMP3: './lib/projekktor/swf/StrobeMediaPlayback/StrobeMediaPlayback.swf',
												controls: true
											}, function(player){
												window.p = player;
											});
											resizableElement($("#"+uniqueFrame)); //from createNote.js
										}, 50);
									})
									closePopover();
								});
							}else{
								handleError(error_unspecified, error_filepath_rec)
							}
						}else{
							handleError(error_false_datatype, error_use_video);
						}
					}else{
						var uniqueFrame = getUnique();
						var grabframe = autograb($('#popover_AddMovie_path').val(), style ,uniqueFrame);
						if(grabframe != null){
							insertTag(grabframe, 50);
						}else{
							handleError(error_autograb, error_autograb_unsupported);
						}
						setTimeout(function(){
							resizableElement($("#"+uniqueFrame)) //from createNote.js
						},50);
						closePopover();
					}
				}
			}else{
				handleError(error_false_input, error_false_video_resize);
			}
		}
	});
});

/**
 * This will get a normalized iframe or embled code which can be included into the notes.
 * This isn't very accurate because of the different sites. I'm sorry for it but there's nothing I can do
 * @param stuff The full URL to the page which contains the video
 * @param style contains the width and height of the frame.
 * @param uniqueFrame an ID for the frame to access it later
 * @return {String} some html code.
 */
function autograb(stuff, style, uniqueFrame){
	var embedsrc = null;
	var grabbed = null;
	
	//youtube.com -- Works 01.10.2014
	if(stuff.match(new RegExp("((http(s)?://(www\.)?)|(www\.)|\s)(youtu\.be|youtube\.com)/watch.*", ""))){	
		embedsrc = "//www.youtube.com/embed/" + stuff.split("=")[1].split("&")[0] + "";
		grabbed = 	"<div contenteditable='false' class='videoholder' data-host='external'>" +
						"<iframe frameborder='0' scrolling='no' allowfullscreen='true' id='"+uniqueFrame+"' "+style+" class='videoframe' src='"+embedsrc+"'></iframe>" +
					"</div>";
	}
	
	//myvideo.ch -- Buggy 01.10.2014
	if(stuff.match(new RegExp("((http(s)?://(www\.)?)|(www\.)|\s)(myvideo\.ch)/watch/.*", ""))){
		embedsrc = "//www.myvideo.ch/embed/" + stuff.split("/")[stuff.split("/").length - 1];
		grabbed = 	"<div contenteditable='false' class='videoholder' data-host='external'>" +
						"<iframe frameborder='0' scrolling='no' allowfullscreen='true' id='"+uniqueFrame+"' "+style+" class='videoframe' src='"+embedsrc+"'></iframe>" +
					"</div>";
	}
	
	//clipfish.de -- Works 18.08.2014
	if(stuff.match(new RegExp("((http(s)?://(www\.)?)|(www\.)|\s)(clipfish\.de)/.*", ""))){
		var pieces = stuff.split("/");
		var vidnr = pieces[pieces.indexOf("video") + 1];
		embedsrc = "//www.clipfish.de/embed_video/?vid=" + vidnr + "&as=0";
		grabbed = 	"<div contenteditable='false' class='videoholder' data-host='external'>" +
						"<iframe frameborder='0' scrolling='no' allowfullscreen='true' id='"+uniqueFrame+"' "+style+" class='videoframe' src='"+embedsrc+"'></iframe>" +
					"</div>";
	}
	
	//metacafe.com -- Works 18.08.2014 //01.10.2014 -> broken
	if(stuff.match(new RegExp("((http(s)?://(www\.)?)|(www\.)|\s)(metacafe\.com)/watch/.*", ""))){
		embedsrc = "//www.metacafe.com/embed/" + stuff.split("/")[4];
		grabbed = 	"<div contenteditable='false' class='videoholder' data-host='external'>" +
						"<iframe frameborder='0' scrolling='no' allowfullscreen='true' id='"+uniqueFrame+"' "+style+" class='videoframe' src='"+embedsrc+"'></iframe>" +
					"</div>";
	}
	
	if(grabbed != null){
		return grabbed;
	}else{
		return null;
	}
}