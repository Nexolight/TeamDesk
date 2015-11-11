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

$('#popover_AddAttachment').ready(function(){
	
	var fullpath = "";
	
	$('#popover_browse').click(function(){
		$('#popover_fileorigin').click();
	});
	
	$('#popover_fileorigin').change(function(){
		if($('#popover_fileorigin').val() != ""){
			var path = $('#popover_fileorigin').val();
			$('#popover_file').val(path);
			var ext = "." + path.split('.').pop();
			fullpath = "./upload/" + getUnique() + ext;
			$('#popover_AddAtt_path').val(fullpath);
			$('#popover_AddAtt_name').val(path.split('\\').pop());
		}
	});
	
	$('#popover_AddAtt_path').click(function(){
		if($('#popover_file').val() != "" || $('#popover_fileorigin').val() != ""){
			$('#popover_AddAtt_path').val("");
			$('#popover_file').val("");
			$('#popover_fileorigin').val("");
			$('#popover_AddAtt_name').val("");
			fullpath = "";
		}
	});
	
	$('#popover_AddAtt_path').keyup(function(){
		if(fullpath == ""){
			$('#popover_AddAtt_name').val($('#popover_AddAtt_path').val().split('/').pop()); 
		}
	});
	
	$('#popover_AddAtt_path').change(function(){
		if(fullpath == ""){
			$('#popover_AddAtt_name').val($('#popover_AddAtt_path').val().split('/').pop()); 
		}
	});
	
	$('#popover_apply').click(function(){
		var filename;
		var finallink;
		if(fullpath != ""){
			filename = fullpath.split('/').pop();
			finallink = fullpath;
		}else{
			filename = $('#popover_AddAtt_path').val().split('/').pop();
			finallink = $('#popover_AddAtt_path').val();
		}
		var ext = filename.split('.').pop();
		
		//The input field containing the url
		if($('#popover_AddAtt_path').val() != 0){
			
			//The input field with the name of the file to upload.
			if($('#popover_file').val() != 0){
				if(fullpath != ""){
					uploadFile(document.getElementById('popover_fileorigin').files[0], filename, function(){
						var filesize = document.getElementById('popover_fileorigin').files[0].size;
						insertAttachment(checkExtenssionType(filename), finallink, ext, $('#popover_AddAtt_name').val(), filesize);
						closePopover();
					});
				}else{
					handleError(error_unspecified, error_filepath_rec)
				}
			}else{
				insertAttachment(checkExtenssionType(filename), $('#popover_AddAtt_path').val(), ext, $('#popover_AddAtt_name').val(), null);
				closePopover();
			}
		}
		
	});
});