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

$('#popover_AddTable').ready(function(){
	var notewidth = Math.round($('#createNoteOverlay_notecontent').width())
	var noteheight = Math.round($('#createNoteOverlay_notecontent').height())
	$('#popover_apply').click(function(){
		var cols = $('#popover_AddTable_Cols').val();
		var colX = $('#popover_AddTable_ColumnX').val();
		var rows = $('#popover_AddTable_Rows').val();
		var rowY = $('#popover_AddTable_RowY').val();
		var scaleX = $('#popover_AddTable_sizeX').val();
		var scaleY = $('#popover_AddTable_sizeY').val();
		var headerTop = $('#popover_AddTable_HeaderTop').is(':checked');
		var headerLeft = $('#popover_AddTable_HeaderLeft').is(':checked');
		var zebra = $('#popover_AddTable_Zebra').is(':checked');
		
		if(scaleX.match("^([0-9]*)$|^$")&&
				scaleY.match("^([0-9]*)$|^$")&&
				rows.match("^([0-9]*)$|^$")&&
				rowY.match("^([0-9]*)$|^$")&&
				cols.match("^([0-9]*)$|^$")&&
				colX.match("^([0-9]*)$|^$")
			){
			
			if((!isNaN(scaleX) && parseInt(scaleX) > notewidth) || (!isNaN(scaleY) && parseInt(scaleY) > noteheight)){
				if(!isNaN(scaleX) && parseInt(scaleX) > notewidth){
					$('#popover_AddTable_sizeX').val(notewidth);
				}
				if(!isNaN(scaleY) && parseInt(scaleY) > noteheight){
					$('#popover_AddTable_sizeY').val(noteheight);
				}
				showWarning(warn_popover_oversized_element, 2500);
			}else{
				if(cols > 0 && rows > 0){
					var tabletag;
					//Both cases at the same time are impossible because of some other functions in this file.
					if((colX > 0 && rowY > 0) || (scaleX > 0 && scaleY > 0)){
						var cellwidth;
						var cellheight;
						if(colX > 0 && rowY > 0){
							cellwidth = colX;
							cellheight = rowY;
						}else if (scaleX > 0 && scaleY > 0){
							cellwidth = Math.round(scaleX / cols);
							cellheight = Math.round(scaleY / rows);
						}
						if(zebra == true){
							tabletag = "<table class='notetable_zebra'>";
						}else{
							tabletag = "<table class='notetable'>";
						}
						var firstrow = true;
						var actrow = 0;
						for(var i = 0; i < rows; i++){
							var firstcol = true;
							tabletag += "<tr class='notetable'>";
							if(firstrow == true && headerTop == true){
								for(var i2 = 0; i2 < cols; i2++){
									if(zebra == true){
										tabletag += "<th class='notetable_zebra' style='padding:2px;height:"+(cellheight - 4)+"px;width:"+(cellwidth - 4)+"px;'></th>";
									}else{
										tabletag += "<th class='notetable' style='padding:2px;height:"+(cellheight - 4)+"px;width:"+(cellwidth - 4)+"px;'></th>";
									}
								}
								firstrow = false;
							}else{
								for(var i2 = 0; i2 < cols; i2++){
									if(firstcol == true && headerLeft == true){
										if(zebra == true){
											tabletag += "<th class='notetable_zebra' style='padding:2px;height:"+(cellheight - 4)+"px;width:"+(cellwidth - 4)+"px;'></th>";
										}else{
											tabletag += "<th class='notetable' style='padding:2px;height:"+(cellheight - 4)+"px;width:"+(cellwidth - 4)+"px;'></th>";
										}
										firstcol = false;
									}else{
										if(zebra == true){
											if(actrow % 2 == 0){
												tabletag += "<td class='notetable_zebra_1' style='padding:2px;height:"+(cellheight - 4)+"px;width:"+(cellwidth - 4)+"px;'></td>";
											}else{
												tabletag += "<td class='notetable_zebra_0' style='padding:2px;height:"+(cellheight - 4)+"px;width:"+(cellwidth - 4)+"px;'></td>";
											}
										}else{
											tabletag += "<td class='notetable' style='padding:2px;height:"+(cellheight - 4)+"px;width:"+(cellwidth - 4)+"px;'></td>";
										}
									}
								}
							}
							tabletag += "</tr>";
							actrow++;
						}
						insertTag(tabletag,50);
						closePopover();
					}else{
						handleError(error_false_input, error_no_table_size);
					}
				}else{
					handleError(error_false_input, error_no_colrow_value);
				}
			}
		}else{
			handleError(error_false_input, error_false_table_values);
		}
	});
	
	//update the recommended column width
	$('#popover_AddTable_Cols').change(function(){
		if($('#popover_AddTable_Cols').val().match("^([0-9]*)$") && $('#popover_AddTable_Cols').val() > 0){
			$('#popover_AddTable_ColumnX_Recommendation').html("<i>... "+ Math.round((notewidth / $('#popover_AddTable_Cols').val()))+"px?</i>");
		}else{
			$('#popover_AddTable_ColumnX_Recommendation').html("");
		}
	});
	
	//update the recommended row height
	$('#popover_AddTable_Rows').change(function(){
		if($('#popover_AddTable_Rows').val().match("^([0-9]*)$") && $('#popover_AddTable_Rows').val() > 0){
			$('#popover_AddTable_RowY_Recommendation').html("<i>... "+(parseInt($('#createNoteOverlay_notecontent').css("font-size").replace("px","")) + 8)+"px?</i>");
		}else{
			$('#popover_AddTable_RowY_Recommendation').html("");
		}
	});
	
	//add the recommend absolute size of the table
	$('#popover_AddTable_Table_Recommendation').html("<i>... "+notewidth+" x "+noteheight+"px?</i>");
	
	$('#popover_AddTable_ColumnX').click(function(){
		//clear the other size option
		if($('#popover_AddTable_sizeX').val() != null || $('#popover_AddTable_sizeY').val() != null){
			$('#popover_AddTable_sizeX').val("");
			$('#popover_AddTable_sizeY').val("");
		}
	})
	
	$('#popover_AddTable_RowY').click(function(){
		//clear the other size option
		if($('#popover_AddTable_sizeX').val() != null || $('#popover_AddTable_sizeY').val() != null){
			$('#popover_AddTable_sizeX').val("");
			$('#popover_AddTable_sizeY').val("");
		}
	})
	
	$('#popover_AddTable_sizeX').click(function(){
		//clear the other size option
		if($('#popover_AddTable_ColumnX').val() != null || $('#popover_AddTable_RowY').val() != null){
			$('#popover_AddTable_ColumnX').val("");
			$('#popover_AddTable_RowY').val("");
		}
	})
	
	$('#popover_AddTable_sizeY').click(function(){
		//clear the other size option
		if($('#popover_AddTable_ColumnX').val() != null || $('#popover_AddTable_RowY').val() != null){
			$('#popover_AddTable_ColumnX').val("");
			$('#popover_AddTable_RowY').val("");
		}
	})
	
});