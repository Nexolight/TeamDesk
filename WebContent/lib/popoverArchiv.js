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

/**
 * Constructor of superTable 
 * You have to add it with superTable.addTo(target) and make it visible with superTable.visible(true)
 * @param idname (string = The used if for the new container)
 */
function superTable(idname){
	loginfo("popoverArchiv.js", "superTable", "Create SuperTable");
	this.st = 	$("<div class='superTableHolder' id='"+idname+"' style='display: hidden;'>" +
				"" +
				"	<div class='filterarea'>" +
				"	</div>" +
				"" +
				"	<div class='dataarea'>" +
				"		<table>" +
				"			<tbody>" +
				"			</tbody>" +
				"		</table>" +
				"	</div>" +
				"" +
				"</div>");
	
	this.filterarea = 	$(this.st).children("div.filterarea:first");
	this.dataarea = 	$(this.st).children("div.dataarea:first");
	this.table = 		$(this.dataarea).children("table:first");
	this.tablebody = 	$(this.table).children("tbody:first");
}

/**
 * This adds a column to the superTable
 * @param position (number = add column at position n - starts from left as 0 and will forward the other columns) (string = 'first' or 'last')
 * @param name (string = The columns visible name)
 * @param type (string = The type of data for which this column will be used 'digit', 'string' or 'htmlobject')
 * @param style (string = just use css like this "text-align:left;font-size:18;" and so on)
 */
superTable.prototype.addCol = function(position, name, type, style){
	loginfo("popoverArchiv.js", "superTable.prototype.addCol", "Add column to table");
	var firstrow = 	$(this.tablebody).children("tr:first");
	if(!style){
		style = "";
	}
	if($(firstrow).length == 0){
		var newrow = $("<tr>" +
					 "</tr>");
		$(this.tablebody).append($(newrow));
		firstrow = $(newrow);
	}
	if(isNaN(position)){
		switch(position){
		case "first": 
			position = 0;
			break;
		case "last": 
			position = $(firstrow).children("th").length;
			break;
		}
	}else{
		if(position < 0){
			position = 0;
		}else if (position > $(firstrow).children("th").length){
			position = $(firstrow).children("th").length;
		}
	}
	
	var filterinput = "";
	var sorticon = "sorticon sorticon_nosort";
	if(type == "htmlobject"){
		filterinput = "disabled";
		sorticon = "sorticon_sortdisabled";
	}
	
	var newfilter =	$("<div class='filtercolumn' data-position='' data-type='"+type+"'>" +
					"	<div class='filtersubcolumn orderholder'>" +
					"		<div class='"+sorticon+"'></div>" +
					"	</div>" +
					"	<div class='filtersubcolumn filterholder'>" +
					"		<input type='text' class='filterinput' "+filterinput+"></div>" +
					"	</div>" +
					"</div>");
	var newcol = 	$("<th data-position='' style='"+style+"'>" + name + "</th>");
	if($(firstrow).children("th").length > 0){
		if(position < $(firstrow).children("th").length){
			$(firstrow).children("th").eq(position).before($(newcol));
			$(this.filterarea).children("div.filtercolumn").eq(position).before($(newfilter));
		}else{
			$(firstrow).append($(newcol));
			$(this.filterarea).append($(newfilter));
		}
	}else{
		$(firstrow).append($(newcol));
		$(this.filterarea).append($(newfilter));
	}
	var count = 0;
	$(firstrow).children("th").each(function(){
		$(this).attr("data-position", count);
		count++;
	});
	count = 0;
	$(this.filterarea).children("div.filtercolumn").each(function(){
		$(this).attr("data-position", count);
		$(this).width($(firstrow).children("th[data-position='"+count+"']").width())
		count++;
	});
	
	var ordertrigger = $(newfilter).children("div.orderholder");
	var filtertrigger = $(newfilter).children("div.filterholder").children("input.filterinput");
	var mycol = parseInt($(newfilter).attr("data-position"));
	var myinstance = this;
	
	if(type != "htmlobject"){
		$(ordertrigger).click(function(){
			var classname = $(this).find("div.sorticon").attr("class").replace("sorticon ", "");
			if(classname == "sorticon_nosort"){
				myinstance.sort(mycol, "asc");
			}
			
			if(classname == "sorticon_asc"){
				myinstance.sort(mycol, "desc");
			}
			
			if(classname == "sorticon_desc"){
				myinstance.sort(mycol, "asc");
			}
		});
		
		$(filtertrigger).keyup(function(){
			myinstance.filterAll();
		});
	}
}

/**
 * This removes the given row from the table
 * @param row (int = the row number. it starts at 0 at the first data row.
 */
superTable.prototype.removeRow = function(row){
	loginfo("popoverArchiv.js", "superTable.prototype.removeRow", "Remove row: " + row);
	var tablebody = $(this.tablebody);
	var rows = $(tablebody).children("tr").slice(1);
	$(rows).eq(row).fadeOut(500, function(){
		setTimeout(function(){
			$(rows).eq(row).remove();
			rows = $(tablebody).children("tr").slice(1);
			$(rows).each(function(index){
				$(this).attr("data-row", index);
			});
			
		},500);
	});
}

/**
 * This will filter the table depending on the filter input fields.
 */
superTable.prototype.filterAll = function(){
	loginfo("popoverArchiv.js", "superTable.prototype.filterAll", "Refilter table");
	var filtercols = $(this.filterarea).children();
	var rows = $(this.tablebody).children("tr").slice(1);
	$(rows).show();
	$(filtercols).each(function(index){
		var type = $(this).attr("data-type");
		var filterby = $(this).find("input.filterinput").val();
		var colindex = index;
		if(filterby.length > 0){
			loginfo("popoverArchiv.js", "superTable.prototype.filterAll", "Column filter:" + colindex + " is not empty - apply filter: '" + filterby + "'.");
			var filtertype = "";
			if(filterby.match(new RegExp("^>=.*")) && type == "digit"){
				filtertype = "biggerthan";
				filterby = filterby.substring(2, filterby.length);
			}else if(filterby.match(new RegExp("^>.*")) && type == "digit"){
				filtertype = "bigger";
				filterby = filterby.substring(1, filterby.length);
			}
			if(filterby.match(new RegExp("^<=.*")) && type == "digit"){
				filtertype = "smalerthan";
				filterby = filterby.substring(2, filterby.length);
			}else if(filterby.match(new RegExp("^<.*")) && type == "digit"){
				filtertype = "smaler";
				filterby = filterby.substring(1, filterby.length);
			}
			if(filterby.match(new RegExp("^=.*"))){
				filtertype = "same";
				filterby = filterby.substring(1, filterby.length);
			}
			
			if(filtertype == ""){
				filtertype = "regex";
			}
			
			$(rows).each(function(){
				var cellcontent = $(this).children("td").eq(colindex).text();
				if(type == "digit" && (filtertype == "bigger" || filtertype == "smaler" || filtertype == "biggerthan" || filtertype == "smalerthan")){
					if(cellcontent == ""){
						$(this).fadeOut(100);
					}else{
						if(filtertype == "bigger"){
							if(!(parseInt(cellcontent) > parseInt(filterby))){
								$(this).fadeOut(100);
							}
						}
						if(filtertype == "smaler"){
							if(!(parseInt(cellcontent) < parseInt(filterby))){
								$(this).fadeOut(100);
							}
						}
						if(filtertype == "biggerthan"){
							if(!(parseInt(cellcontent) >= parseInt(filterby))){
								$(this).fadeOut(100);
							}
						}
						if(filtertype == "smalerthan"){
							if(!(parseInt(cellcontent) <= parseInt(filterby))){
								$(this).fadeOut(100);
							}
						}
					}
				}else{
					if(filtertype == "same"){
						if(cellcontent != filterby){
							$(this).fadeOut(100);
						}
					}else{
						if(!cellcontent.match(new RegExp(filterby, "i"))){
							$(this).fadeOut(100);
							
						}
					}
				}
			});
		}
	});
	var myinstance = this;
	setTimeout(function(){
		myinstance.resizeFilter();
	},125);
}

/**
 * Sorts the table depending on the given column and order
 * @param col (int = the number of the column. 0 is the first one)
 * @param order (string = 'asc', 'desc' or 'noorder')
 */
superTable.prototype.sort = function(col, order){
	loginfo("popoverArchiv.js", "superTable.prototype.sort", "Sort table " + order + " by column " + col);
	var filterarea = $(this.filterarea);
	var sorticons = $(this.filterarea).children("div.filtercolumn").find("div.sorticon");
	var sorticon = $(this.filterarea).children("div.filtercolumn[data-position="+col+"]").first().find("div.sorticon");
	var arrayRows = new Array();
	var rows = $(this.tablebody).children("tr").slice(1);
	var refilterby = $(this.filterarea).children("div.filtercolumn[data-position="+col+"]").first().find("input.filterinput").val();
	$(rows).each(function(){
		var cols = $(this).children("td");
		var arrayCells = new Array();
		var arrayStyles = new Array();
		$(cols).each(function(index){
			var celltype = $(filterarea).children("div.filtercolumn[data-position="+index+"]").attr("data-type");
			
			if(celltype == "string"){
				arrayCells.push($(this).html());
			}
			if(celltype == "digit"){
				if(isNaN($(this).text())){
					arrayCells.push($(this).text());
				}else{
					arrayCells.push(parseInt($(this).text()));
				}
			}
			if(celltype == "htmlobject"){
				arrayCells.push($(this).children().clone(true));
			}
			arrayStyles.push($(this).attr("style"));
		});
		arrayRows.push([arrayCells, arrayStyles]);
	});
	$(sorticons).attr("class", "sorticon sorticon_nosort");
	$(sorticon).attr("class", "sorticon");
	
	var sortedRows = new Array();
	
	if(order == "noorder"){
		$(sorticon).addClass("sorticon_nosort");
		//do nothing else
	}
	
	if(order == "asc"){
		$(sorticon).addClass("sorticon_asc");
		sortedRows = arrayRows.sort(function(a,b){
			if (a[0][col] === b[0][col]) {
		        return 0;
		    }
		    else {
		        return (a[0][col] < b[0][col]) ? -1 : 1;
		    }
		});
	}
	
	if(order == "desc"){
		$(sorticon).addClass("sorticon_desc");
		sortedRows = arrayRows.sort(function(a,b){
			if (a[0][col] === b[0][col]) {
		        return 0;
		    }
		    else {
		        return (a[0][col] < b[0][col]) ? -1 : 1;
		    }
		}).reverse();
	}
	if(sortedRows.length > 0){
		for(var i = 0; i < sortedRows.length; i++){
			var values = sortedRows[i][0];
			var styles = sortedRows[i][1];
			for(var i2 = 0; i2 < sortedRows[i][0].length; i2++){
				this.addCell(i2, i, values[i2], true, styles[i2]);
			}
		}
	}
	this.filterAll();
}

/**
 * This adds content to the given row/col. the col value must be not bigger than the column count. whitespace will be filled up with empty cells.
 * The header of the table don't count as a row, so the first empty field is actually row = 0, col = 0
 * @param col number
 * @param row number
 * @param content whatever you want between the td tag
 * @param override set this to true if you want to override already existing cells
 * @param style (string = just use css like this "text-align:left;font-size:18;" and so on) if 'keep' is given the style will be keept.
 */
superTable.prototype.addCell = function(col, row, content, override, style){
	loginfo("popoverArchiv.js", "superTable.prototype.addCell", "Add cell to table");
	var colcount = $(this.tablebody).children("tr:first").children("th").length;
	var rowcount = $(this.tablebody).children("tr").slice(1).length;
	var rows	 = $(this.tablebody).children("tr").slice(1);
	var tbody	 = $(this.tablebody);
	if(colcount >= col){
		if(rowcount <= row){ //Add empty cells until the row height matches
			for(var i = rowcount; i <= row; i++){
				var tds = "";
				for(var i2 = 0; i2 < colcount; i2++){
					tds  += "<td data-col='"+i2+"'></td>";
				}
				var tr =	$("<tr data-row='"+i+"'>"+tds+"</tr>");
				$(tbody).append(tr);
			}
		}
		
		rows	 		= $(this.tablebody).children("tr").slice(1); //update
		var destcell 	= $(rows).eq(row).children("td").eq(col);
		if(override == true){
			if($(destcell).html() == ""){
				$(destcell).html(content);
			}else{
				$(destcell).html(content);
				loginfo("popoverArchiv.js", "superTable.prototype.addCell", "Override existing cell");
			}
		}else{
			if($(destcell).html() == ""){
				$(destcell).html(content);
			}else{
				loginfo("popoverArchiv.js", "superTable.prototype.addCell", "Cell exist and has content - don't override");
			}
		}
		
		if(style != "keep" && style){
			$(destcell).attr("style", style);
		}else if(style != "keep"){
			$(destcell).attr("style", "");
		}
	}
}

/**
 * Update the size of the filters
 */
superTable.prototype.resizeFilter = function(){
	loginfo("popoverArchiv.js", "superTable.prototype.resizeFilter", "Resize table filters to the same size as the table cols");
	var tbody	 = $(this.tablebody);
	var firstrow = $(tbody).children("tr:first");
	var titleheaders = $(firstrow).children("th");
	var filters = $(this.filterarea);
	$(titleheaders).each(function(){
		var thiscol = $(this).attr("data-position");
		var linkedfilter = $(filters).children("div.filtercolumn[data-position="+thiscol+"]:first");
		var colwidth = $(this).outerWidth(); //with borders
		$(linkedfilter).width(colwidth);
	});
}

/**
 * Returns a int array containing the row numbers which meets the given arguments. Row number starts at 0.
 * @param headcontent regex
 * @param cellcontent regex
 */
superTable.prototype.findRowBy = function(headcontent, cellcontent){
	loginfo("popoverArchiv.js", "superTable.prototype.findRowBy", "Find row by head match '" + headcontent + "' and cell match '" + cellcontent + "'.");
	var tbody	 = $(this.tablebody);
	var rows	 = $(this.tablebody).children("tr").slice(1);
	var cols 	 = $(this.tablebody).children("tr:first").children("th");
	var ret = new Array();

	$(cols).each(function(index){
		if($(cols).eq(index).text().match(headcontent)){
			var headmatch = index;
			loginfo("popoverArchiv.js", "superTable.prototype.findRowBy", "Found head... first match at column: " + headmatch);
			$(rows).each(function(index){
				if($(rows).eq(index).children("td").eq(headmatch).text().match(cellcontent)){
					loginfo("popoverArchiv.js", "superTable.prototype.findRowBy", "Found cell... first match at column: " + headmatch + " and row: " + index);
					ret.push(index);
					return false;
				}
			});
			return false;
		}
	});
	if(ret.length > 0){
		loginfo("popoverArchiv.js", "superTable.prototype.findRowBy", "Found row number of a specific cell... first match at row: " + ret[0]);
	}else{
		logwarning("popoverArchiv.js", "superTable.prototype.findRowBy", "Can't find any matching cells");
	}
	return ret;
}

/**
 * Returns a int array conaining the column numbers which meets the given arguments. Column number starts at 0.
 * @param headcontent regex
 */
superTable.prototype.findHeadBy = function(headcontent){
	loginfo("popoverArchiv.js", "superTable.prototype.findHeadBy", "Find head by head match '" + headcontent + "'.");
	var heads 	= $(this.tablebody).children("tr:first").children("th");
	var headssize = $(heads).length;
	var ret = new Array();
	for(var i = 0; i < headssize; i++){
		if($(heads).eq(i).text().match(headcontent)){
			ret.push(i);
		}
	}
	if(ret.length > 0){
		loginfo("popoverArchiv.js", "superTable.prototype.findHeadBy", "Found Head... first occurence at column: " + ret[0]);
	}else{
		logwarning("popoverArchiv.js", "superTable.prototype.findHeadBy", "Can't find any matching heads");
	}
	return ret;
}

/**
 * Adds the superTable to the given element
 * @param target
 */
superTable.prototype.addTo = function(target){
	loginfo("popoverArchiv.js", "superTable.prototype.addTo", "Add SuperTable to an element");
	$(target).append($(this.st));
}

/**
 * Sets the visibility of the superTable - default is invisible
 * @param bool
 */
superTable.prototype.visible = function(bool){
	if(bool == true){
		loginfo("popoverArchiv.js", "superTable.prototype.visible", "Make SuperTable visible");
		$(this.st).show();
	}
	
	if(bool == false){
		loginfo("popoverArchiv.js", "superTable.prototype.visible", "Make SuperTable invisible");
		$(this.st).hide();
	}
}

var myst;
$("div#popover_archiv").ready(function(){
	dynamicResize($("div#popover_archiv"), 80, 2048);
	fixElementheight($('#popover_holder'));
	fixElementwidth($('#popover_holder'));
	
	myst = new superTable("supertable");
	$(window).resize(function(){
		dynamicResize($("div#popover_archiv"), 80, 2048);
		fixElementheight($('#popover_holder'));
		fixElementwidth($('#popover_holder'));
		dirtyTableresize();
		myst.resizeFilter();
		
	})
	loadArchiv();
})

/**
 * Because you can't set the table height with dynamic max-height and keep the scrollbar.
 */
function dirtyTableresize(){
	var height = $("div#popover_archiv").innerHeight();
	var elementsheight = 0;
	$("div#popover_archiv").children().slice(0, -1).each(function(){
		elementsheight += $(this).outerHeight(true);
	})
	$("div#supertable").height(height - elementsheight);
}

/**
 * Loads the archived notes from the database
 * and return the received JSON String
 */
function loadArchiv(){
	loginfo("popoverArchiv.js", "loadArchiv", "Try to load the archiv");
	var loaded = "";
	$.ajax({
        type: "POST",
        url: './loadArchiv',
        async: true, //Loading screen?
        success: 	function (data) {
        				handleArchivRequest(data, function(){
        					myst.visible(true);
        					dirtyTableresize();
        					myst.resizeFilter();
        				});
						loginfo("popoverArchiv.js", "loadArchiv", "Archiv loaded");
			     	},
		error:		function(){
					logerror("popoverArchiv.js", "loadArchiv", "Can't reach servlet getArchiv or it throws an error");
						handleError(error_unspecified, error_wedontknow);
					}
    });
}

/**
 * This will merge the received data into a superTable on the archiv popover.
 * @param received
 * @param callback
 */
function handleArchivRequest(received, callback){
	loginfo("surface.js", "handleNoteUpdates", "Process note updates");
	var json_received = JSON.parse(received);
	myst.addTo($("div#popover_archiv"));
	myst.addCol("last", archiv_th_note_id, "digit");
	myst.addCol("last", archiv_th_note_level, "digit");
	myst.addCol("last", archiv_th_note_title, "string");
	myst.addCol("last", archiv_th_note_content, "string");
	myst.addCol("last", archiv_th_note_showtime, "string");
	myst.addCol("last", archiv_th_note_archivetime, "string");
	myst.addCol("last", archiv_th_note_archived, "string");
	myst.addCol("last", archiv_th_note_savetime, "string");
	myst.addCol("last", archiv_th_note_attachments, "string");
	myst.addCol("last", archiv_th_note_actions, "htmlobject");
	
	//Search for new notecontent to add
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "ADD_NOTECONTENTS"){
			var json_notecontentcollection = json_received[oneTypeCommandArr];
			var row = 0;
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
				var priostyle = "";
				var lockstyle = "";
				var importantnote = false;
				$.ajax({
			        type: "POST",
			        url: './dynamic/getLevelDetailsById.jsp',
			        data: {levelid:notecontent_fk_level},
			        async: false,
			        success: 	function (data) {
			        				if(data != "nodata"){
			        					var mylevel = data.split("~");
			        					var weight = mylevel[1];
			        					priostyle = "color:"+mylevel[3]+";background-color:"+mylevel[4]+";font-weight:bold;";
			        					
			        					myst.addCell(myst.findHeadBy("^"+archiv_th_note_level+"$")[0], row, weight, false, priostyle);
			        					
			        					if(mylevel[5] == "1"){ //Blink value. it's associated with important & undeletable
			        						importantnote = true;
			        						lockstyle = "background-color:#C0C0C0;";
			        					}
			        					loginfo("popoverArchiv.js", "handleArchivRequest", "");
			        				}else{
			        					//Dont show an error message it colud be problematic because this 
			        					//server page will be called multiple times in a short period.
			        					logwarning("popoverArchiv.js", "handleArchivRequest", "Can't get level details because level id "+ notecontent_fk_level + " doesn't exist");
			        				}
						     	},
					error:		function(){
									//Same as above
									logerror("popoverArchiv.js", "handleArchivRequest", "Can't change level - getLevelDetailsById.jsp is unreachable or trows an error");
								}
			    });
				myst.addCell(myst.findHeadBy("^"+archiv_th_note_id+"$")[0], row, notecontent_id, false, priostyle);
				myst.addCell(myst.findHeadBy("^"+archiv_th_note_title+"$")[0], row, notecontent_title, false, priostyle);
				myst.addCell(myst.findHeadBy("^"+archiv_th_note_content+"$")[0], row, notecontent_content, false, lockstyle);
				myst.addCell(myst.findHeadBy("^"+archiv_th_note_showtime+"$")[0], row, notecontent_showtime, false, lockstyle);
				myst.addCell(myst.findHeadBy("^"+archiv_th_note_archivetime+"$")[0], row, notecontent_archivetime, false, lockstyle);
				myst.addCell(myst.findHeadBy("^"+archiv_th_note_archived+"$")[0], row, notecontent_archived, false, lockstyle);
				myst.addCell(myst.findHeadBy("^"+archiv_th_note_savetime+"$")[0], row, notecontent_savetime, false, lockstyle);
				myst.addCell(myst.findHeadBy("^"+archiv_th_note_attachments+"$")[0], row, "", false, lockstyle);
				
				var btnholder = $("<div class='actionbtnholder'></div>");
				var btndelete = $("<div class='btndelete actionbtn' data-id='"+notecontent_id+"'></div>");
				var btnrestore = $("<div class='btnrestore actionbtn' data-id='"+notecontent_id+"'></div>");
				if(importantnote == false){
					$(btnholder).append($(btnrestore));
					$(btnholder).append($(btndelete));
					archivDeleteListener($(btndelete));
					archivRestoreListener($(btnrestore));
				}else{
					$(btnholder).append($(btnrestore));
					archivRestoreListener($(btnrestore));
				}
				myst.addCell(myst.findHeadBy("^"+archiv_th_note_actions+"$")[0], row, $(btnholder), false, "background-color:" + $(myst.tablebody).children("tr:first").children("th:last").css("background-color") + ";");
				row++;"background-color:"
			})
		}
	}	
	//Search for new attachments to add
	for(var oneTypeCommandArr in json_received){
		if(oneTypeCommandArr == "ADD_ATTACHMENTS"){
			var json_attachmentcollection = json_received[oneTypeCommandArr];
			
			var attachments = new Array();
			
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
				var foundat = -1;
				for(var i = 0; i < attachments.length; i++){
					if(attachments[i][0] == attachment_fk_note){
						foundat = i;
					}
				}
				var attparts = attachment_info.split("~");
				if(foundat < 0){
					attachments.push([attachment_fk_note, $("<span style='display:block'>" + attparts[0] + "</span>")]); //note_id, linkname
				}else{
					var tmpattachments = $(attachments[foundat][1]);
					$(tmpattachments).append($("<span style='display:block'>" + attparts[0] + "</span>"));
					attachments[foundat][1] = $(tmpattachments);
				}
			})
			for(var i = 0; i < attachments.length; i++){
				var row = myst.findRowBy("^"+archiv_th_note_id+"$", "^"+attachments[i][0]+"$");
				myst.addCell(myst.findHeadBy("^"+archiv_th_note_attachments+"$")[0], row, attachments[i][1], true, "keep");
			}
		}
	}
	callback();
}

/**
 * Listen to clicks on the given trigger and removes the note from the db which matches the data-id attribute in the trigger
 * @param target data-id attribute is required.
 */
function archivDeleteListener(target){
	$(target).mouseover(function(){
		showTT($(this), archiv_note_delete);
	});
	$(target).click(function(){
		var note_id = parseInt($(this).attr("data-id"));
		loginfo("popoverArchiv.js", "archivDeleteListener", "Try to remove note "+note_id);
		$.ajax({
	        type: "POST",
	        data: {note_id: note_id},
	        url: './removeNote',
	        async: false,
	        success: function (data) {
	        	if(data == "removed"){
	        		var affectedrow = myst.findRowBy("^"+archiv_th_note_id+"$", "^"+note_id+"$")[0];
	        		myst.removeRow(affectedrow);
	        		loginfo("popoverArchiv.js", "archivDeleteListener", "Removed note "+note_id);
	        	}
	        	
	        	if(data == "norowsaffected"){
	        		logerror("popoverArchiv.js", "archivDeleteListener", "Unable to remove note "+note_id);
	        	}
	        },
	        error: function(){
	        	logerror("popoverArchiv.js", "archivDeleteListener", "Can't reach servlet ./removeNote or it throws an error");
				handleError(error_unspecified, error_wedontknow);
	        }
	    });
	});
}

/**
 * Listen to clicks on the given trigger and restores the note from the archiv which matches the data-id attribute in the trigger
 * @param target data-id attribute is required.
 */
function archivRestoreListener(target){
	$(target).mouseover(function(){
		showTT($(this), archiv_note_restore);
	});
	$(target).click(function(){
		var note_id = parseInt($(this).attr("data-id"));
		loginfo("popoverArchiv.js", "archivRestoreListener", "Try to restore note "+note_id);
		$.ajax({
	        type: "POST",
	        data: {note_id: note_id},
	        url: './restoreNote',
	        async: false,
	        success: function (data) {
	        	if(data == "restored"){
	        		var affectedrow = myst.findRowBy("^"+archiv_th_note_id+"$", "^"+note_id+"$")[0];
	        		myst.removeRow(affectedrow);
	        		loginfo("popoverArchiv.js", "archivRestoreListener", "Restored note "+note_id);
	        	}
	        	
	        	if(data == "norowsaffected"){
	        		logerror("popoverArchiv.js", "archivRestoreListener", "Unable to restore note "+note_id);
	        	}
	        },
	        error: function(){
	        	logerror("popoverArchiv.js", "archivRestoreListener", "Can't reach servlet ./restoreNote or it throws an error");
				handleError(error_unspecified, error_wedontknow);
	        }
	    });
	});
}