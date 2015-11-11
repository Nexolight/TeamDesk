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

$('#popover_AddImage').ready(function(){
	var fullpath = "";
	var maxXSize = Math.round($('#createNoteOverlay_notecontent').width())
	var maxYSize = Math.round($('#createNoteOverlay_notecontent').height())
	
	$('#popover_AddImage_sizeX').val(maxXSize);
	
	$('#popover_browse').click(function(){
		$('#popover_fileorigin').click();
	});
	
	$('#popover_fileorigin').change(function(){
		if($('#popover_fileorigin').val() != ""){
			var path = $('#popover_fileorigin').val();
			$('#popover_file').val(path);
			var ext = "." + path.split('.').pop();
			fullpath = "./upload/" + getUnique() + ext;
			$('#popover_AddImage_path').val(fullpath);
		}
	});
	
	$('#popover_AddImage_path').click(function(){
		if($('#popover_file').val() != "" || $('#popover_fileorigin').val() != ""){
			$('#popover_AddImage_path').val("");
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
			filename = $('#popover_AddImage_path').val().split('/').pop();
			finallink = $('#popover_AddImage_path').val();
		}
		if(filename != ""){
			if(checkExtenssionSupport(filename, "image")){
				var scaleX = $('#popover_AddImage_sizeX').val();
				var scaleY = $('#popover_AddImage_sizeY').val();
				if(scaleX.match("^([0-9]*)$|^$") && scaleY.match("^([0-9]*)$|^$")){
					if((!isNaN(scaleX) && parseInt(scaleX) > maxXSize) || (!isNaN(scaleY) && parseInt(scaleY) > maxYSize)){
						if(!isNaN(scaleX) && parseInt(scaleX) > maxXSize){
							$('#popover_AddImage_sizeX').val(maxXSize);
						}
						if(!isNaN(scaleY) && parseInt(scaleY) > maxYSize){
							$('#popover_AddImage_sizeY').val(maxYSize);
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
						if(fullpath != ""){
							uploadFile(document.getElementById('popover_fileorigin').files[0], filename, function(){
								closePopover();
								insertTag("<img "+style+" src='"+finallink+"'></img>");
							});
						}else{
							closePopover();
							insertTag("<img "+style+" src='"+finallink+"'></img>");
						}
					}
				}else{
					handleError(error_false_input, error_false_image_resize);
				}
			}else{
				handleError(error_false_datatype, error_use_image);
			}
		}
	});
});