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

$('#popover_SetTimer').ready(function(){
	
	var editor = $("div#createNoteOverlay");
	
	//Set the default dates depending on a editing or new note. New ones dont have a filled in data-displaydate, data-displaytime, data-archivedate or data-archivetime
	var datenow;
	var timenow;
	var archiedate;
	var archivetime;
	if($(editor).attr("data-displaydate") != "" &&  $(editor).attr("data-displaytime") != ""){
		datenow = $(editor).attr("data-displaydate");
		timenow = $(editor).attr("data-displaytime");
	}else{
		datenow = $('#popover_SetTimer').data('datenow');
		timenow = $('#popover_SetTimer').data('timenow');
	}
	
	if($(editor).attr("data-archivedate") != "" && $(editor).attr("data-archivetime")){
		archiedate = $(editor).attr("data-archivedate");
		archivetime = $(editor).attr("data-archivetime");
	}else{
		archiedate = "";
		archivetime = "";
	}
	
	//Set them as default displaytime
	$('#popover_SetTimer_Displaydate').val(datenow);
	$('#popover_SetTimer_Displaytime').val(timenow);
	$('#popover_SetTimer_Archivedate').val(archiedate);
	$('#popover_SetTimer_Archivetime').val(archivetime);
	
	//Check and apply the timer
	$('#popover_apply').click(function(){
		
		var displaydate = $('#popover_SetTimer_Displaydate').val();
		var displaytime = $('#popover_SetTimer_Displaytime').val();
		var archivedate = $('#popover_SetTimer_Archivedate').val();
		var archivetime = $('#popover_SetTimer_Archivetime').val();
		var displaydtok	= false;
		var archivedtok = false;

		//Check the dates.... well I don't think this app will be used longer than 100 years ;)
		if(displaydate.match("^[0-3][0-9]\.[0-1][0-9]\.2[0-1][0-9][0-9]") && 
				displaytime.match("^[0-2][0-9]:[0-5][0-9]|^$") && 
				archivedate.match("^[0-3][0-9]\.[0-1][0-9]\.2[0-1][0-9][0-9]|^$") &&
				archivetime.match("^[0-2][0-9]:[0-5][0-9]|^$")
				){
			
			if(displaydate != "" && displaytime != ""){
				if((parseInt(displaydate.split(".")[0]) <= 31 && parseInt(displaydate.split(".")[1]) <= 12 && parseInt(displaydate.split(".")[2]) <= 2114) && (parseInt(displaytime.split(":")[0]) <= 23 && parseInt(displaytime.split(":")[1]) <= 59)){
					displaydtok = true;
				}
			}else if(displaydate != "" && displaytime == ""){
				if(parseInt(displaydate.split(".")[0]) <= 31 && parseInt(displaydate.split(".")[1]) <= 12 && parseInt(displaydate.split(".")[2]) <= 2114){
					displaytime = "00:00";
					displaydtok = true;
				}
			}
			
			if(archivedate != "" && archivetime != ""){
				if((parseInt(archivedate.split(".")[0]) <= 31 && parseInt(archivedate.split(".")[1]) <= 12 && parseInt(archivedate.split(".")[2]) <= 2114) && (parseInt(archivetime.split(":")[0]) <= 23 && parseInt(archivetime.split(":")[1]) <= 59)){
					archivedtok = true;
				}
			}else if (archivedate == "" && archivetime == ""){
				archivedtok = true;
			}else if(archivedate != "" && archivetime == ""){
				if(parseInt(archivedate.split(".")[0]) <= 31 && parseInt(archivedate.split(".")[1]) <= 12 && parseInt(archivedate.split(".")[2]) <= 2114){
					archivedtok = true;
					archivetime = "00:00";
				}
			}
		}
		
		//At this point the inputs the input format and constellation is ok
		if(displaydtok == true && archivedtok == true){
			$('#createNoteOverlay').attr('data-displaydate', displaydate);
			$('#createNoteOverlay').attr('data-displaytime', displaytime);
			$('#createNoteOverlay').attr('data-archivedate', archivedate);
			$('#createNoteOverlay').attr('data-archivetime', archivetime);
			closePopover();
		}else{
			 handleError(error_false_input, error_invalid_datetime);
		}
	});
});