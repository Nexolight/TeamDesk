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
 * This creates a multitab container which can be filled with different views asscoicated to a given tab
 * @param idname the name which is used for the container. So you can set multiple styles for different multitab containers.
 */
function mtContainer(idname){
	loginfo("popoverGroupadmin.js", "mtContainer", "Create multitab container");
	this.mtc		= $("<div class='multitabContainer' id='"+idname+"'></div>");
	this.tabholder 	= $("<div class='tabholder'></div>");
	this.viewholder = $("<div class='viewholder'></div>");
	$(this.mtc).append($(this.tabholder));
	$(this.mtc).append($(this.viewholder));
}

/**
 * This adds a view to the multitab container
 * @param tabname (String = The unique name used which is used as tabname)
 * @param content (JQUery object)
 * @return a reference to the tab jquery object. a.e. for listeners.
 */
mtContainer.prototype.addView = function(tabname, content){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.addView", "Add view " + tabname + " to multitab container");
	var myinstance = this;
	var tab = $("<div class='onetab onetab_inactive'>"+tabname+"</div>");
	var view = $("<div class='oneview' style='display:none;'></div>");
	$(view).append($(content));
	$(this.tabholder).append($(tab));
	$(this.viewholder).append($(view));
	$(tab).click(function(){
		myinstance.switchView(tabname);
	});
	return $(tab);
}

/**
 * This removes a view from the multitab container
 * @param tabname (String = The unique name used which is used as tabname)
 */
mtContainer.prototype.removeView = function(tabname){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.removeView", "Remove view " + tabname + " from multitab container");
	var myinstance = this;
	var tabs = $(this.tabholder).children();
	var views = $(this.viewholder).children();
	$(tabs).each(function(index){
		if($(this).text() == tabname){
			var foundtab = $(this);
			if(myinstance.currentViewIndex() == index){
				logerror("popoverGroupadmin.js", "mtContainer.prototype.removeView", "The view which you want to delete is currently opened");
			}else{
				$(views).eq(index).remove();
				$(foundtab).fadeOut(250, function(){
					setTimeout(function(){
						$(foundtab).remove();
					},250);
				});
			}
		}
	});
}

/**
 * This replaces a view from the multitab container
 * @param tabname (String = The unique name used which is used as tabname)
 * @param (JQUery object)
 */
mtContainer.prototype.replaceView = function(tabname, content){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.exist", "Replace view of tab " + tabname);
	var viewtoreplace = this.getView(tabname);
	if(this.currentViewName() == tabname){
		$(viewtoreplace).fadeOut(125, function(){
			setTimeout(function(){
				$(viewtoreplace).replaceWith($(content));
				$(content).fadeIn(150);
			},125);
		});
	}else{
		$(viewtoreplace).replaceWith($(content));
	}
}

/**
 * This returns true if the view with the associated tab exist and false if not
 * @param tabname (String = The unique name used which is used as tabname)
 * @return (boolean true/false)
 */
mtContainer.prototype.exist = function(tabname){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.exist", "Check if tab " + tabname + " exist");
	var tabs = $(this.tabholder).children();
	var ret = false;
	$(tabs).each(function(index){
		if($(this).text() == tabname){
			ret = true;
			return false;
		}
	});
	return ret;
}

/**
 * This hides a view from the multitab container
 * @param tabname (String = The unique name used which is used as tabname)
 */
mtContainer.prototype.hideViewTab = function(tabname){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.hideViewTab", "Hide tab " + tabname);
	var tabs = $(this.tabholder).children();
	$(tabs).each(function(index){
		if($(this).text() == tabname){
			$(this).fadeOut(250);
		}
	});
}

/**
 * This shows a view from the multitab container
 * @param tabname (String = The unique name used which is used as tabname)
 */
mtContainer.prototype.showViewtab = function(tabname){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.showViewtab", "Show tab " + tabname);
	var tabs = $(this.tabholder).children();
	$(tabs).each(function(index){
		if($(this).text() == tabname){
			$(this).fadeIn(250);
		}
	});
}

/**
 * This returns the whole multitab container ready to append or access.
 * @returns (JQuery object)
 */
mtContainer.prototype.getContainer = function(){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.getContainer", "Get the multitab container object");
	return $(this.mtc);
}

/**
 * This returns a view from the multitab container ready to edit
 * @param tabname (String = The unique name used which is used as tabname)
 * @returns (JQuery object)
 */
mtContainer.prototype.getView = function(tabname){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.getView", "Get the view content object from tab " + tabname);
	var views = $(this.viewholder).children();
	var tabs = $(this.tabholder).children();
	var view;
	$(tabs).each(function(index){
		if($(this).text() == tabname){
			view = $(views).eq(index);
			return false;
		}
	});
	return $(view);
}

/**
 * This switches the current view
 * @param tabname (String = The unique name used which is used as tabname)
 */
mtContainer.prototype.switchView = function(tabname){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.switchView", "Switch view to " + tabname);
	if(this.currentViewName() != tabname){
		var tabs = $(this.tabholder).children();
		var views = $(this.viewholder).children();
		var actview = this.currentViewIndex();
		var tabdest = this.getTabIndex(tabname);
		$(tabs).eq(actview).removeClass("onetab_active");
		$(tabs).eq(actview).addClass("onetab_inactive");
		$(tabs).eq(tabdest).removeClass("onetab_inactive");
		$(tabs).eq(tabdest).addClass("onetab_active");
		$(views).eq(actview).fadeOut(250);
		$(views).eq(tabdest).fadeIn(250);
		loginfo("popoverGroupadmin.js", "mtContainer.prototype.switchView", "Switched view to " + tabname);
	}else{
		logwarning("popoverGroupadmin.js", "mtContainer.prototype.switchView", "View " + tabname + " is already open");
	}
}

/**
 * Returns the name of the currently open tab.
 * @returns (String = The name of the currently open tab)
 */
mtContainer.prototype.currentViewName = function(){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.currentViewName", "Get the name of the actually visible view");
	var views = $(this.viewholder).children();
	var tabs = $(this.tabholder).children();
	var viewname;
	$(views).each(function(index){
		if($(this).is(":visible")){
			viewname = $(tabs).eq(index).text();
			return false;
		}
	});
	return viewname;
}

/**
 * Returns the index of the currently open tab/view
 * @returns (int = The number of the currently open tab)
 */
mtContainer.prototype.currentViewIndex = function(){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.currentViewIndex", "Get the index of the actually opened view");
	var views = $(this.viewholder).children();
	var ret;
	$(views).each(function(index){
		if($(this).is(":visible")){
			ret = index;
			return false;
		}
	});
	return ret;
}

/**
 * This returns the number of existing views
 * @returns (int = The number of the currently open tab)
 */
mtContainer.prototype.viewCount = function(){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.viewCount", "Count the available views");
	var tabs = $(this.tabholder).children().length;
	var views = $(this.viewholder).children().length;
	if(tabs == views){
		return tabs;
	}
}

/**
 * Returns the index of the given tab
 * @param tabname (String = The unique name used which is used as tabname)
 * @returns (int = The number of the given tab)
 */
mtContainer.prototype.getTabIndex = function(tabname){
	loginfo("popoverGroupadmin.js", "mtContainer.prototype.getTabIndex", "Get the index of the tab " + tabname);
	var tabs = $(this.tabholder).children();
	var ret;
	$(tabs).each(function(index){
		if($(this).text() == tabname){
			ret = index;
			return false;
		}
	});
	return ret;
}


$("div#popover_groupadmin").ready(function(){
	dynamicResize($("div#popover_groupadmin"), 70, 1200);
	fixElementheight($('#popover_holder'));
	fixElementwidth($('#popover_holder'));
	
	$(window).resize(function(){
		dynamicResize($("div#popover_groupadmin"), 70, 1200);
		fixElementheight($('#popover_holder'));
		fixElementwidth($('#popover_holder'));
		
	})
	var mode = $("div#popover_groupadmin").attr("data-mode");
	handleGAMode(mode);
});


/**
 * This will handle the Groupadmin popover depending on the given mode
 * @param mode (String = 'newgroup' or 'editgroup')
 */
var saveheader; //The last tab name it depends on the given mode and will be used in other functions to get the view from the last tab
function handleGAMode(mode){
	
	var saveinfo;
	var savebtn_id;
	var savebtn_txt;
	var modegiven = false;
	var groupremovebtn = ""
	
	if(mode == "newgroup"){
		$("span#popover_headertext").text(groupadmin_newgroup_header);
		saveinfo = groupadmin_txt_newgroup_info;
		savebtn_id = "groupadmin_btn_create";
		savebtn_txt = groupadmin_btn_create;
		saveheader = groupadmin_create;
		modegiven = true;
	}
	
	if(mode == "editgroup"){
		$("span#popover_headertext").text(groupadmin_editgroup_header);
		saveinfo = groupadmin_txt_editgroup_info;
		savebtn_id = "groupadmin_btn_save";
		savebtn_txt = groupadmin_btn_save;
		saveheader = groupadmin_save;
		modegiven = true;
		groupremovebtn = "<button class='default' id='groupadmin_btn_removegroup'>"+groupadmin_btn_removegroup+"</button>";
	}
	
	if(modegiven == true){
		loginfo("popoverGroupadmin.js", "handleGAMode", "Given mode is: " + mode + " - create groupadmin gui content");
		var basicsettings = $("<div id='groupadmin_settings'>" +
				"" 	+
				"	<input type='text' id='group_id' style='display:none;'></input>" + //This contains the group id if the group isn't new
				"	<div class='squares_multicol_medium'>" + 
				"		<div class='popover_txtrow'>"+groupadmin_lbl_groupname+"</div>" +
				"		<div class='popover_row'>" +
				"			<input class='gradmin' type='text' id='groupadmin_groupname'></input>" +
				"		</div>" +
				"	</div>" +
				""	+
				"	<div class='squares_multicol_medium'>" + 
				"		<div class='popover_txtrow'>"+groupadmin_lbl_password+"</div>" +
				"		<div class='popover_row'>" +
				"			<input class='gradmin' type='text' id='groupadmin_password'></input>" +
				"		</div>" +
				"	</div>" +
				""  +
				"	<div class='squares_multicol_medium'>" + 
				"		<div class='popover_txtrow'>"+groupadmin_lbl_adminpassword+"</div>" +
				"		<div class='popover_row'>" +
				"			<input class='gradmin' type='text' id='groupadmin_adminpassword'></input>" +
				"		</div>" +
				"	</div>" +
				"" 	+
				"	<div class='squares_multicol_medium'>" + 
				"		<div class='popover_txtrow'>"+groupadmin_lbl_description+"</div>" +
				"		<div class='popover_row'>" +
				"			<textarea class='gradmin' id='groupadmin_description'></textarea>" +
				"		</div>" +
				"	</div>" +
				"" 	+
				"	<div class='squares_multicol_medium'>" + 
				"		<div class='popover_txtrow'>"+groupadmin_lbl_fieldresolution+"</div>" +
				"		<div class='popover_row'>" +
				"			<input type='text' class='gradmin gradmin_pxsize' id='groupadmin_fieldresolutionX'></input>" +
				"			<span> x </span>" +
				"			<input type='text' class='gradmin gradmin_pxsize' id='groupadmin_fieldresolutionY'></input>" +
				"			<span> "+general_pica+"</span>" +
				"		</div>" +
				"	</div>" +
				"" 	+
				"	<div class='squares_multicol_medium'>" + 
				"		<div class='popover_txtrow'>"+groupadmin_lbl_maxsize+"</div>" +
				"		<div class='popover_row'>" +
				"			<input type='text' class='gradmin gradmin_pxsize' id='groupadmin_maxsizeX'></input>" +
				"			<span> x </span>" +
				"			<input type='text' class='gradmin gradmin_pxsize' id='groupadmin_maxsizeY'></input>" +
				"			<span> "+general_pica+"</span>" +
				"		</div>" +
				"	</div>" +
				"" 	+
				"	<div class='squares_multicol_medium'>" + 
				"		<div class='popover_txtrow'>"+groupadmin_lbl_minsize+"</div>" +
				"		<div class='popover_row'>" +
				"			<input type='text' class='gradmin gradmin_pxsize' id='groupadmin_minsizeX'></input>" +
				"			<span> x </span>" +
				"			<input type='text' class='gradmin gradmin_pxsize' id='groupadmin_minsizeY'></input>" +
				"			<span> "+general_pica+"</span>" +
				"		</div>" +
				"	</div>" +
				"" 	+
				"	<div class='squares_multicol_medium'>" + 
				"		<div class='popover_txtrow'>"+groupadmin_lbl_defaultsize+"</div>" +
				"		<div class='popover_row'>" +
				"			<input type='text' class='gradmin gradmin_pxsize' id='groupadmin_defaultsizeX'></input>" +
				"			<span> x </span>" +
				"			<input type='text' class='gradmin gradmin_pxsize' id='groupadmin_defaultsizeY'></input>" +
				"			<span> "+general_pica+"</span>" +
				"		</div>" +
				"	</div>" +
				"" 	+
				"	<div class='squares_multicol_medium'>" + 
				"		<div class='popover_txtrow'>"+groupadmin_lbl_commentedittime+"</div>" +
				"		<div class='popover_row'>" +
				"			<input class='gradmin gradmin_pxsize' type='text' id='groupadmin_commentedittime'></input>" +
				"			<span>" + general_full_m + " </span>" +
				"		</div>" +
				"	</div>" +
				""	+
				"</div>");

		var levels = $("<div id='groupadmin_levels'>" +
				"" 	+
				"	<div class='squares_singelcol_flexdistribute'>" + 
				"		<div class='squares_auto'>" + 
				"			<div class='popover_txtrow'>"+groupadmin_lbl_lvlweight+"</div>" +
				"			<div class='popover_row'>" +
				"				<input class='gradmin gradmin_pxsize groupadmin_levelweight' type='text'></input>" +
				"				<span>" + general_type_number + "</span>" +
				"			</div>" +
				"		</div>" +
				"" 	+
				"		<div class='squares_auto'>" + 
				"			<div class='popover_txtrow'>"+groupadmin_lbl_lvlcolor+"</div>" +
				"			<div class='popover_row'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_levelcolor' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" 	+
				"		<div class='squares_auto'>" + 
				"			<div class='popover_txtrow'>"+groupadmin_lbl_lvlbgcolor+"</div>" +
				"			<div class='popover_row'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_levelbgcolor' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" 	+
				"		<div class='squares_auto'>" + 
				"			<div class='popover_txtrow'>"+groupadmin_lbl_lvlisblinking+"</div>" +
				"			<div class='popover_row'>" +
				"				<input class='checkbox groupadmin_levelundeletable' type='checkbox' value='none' name='check'></input><label for='checkbox'></label>" +
				"			</div>" +
				"		</div>" +
				"" 	+
				"		<div class='squares_auto'>" + 
				"			<div class='popover_txtrow'>"+groupadmin_lbl_lvldescription+"</div>" +
				"			<div class='popover_row'>" +
				"				<input class='default gradmin leveldesc groupadmin_leveldescription'></input>" +
				"			</div>" +
				"		</div>" +
				"		<div class='squares_lvlbtns'>" +
				"			<button data-id='' class='default groupadmin_removelevel'>"+groupadmin_btn_remove+"</button>" +
				"			<button class='default groupadmin_addlevel'>"+groupadmin_btn_add+"</button>" +
				"		</div>" +
				"	</div>"	+
				""	+
				"</div>");
		
		var colors = $("<div id='groupadmin_colors'>" +
				"	<div id='onemptybtnholder'>" +
				"		<span>"+groupadmin_lbl_addcolor+"</span><button class='default groupadmin_addcs'>"+groupadmin_btn_add+"</button>" +
				"	</div>" +
				"</div>");
		
		var create = $("<div id='groupadmin_overview'>" +
				"	<div class='popover_txtrow'>"+groupadmin_lbl_info+"</div>" +
				"	<div class='popover_row'>" +
				"		<span>"+saveinfo+"</span>" +
				"	</div>" +
				"	<div class='popover_txtrow'>"+groupadmin_lbl_summary+"</div>" +
				"	<div class='summary'>" +
				"		<div class='squares_auto settings'>" +
				"			<p>"+groupadmin_settings+"</p>" +
				"			<table>" +
				"			</table>" +
				"		</div>" +
				"		<div class='squares_auto levels'>" +
				"			<p>"+groupadmin_prioritys+"</p>" +
				"			<table>" +
				"			</table>" +
				"		</div>" +
				"		<div class='squares_auto colors'>" +
				"			<p>"+groupadmin_colors+"</p>" +
				"			<table>" +
				"			</table>" +
				"		</div>" +
				"	</div>" +
				"	<div class='buttonholder'>" +
				"		<button class='default' id='groupadmin_btn_cancel'>"+groupadmin_btn_cancel+"</button>" +
				"		" + groupremovebtn + 
				"		<button class='default' id='"+savebtn_id+"'>"+savebtn_txt+"</button>" +
				"	</div>" +
				"</div>");
		
		
		var mtc = new mtContainer("groupadministration");
		mtc.addView(groupadmin_settings, $(basicsettings));
		mtc.addView(groupadmin_prioritys, $(levels));
		mtc.addView(groupadmin_colors, $(colors));
		var savetab = mtc.addView(saveheader, $(create));
		mtc.switchView(groupadmin_settings);
		$("div#popover_groupadmin").append($(mtc.getContainer()));
		
		if(mode == "newgroup"){
			gradmin_subtablisteners(savetab, mtc, mode);
		}
		
		if(mode == "editgroup"){
			gradmin_subtablisteners(savetab, mtc, mode, function(){
				loadGroupsettings(mtc);
			});
		}
		
	}else{
		handleError(groupadmin_mode_error, groupadmin_mode_error_t);
		logerror("popoverGroupadmin.js", "handleGAMode", "Given mode is: " + mode + " - this mode is unknown");
	}
}

/**
 * This function is listening to clicks in the multiple tabs
 * This is highly restrictive. You better don't change too much.
 * @param savetab
 * @param mtc a multitab container instance reference
 * @param mode (String = 'newgroup' or 'editgroup')
 * @param callback After this function the groupadmin gui is loaded with all it's functionallity. If you want to interact with it then use this callback.
 */
function gradmin_subtablisteners(savetab, mtc, mode, callback){
	loginfo("popoverGroupadmin.js", "gradmin_subtablisteners", "Create listeners for groupadmin GUI elements");
	
	var settingsc = mtc.getView(groupadmin_settings);
	var levelsc = mtc.getView(groupadmin_prioritys);
	var colorsc = mtc.getView(groupadmin_colors);
	var saveView = mtc.getView(saveheader);
	
	var rq = new gradminremovequeues();

	$(saveView).find("button#groupadmin_btn_removegroup").click(function(){
		loginfo("popoverGroupadmin.js", "gradmin_subtablisteners", "Ask if the group should be removed for sure");
		var askgrremovegroup = new askWindow(askwindow_removegroup, askwindow_removegroup_t);
		askgrremovegroup.btnOk(function(){
			askgrremovegroup.close();
			closePopover();
			loginfo("popoverGroupadmin.js", "gradmin_subtablisteners", "Ok... I will delete this group.");
			$.ajax({
		        type: "POST",
		        url: "./removeGroup",
		        success: function (data) {
		        	loginfo("popoverGroupadmin.js", "gradmin_subtablisteners", "Removed the group - Bye");
		        },
		        error: function(){
		        	logerror("popoverGroupadmin.js", "gradmin_subtablisteners", "Unable to remove the group");
		        	handleError(error_unspecified, error_wedontknow);
		        }
		    });
		});
		askgrremovegroup.btnCancel(function(){
			loginfo("popoverGroupadmin.js", "gradmin_subtablisteners", "Canceled group removal");
			askgrremovegroup.close();
		});
		askgrremovegroup.appendTo("div#surfaceholder");
	});

	$(levelsc).find("button.groupadmin_addlevel:first").click(function(event, secondcallback){
		loginfo("popoverGroupadmin.js", "gradmin_subtablisteners", "Add a new level row");
		var cols = $(levelsc).find("div.squares_singelcol_flexdistribute").children();
		$(cols).each(function(){
			var firstcolrow = $(this).children("div.popover_row").first();
			if($(this).hasClass("squares_lvlbtns")){
				var removebtn = $(this).children("button.groupadmin_removelevel").first().clone(true, true);
				var addbtn = $(this).children("button.groupadmin_addlevel").first();
				$(removebtn).attr("data-id", ""); //important
				$(removebtn).hide();
				$(removebtn).insertBefore($(addbtn));
				$(removebtn).fadeIn(250);
			}
			var newitem = $(firstcolrow).clone();
			$(newitem).children("input.gradmin, textarea.gradmin").val("");
			$(newitem).children("input.checkbox").attr("checked", false);
			$(newitem).hide();
			$(this).append($(newitem));
			$(newitem).fadeIn(250);
		});
		if(typeof secondcallback == "function"){
			secondcallback();
		}
	});
	
	$(levelsc).find("button.groupadmin_removelevel:first").click(function(){ //This will be cloned later when you add a row.
		var cols = $(this).closest("div.squares_singelcol_flexdistribute").children();
		var clickedbtn = $(this);
		var btnindex = $(cols).last().children().index($(clickedbtn)); //get the index number of the clicked button by search thourght the buttonholder which is the last column
		var levelrows = $(levelsc).find("button.groupadmin_removelevel").length;
		if(levelrows > 1){
			rq.addLevel($(clickedbtn).attr("data-id"));
			loginfo("popoverGroupadmin.js", "gradmin_subtablisteners", "Remove a level row");
			$(cols).each(function(){
				var rows = $(this).children("div.popover_row");
				$(rows).eq(btnindex).fadeOut(250);

				setTimeout(function(){
					$(rows).eq(btnindex).remove();
				},250);
			});
			$(clickedbtn).fadeOut(250);
			setTimeout(function(){
				$(clickedbtn).remove();
			},250);
		}else{
			logwarning("popoverGroupadmin.js", "gradmin_subtablisteners", "You can't remove this level row. You need at least one");
		}
		
	});
	
	$(colorsc).find("div#onemptybtnholder").find("button.groupadmin_addcs").click(function(event, secondcallback){
		loginfo("popoverGroupadmin.js", "gradmin_subtablisteners", "Add a new colorsheme");
		$(colorsc).find("div#onemptybtnholder").fadeOut(250);
		var colorsheme = $("<div class='cstable onecolorsheme'>" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_colorsheme+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin groupadmin_csname' type='text'></input>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_font+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_csfont' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_bg+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_csbg' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_title+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_cstitle' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_bg_title+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_csbgtitle' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row'  >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_link+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_cslink' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_borders+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_csborders' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_tbl_header+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_cstblheaderbg' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_tbl_z01+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_cstblz01bg' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_tbl_z02+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_cstblz02bg' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_tbl_headerfont+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_cstblheader' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_tbl_z01font+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_cstblz01font' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row' >" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_cs_tbl_z02font+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<input class='gradmin gradmin_hexcolorsize groupadmin_cstblz02font' type='text'></input>" +
				"				<span>" + general_type_hexcolor + "</span>" +
				"			</div>" +
				"		</div>" +
				"" +
				"		<div class='cstable_row'>" +
				"			<div class='cstable_cell'>" +
				"				<span>"+groupadmin_lbl_actions+"</span>" +
				"			</div>" +
				"			<div class='cstable_cell'>" +
				"				<div class='btnholder'>" +
				"					<button data-id='' class='default groupadmin_removecs'>"+groupadmin_btn_remove+"</button>" +
				"					<button class='default groupadmin_addcs'>"+groupadmin_btn_add+"</button>" +
				"				</div>" +
				"			</div>" +
				"		</div>" +
				""	+
				"</div>");
		$(colorsheme).hide();
		$(colorsc).children("div#groupadmin_colors").append($(colorsheme))
		$(colorsheme).fadeIn(250);
		
		$(colorsheme).find("button.groupadmin_removecs").click(function(){
			loginfo("popoverGroupadmin.js", "gradmin_subtablisteners", "Remove an existing colorsheme");
			rq.addColorsheme($(this).attr("data-id"));
			var clickedbtn = $(this);
			$(clickedbtn).closest("div.onecolorsheme").fadeOut(250);
			
			if($(colorsc).find("div.onecolorsheme").length == 1){ //the singel left cs is removed
				setTimeout(function(){
					$(colorsc).find("div#onemptybtnholder").fadeIn(250);
				},250);
			}
			
			setTimeout(function(){
				$(clickedbtn).closest("div.onecolorsheme").remove();
			},250);
		});
		
		$(colorsheme).find("button.groupadmin_addcs").click(function(){
			loginfo("popoverGroupadmin.js", "gradmin_subtablisteners", "Add a new colorsheme");
			var newsheme = $(colorsheme).clone(true, true);
			$(newsheme).find("button.groupadmin_removecs:first").attr("data-id", ""); //important
			$(newsheme).find("input.gradmin").val("");
			$(newsheme).hide();
			$(colorsc).children("div#groupadmin_colors").append($(newsheme));
			$(newsheme).fadeIn(250);
		})
		if(typeof secondcallback == "function"){
			secondcallback();
		}
	});
	
	$(savetab).click(function(){
		checkGroupadminInput(mtc);
	});
	
	$(saveView).find("button#groupadmin_btn_cancel").click(function(){
		closePopover();
	});
	
	$(saveView).find("button#groupadmin_btn_create").click(function(){ //This button only exists when a new group is created
		var vc = checkGroupadminInput(mtc);
		savegradminsettings(vc, rq, mode);
	});
	
	$(saveView).find("button#groupadmin_btn_save").click(function(){ //This button only exists when the group already exist.
		var vc = checkGroupadminInput(mtc);
		savegradminsettings(vc, rq, mode);
	});
	
	if(typeof callback == "function"){
		callback();
	}
}

/**
 * Send a reload broadcast to all clients in the current group.
 */
function refreshbroadcast(){
	loginfo("popoverGroupadmin.js", "refreshbroadcast", "Try to send reload broadcast");
	$.ajax({
        type: "POST",
        url: "./broadcastGroupDC",
        success: function (data) {
        	loginfo("popoverGroupadmin.js", "refreshbroadcast", "Send reload broadcast - successful");
        },
        error: function(){
        	logwarning("popoverGroupadmin.js", "refreshbroadcast", "Unable to send the reload broadast - The clients will not reload the page");
        }
    });
}

/**
 * This saves the settings or creates a new group depending on the given mode
 * @param vc the gradminvalcontainer object
 * @param rq the gradminremoveQueues object
 * @param mode (String = 'newgroup' or 'editgroup')
 */
function savegradminsettings(vc, rq, mode){
	/**
	 * If the given mode is "editgroup" the group should be present in vc.group_id otherwise the id from the new created group will be used in all callbacks.
	 * Make sure that you first call saveBasicSettings and every other subfuntion inside the callback. Otherwise you will not get the needed id.
	 */
	var groupid;
	
	if(vc.allValid() == true){
		if(mode == "editgroup"){ //Group id exist this is a already existing group
			groupid = vc.group_id;
			if(isID(groupid)){
				
				setTimeout(function(){
					saveBasicSettings(function(){
						saveLevels();
						saveColorshemes();
						removeDBLevels();
						removeDBColorshemes();
					});
				}, 0);
				refreshbroadcast();
				closePopover();
				loginfo("popoverGroupadmin.js", "savegradminsettings", "Groupsettings are valid - I will save them");
			}else{
				logerror("popoverGroupadmin.js", "savegradminsettings", "I can't find the origin group id - I'm sorry but without it I can't continue");
			}
		}
		
		if(mode == "newgroup"){ //Group id dont exist so this is a new group
			saveBasicSettings(function(){
				saveLevels()
				saveColorshemes()
				closePopover(function(){
					location.reload();
				});
			});
			loginfo("popoverGroupadmin.js", "savegradminsettings", "Groupsettings are valid - I will create this group");
		}
	}else{
		logerror("popoverGroupadmin.js", "savegradminsettings", "Your settings are invalid. I won't save them");
		handleError(groupadmin_error_invalid_input,groupadmin_error_invalid_input_t);
	}
	
	/**
	 * This removes all levels/prioritys which where removed by the user and which are saved in the db
	 * @param callback
	 */
	function removeDBLevels(callback){
		if(isID(groupid)){
			for(var i = 0; i < rq.removedlevels.length; i++){
				var levelid = rq.removedlevels[i].level_id;
				if(isID(levelid)){
					$.ajax({
				        type: "POST",
				        data: {groupid:groupid, levelid:levelid},
				        url: "./removeLevel",
				        success: function (data) {
				        	if(data == "norowsaffected"){
				        		logerror("popoverGroupadmin.js", "removeDBLevels", "Unable to remove this level. The Database refuses to delete the level " + levelid);
				        		handleError(gen_dbrefuse_remove, gen_dbrefuse_remove_t);
				        	}
				        	loginfo("popoverGroupadmin.js", "removeDBLevels", "Removed the level " + levelid);
				        },
				        error: function(){
				        	logerror("popoverGroupadmin.js", "removeDBLevels", "Can't reach servlet ./removeLevel or it throws an error");
							handleError(error_unspecified, error_wedontknow);
				        }
				    });
				}else{
					logerror("popoverGroupadmin.js", "removeDBLevels", "No level id is given. So I can't remove this level from the DB.");
				}
			}
			if(typeof callback == "function"){
				callback();
			}
		}else{
			logerror("popoverGroupadmin.js", "removeDBLevels", "No group id is given. So I can't remove levels from the DB.");
		}
	}
	
	/**
	 * This removes all levels/prioritys which where removed by the user and which are saved in the db
	 * @param callback
	 */
	function removeDBColorshemes(callback){
		if(isID(groupid)){
			for(var i = 0; i < rq.removedcolors.length; i++){
				var csid = parseInt(rq.removedcolors[i].cs_id);
				if(isID(csid)){
					$.ajax({
				        type: "POST",
				        data: {groupid:groupid, csid:csid},
				        url: "./removeColorsheme",
				        success: function (data) {
				        	if(data == "norowsaffected"){
				        		logerror("popoverGroupadmin.js", "removeDBColorshemes", "Unable to remove this colorsheme. The Database refuses to delete the colorsheme " + csid);
				        		handleError(gen_dbrefuse_remove, gen_dbrefuse_remove_t);
				        	}
				        	loginfo("popoverGroupadmin.js", "removeDBColorshemes", "Removed the colorsheme " + csid);
				        },
				        error: function(){
				        	logerror("popoverGroupadmin.js", "removeDBColorshemes", "Can't reach servlet ./removeColorsheme or it throws an error");
							handleError(error_unspecified, error_wedontknow);
				        }
				    });
				}else{
					logerror("popoverGroupadmin.js", "removeDBColorshemes", "No colorsheme id is given. So I can't remove this colorsheme from the DB.");
				}
			}
			if(typeof callback == "function"){
				callback();
			}
		}else{
			logerror("popoverGroupadmin.js", "removeDBColorshemes", "No group id is given. So I can't remove colorshemes from the DB.");
		}
	}
	
	/**
	 * This creates a or updates group with it's basic settings and set it's group id in the groupid variable.
	 * @param callback - after ajax success!
	 */
	function saveBasicSettings(callback){
		if(!isID(groupid)){ //create new group
			$.ajax({
		        type: "POST",
		        data: {	group_name:vc.group_name, group_pw:vc.group_pw, group_adminpw:vc.group_adminpw, group_desc:vc.group_desc, group_fieldresX:vc.group_fieldresX, group_fieldresY:vc.group_fieldresY, 
		        		note_maxSizeX:vc.note_maxSizeX, note_maxSizeY:vc.note_maxSizeY, note_minSizeX:vc.note_minSizeX, note_minSizeY:vc.note_minSizeY, note_defaultSizeX:vc.note_defaultSizeX, note_defaultSizeY:vc.note_defaultSizeY,
		        		comment_maxeditT:((vc.comment_maxeditT * 60) * 1000)},
		        url: "./createBasicGroup",
		        success: function (data) {
		        	if(data == "norowsaffected"){
		        		logerror("popoverGroupadmin.js", "saveBasicSettings", "Unable to create the basic settings. The Database refuses the entry.");
		        		handleError(groupadmin_error_doubleentry, groupadmin_error_doubleentry_t);
		        	}
		        	if(isID(data)){
		        		loginfo("popoverGroupadmin.js", "saveBasicSettings", "New Group with id "+data+" and it's basic settings has been created. Now you can add prioritys/levels and colorshemes.");
		        		groupid = parseInt(data);
		        		if(typeof callback == "function"){
		        			callback();
		        		}
		        	}
		        },
		        error: function(){
		        	logerror("popoverGroupadmin.js", "saveBasicSettings", "Can't reach servlet ./createBasicGroup or it throws an error");
					handleError(error_unspecified, error_wedontknow);
		        }
		    });
		}else{ //Update group
			$.ajax({
		        type: "POST",
		        data: {	groupid:groupid, group_name:vc.group_name, group_pw:vc.group_pw, group_adminpw:vc.group_adminpw, group_desc:vc.group_desc, group_fieldresX:vc.group_fieldresX, group_fieldresY:vc.group_fieldresY, 
		        		note_maxSizeX:vc.note_maxSizeX, note_maxSizeY:vc.note_maxSizeY, note_minSizeX:vc.note_minSizeX, note_minSizeY:vc.note_minSizeY, note_defaultSizeX:vc.note_defaultSizeX, note_defaultSizeY:vc.note_defaultSizeY,
		        		comment_maxeditT:((vc.comment_maxeditT * 60) * 1000)},
		        url: "./updateBasicGroup",
		        success: function (data) {
		        	if(data == "norowsaffected"){
		        		logerror("popoverGroupadmin.js", "saveBasicSettings", "Unable to save the basic settings. The Database refuses the entry.");
		        		handleError(gen_dbrefuse, gen_dbrefuse_t);
		        	}
		        	if(data == "ok"){
		        		loginfo("popoverGroupadmin.js", "saveBasicSettings", "The Group with id "+groupid+" and it's basic settings has been updated.");
		        		if(typeof callback == "function"){
		        			callback();
		        		}
		        	}
		        },
		        error: function(){
		        	logerror("popoverGroupadmin.js", "saveBasicSettings", "Can't reach servlet ./updateBasicGroup or it throws an error");
					handleError(error_unspecified, error_wedontknow);
		        }
		    });
		}
	}
	
	/**
	 * This saves the level changes. That includes removed, updated and new levels.
	 * @param callback
	 */
	function saveLevels(callback){
		if(isID(groupid)){
			for(var i = 0; i < vc.levels.length; i++){
				var level_id = vc.levels[i].level_id;
				var level_weight = vc.levels[i].level_weight;
				var level_font = vc.levels[i].level_font;
				var level_bg = vc.levels[i].level_bg;
				var level_blink = vc.levels[i].level_blink;
				var level_desc = vc.levels[i].level_desc;
				
				if(!isID(level_id)){ //if this is not a number it means that it doesn't exist. so assign this one to the group
					$.ajax({
				        type: "POST",
				        data: {groupid:groupid, level_weight:level_weight, level_font:level_font, level_bg:level_bg, level_blink:level_blink, level_desc:level_desc},
				        url: "./addLevel",
				        success: function (data) {
				        	if(data == "norowsaffected"){
				        		logerror("popoverGroupadmin.js", "saveLevels", "Unable to add this level. The Database refuses the entry.");
				        		handleError(gen_dbrefuse, gen_dbrefuse_t);
				        	}
				        	loginfo("popoverGroupadmin.js", "saveLevels", "Added a new level to group " + groupid);
				        },
				        error: function(){
				        	logerror("popoverGroupadmin.js", "saveLevels", "Can't reach servlet ./addLevel or it throws an error");
							handleError(error_unspecified, error_wedontknow);
				        }
				    });
				}else{ // This level has an id. It exist in the db and should be updated
					$.ajax({
				        type: "POST",
				        data: {level_id:level_id, groupid:groupid, level_weight:level_weight, level_font:level_font, level_bg:level_bg, level_blink:level_blink, level_desc:level_desc},
				        url: "./updateLevel",
				        success: function (data) {
				        	if(data == "norowsaffected"){
				        		logerror("popoverGroupadmin.js", "saveLevels", "Unable to update level "+level_id+". The Database refuses the entry.");
				        		handleError(gen_dbrefuse, gen_dbrefuse_t);
				        	}
				        	loginfo("popoverGroupadmin.js", "saveLevels", "Updated level "+level_id+" of group " + groupid);
				        },
				        error: function(){
				        	logerror("popoverGroupadmin.js", "saveLevels", "Can't reach servlet ./updateLevel or it throws an error");
							handleError(error_unspecified, error_wedontknow);
				        }
				    });
				}
				
			}
			if(typeof callback == "function"){
        		callback();
        	}
		}else{
			logerror("popoverGroupadmin.js", "saveLevels", "No group id is given. I can't create/update or remove a not assigned level/priority from the db!");
		}
	}
	
	/**
	 * This saves the colorsheme changes. That includes removed, updated and new colorshemes.
	 * @param callback
	 */
	function saveColorshemes(callback){
		if(isID(groupid)){
			for(var i = 0; i < vc.colors.length; i++){
				var cs_id = vc.colors[i].cs_id;
				var cs_name = vc.colors[i].cs_name;
				var cs_font = vc.colors[i].cs_font;
				var cs_bg = vc.colors[i].cs_bg;
				var cs_title = vc.colors[i].cs_title;
				var cs_titlebg = vc.colors[i].cs_titlebg;
				var cs_link = vc.colors[i].cs_link;
				var cs_border = vc.colors[i].cs_border;
				var cs_tblheaderbg = vc.colors[i].cs_tblheaderbg;
				var cs_tblfont01bg = vc.colors[i].cs_tblfont01bg;
				var cs_tblfont02bg = vc.colors[i].cs_tblfont02bg;
				var cs_tblheader = vc.colors[i].cs_tblheader;
				var cs_tblfont01 = vc.colors[i].cs_tblfont01;
				var cs_tblfont02 = vc.colors[i].cs_tblfont02;
				
				if(!isID(cs_id)){ //if this is not a number it means that it doesn't exist. so assign this one as a new colorsheme to the group
					$.ajax({
				        type: "POST",
				        data: {	groupid:groupid, cs_name:cs_name, cs_font:cs_font, cs_bg:cs_bg, cs_title:cs_title, cs_titlebg:cs_titlebg, cs_link:cs_link, 
				        		cs_border:cs_border, cs_tblheaderbg:cs_tblheaderbg, cs_tblfont01bg:cs_tblfont01bg, cs_tblfont02bg:cs_tblfont02bg,
				        		cs_tblheader:cs_tblheader, cs_tblfont01:cs_tblfont01, cs_tblfont02:cs_tblfont02},
				        url: "./addColorsheme",
				        success: function (data) {
				        	if(data == "norowsaffected"){
				        		logerror("popoverGroupadmin.js", "saveColorshemes", "Unable to add this colorsheme. The Database refuses the entry.");
				        		handleError(gen_dbrefuse, gen_dbrefuse_t);
				        	}
				        	loginfo("popoverGroupadmin.js", "saveColorshemes", "Added a new colorsheme to group " + groupid);
				        },
				        error: function(){
				        	logerror("popoverGroupadmin.js", "saveColorshemes", "Can't reach servlet ./addColorsheme or it throws an error");
							handleError(error_unspecified, error_wedontknow);
				        }
				    });
				}else{ //This colorsheme has an id. It exists in the database and should be updated
					$.ajax({
				        type: "POST",
				        data: {	cs_id:cs_id, groupid:groupid, cs_name:cs_name, cs_font:cs_font, cs_bg:cs_bg, cs_title:cs_title, cs_titlebg:cs_titlebg, cs_link:cs_link, 
				        		cs_border:cs_border, cs_tblheaderbg:cs_tblheaderbg, cs_tblfont01bg:cs_tblfont01bg, cs_tblfont02bg:cs_tblfont02bg,
				        		cs_tblheader:cs_tblheader, cs_tblfont01:cs_tblfont01, cs_tblfont02:cs_tblfont02},
				        url: "./updateColorsheme",
				        success: function (data) {
				        	if(data == "norowsaffected"){
				        		logerror("popoverGroupadmin.js", "saveColorshemes", "Unable to update the colorsheme " + cs_id + ". The Database refuses the entry.");
				        		handleError(gen_dbrefuse, gen_dbrefuse_t);
				        	}
				        	loginfo("popoverGroupadmin.js", "saveColorshemes", "Updated colorsheme "+ cs_id +" of group " + groupid);
				        },
				        error: function(){
				        	logerror("popoverGroupadmin.js", "saveColorshemes", "Can't reach servlet ./updateColorsheme or it throws an error");
							handleError(error_unspecified, error_wedontknow);
				        }
				    });
				}
			}
			if(typeof callback == "function"){
				callback();
			}
		}else{
			logerror("popoverGroupadmin.js", "saveLevels", "No group id is given. I can't create/update or remove a not assigned level/priority from the db!");
		}
	}
	
}

/**
 * This creates a summary with all values. Green ones are correct, red ones aren't
 * 
 * The function is huge but it fallows on a specific procedure.
 * 1. Theres a section for each tab
 * 2. In each section there are variables for the input fields in the referenced tab
 * 3. These variables have a suffix '_o' when some fixes like round, parseInt, fixhexcolor applys.
 * 4. All variables without a suffix will be controlled
 * 5. the variables with the '_final' suffix will be pushed into the given container. So that you can
 * access the validated variables
 * 6. The validation, push to the summary and push to the variable container happens after the readout of the variables of each section
 * 
 * @param mtc the multitab container reference to collect the data from it's multiple views
 * @return a gradminvalcontainer with all valid values in in. The ones which aren't valid are undefined. you can check if everything was valid by calling returnvalue.allValid()
 */
function checkGroupadminInput(mtc){
	loginfo("popoverGroupadmin.js", "checkGroupadminInput", "Check input fields and create summary");
	
	var settingsc = mtc.getView(groupadmin_settings);
	var levelsc = mtc.getView(groupadmin_prioritys);
	var colorsc = mtc.getView(groupadmin_colors);
	var saveView = mtc.getView(saveheader);
	
	//the container which will keep all validated values
	var vc = new gradminvalcontainer();
	
	//This will be set to false when something don't match
	vc.setValidation(true);
	
	//get the summary and subcontainer
	var summarys = $(saveView).find("div.summary:first").children(); //should be 3 div elements
	var sum_settings = $(saveView).find("div.summary:first").children("div.settings:first").children("table:first");
	var sum_levels = $(saveView).find("div.summary:first").children("div.levels:first").children("table:first");
	var sum_colors = $(saveView).find("div.summary:first").children("div.colors:first").children("table:first");
	
	//clear summary
	$(summarys).each(function(){
		$(this).children("table").children().remove();
	});
	
	//Values from basic settings tab
	var group_id = $(settingsc).find("input#group_id").val();
	var group_name = $(settingsc).find("input#groupadmin_groupname").val();
	var group_name_final;
	var group_pw = $(settingsc).find("input#groupadmin_password").val();
	var group_pw_final;
	var group_adminpw = $(settingsc).find("input#groupadmin_adminpassword").val();
	var group_adminpw_final;
	var group_desc = $(settingsc).find("textarea#groupadmin_description").val();
	var group_desc_final;
	
	var group_fieldresX_o = $(settingsc).find("input#groupadmin_fieldresolutionX").val();
	var group_fieldresY_o = $(settingsc).find("input#groupadmin_fieldresolutionY").val();
	var group_fieldresX = Math.round(parseInt(group_fieldresX_o));
	var group_fieldresY = Math.round(parseInt(group_fieldresY_o));
	var group_fieldresX_final;
	var group_fieldresY_final;
	
	var note_maxSizeX_o = $(settingsc).find("input#groupadmin_maxsizeX").val();
	var note_maxSizeY_o = $(settingsc).find("input#groupadmin_maxsizeY").val();
	var note_maxSizeX = Math.round(parseInt(note_maxSizeX_o));
	var note_maxSizeY = Math.round(parseInt(note_maxSizeY_o));
	var note_maxSizeX_final;
	var note_maxSizeY_final;
	
	var note_minSizeX_o = $(settingsc).find("input#groupadmin_minsizeX").val();
	var note_minSizeY_o = $(settingsc).find("input#groupadmin_minsizeY").val();
	var note_minSizeX = Math.round(parseInt(note_minSizeX_o));
	var note_minSizeY = Math.round(parseInt(note_minSizeY_o));
	var note_minSizeX_final;
	var note_minSizeY_final;
	
	var note_defaultSizeX_o = $(settingsc).find("input#groupadmin_defaultsizeX").val();
	var note_defaultSizeY_o = $(settingsc).find("input#groupadmin_defaultsizeY").val();
	var note_defaultSizeX = Math.round(parseInt(note_defaultSizeX_o));
	var note_defaultSizeY = Math.round(parseInt(note_defaultSizeY_o));
	var note_defaultSizeX_final;
	var note_defaultSizeY_final;
	
	var comment_maxeditT_o = $(settingsc).find("input#groupadmin_commentedittime").val();
	var comment_maxeditT = Math.round(parseInt(comment_maxeditT_o));
	var comment_maxeditT_final;
	
	//validation settings tab
	if(group_name.length > 0){
		group_name_final = group_name;
		pts(groupadmin_lbl_groupname, group_name, true, "settings");
	}else{
		pts(groupadmin_lbl_groupname, groupadmin_missingstring, false, "settings");
	}
	
	group_pw_final = group_pw;
	pts(groupadmin_lbl_password, group_pw, true, "settings");
	
	if(group_adminpw.length > 0){
		group_adminpw_final = group_adminpw;
		pts(groupadmin_lbl_adminpassword, group_adminpw, true, "settings");
	}else{
		pts(groupadmin_lbl_adminpassword, groupadmin_missingstring, false, "settings");
	}
	
	group_desc_final = group_desc;
	pts(groupadmin_lbl_description, group_desc, true, "settings");
	
	if(!isNaN(group_fieldresX) && !isNaN(group_fieldresY)){
		group_fieldresX_final = group_fieldresX;
		group_fieldresY_final = group_fieldresY;
		pts(groupadmin_lbl_fieldresolution, group_fieldresX + "X" + group_fieldresY + " " + general_pica, true, "settings");
	}else{
		if(!(group_fieldresX_o.length > 0)){
			group_fieldresX_o = groupadmin_missingno;
		}
		if(!(group_fieldresY_o.length > 0)){
			group_fieldresY_o = groupadmin_missingno;
		}
		pts(groupadmin_lbl_fieldresolution, group_fieldresX_o + "X" + group_fieldresY_o + " " + general_pica, false, "settings");
	}
	
	if(!isNaN(note_maxSizeX) && !isNaN(note_maxSizeY)){
		note_maxSizeX_final = note_maxSizeX;
		note_maxSizeY_final = note_maxSizeY;
		pts(groupadmin_lbl_maxsize, note_maxSizeX + "X" + note_maxSizeY + " " + general_pica, true, "settings");
	}else{
		if(!(note_maxSizeX_o.length > 0)){
			note_maxSizeX_o = groupadmin_missingno;
		}
		if(!(note_maxSizeY_o.length > 0)){
			note_maxSizeY_o = groupadmin_missingno;
		}
		pts(groupadmin_lbl_maxsize, note_maxSizeX_o + "X" + note_maxSizeY_o + " " + general_pica, false, "settings");
	}
	
	if(!isNaN(note_minSizeX) && !isNaN(note_minSizeY)){
		note_minSizeX_final = note_minSizeX;
		note_minSizeY_final = note_minSizeY;
		pts(groupadmin_lbl_minsize, note_minSizeX + "X" + note_minSizeY + " " + general_pica, true, "settings");
	}else{
		if(!(note_minSizeX_o.length > 0)){
			note_minSizeX_o = groupadmin_missingno;
		}
		if(!(note_minSizeY_o.length > 0)){
			note_minSizeY_o = groupadmin_missingno;
		}
		pts(groupadmin_lbl_minsize, note_minSizeX_o + "X" + note_minSizeY_o + " " + general_pica, false, "settings");
	}
	
	if(!isNaN(note_defaultSizeX) && !isNaN(note_defaultSizeX)){
		note_defaultSizeX_final = note_defaultSizeX;
		note_defaultSizeY_final = note_defaultSizeY;
		pts(groupadmin_lbl_defaultsize, note_defaultSizeX + "X" + note_defaultSizeY + " " + general_pica, true, "settings");
	}else{
		if(!(note_defaultSizeX_o.length > 0)){
			note_defaultSizeX_o = groupadmin_missingno;
		}
		if(!(note_defaultSizeY_o.length > 0)){
			note_defaultSizeY_o = groupadmin_missingno;
		}
		pts(groupadmin_lbl_defaultsize, note_defaultSizeX_o + "X" + note_defaultSizeY_o + " " + general_pica, false, "settings");
	}
	
	if(!isNaN(comment_maxeditT)){
		comment_maxeditT_final = comment_maxeditT;
		pts(groupadmin_lbl_commentedittime, comment_maxeditT + " " + general_full_m, true, "settings");
	}else{
		if(!(comment_maxeditT_o.length > 0)){
			comment_maxeditT_o = groupadmin_missingno;
		}
		pts(groupadmin_lbl_commentedittime, comment_maxeditT_o + " " +general_full_m, false, "settings");
	}
	
	vc.pushsettings(group_id, group_name_final, group_pw_final, group_adminpw_final, group_desc_final, 
					group_fieldresX_final, group_fieldresY_final, note_maxSizeX_final, note_maxSizeY_final, 
					note_minSizeX_final, note_minSizeY_final, note_defaultSizeX_final, note_defaultSizeY_final,
					comment_maxeditT_final);
	
	//Values from prioritys tab
	var level_ids = $(levelsc).find("button.groupadmin_removelevel");
	var level_weights = $(levelsc).find("input.groupadmin_levelweight");
	var level_fonts = $(levelsc).find("input.groupadmin_levelcolor");
	var level_bgs = $(levelsc).find("input.groupadmin_levelbgcolor");
	var level_blinkers = $(levelsc).find("input.groupadmin_levelundeletable");
	var level_descs = $(levelsc).find("input.groupadmin_leveldescription");
	var levelrowcount = $(level_weights).length; //Suboptimal because there are more than just that input field. but because of the structure it isn't possible to count the rows. and every row has this field.
	for(var i = 0; i < levelrowcount; i++){
		var level_id = $(level_ids).eq(i).attr("data-id");
		var level_weight_o = $(level_weights).eq(i).val();
		var level_weight = Math.round(parseInt(level_weight_o));
		var level_weight_final;
		var level_font_o = $(level_fonts).eq(i).val();
		var level_font = fixhexcolor(level_font_o);
		var level_font_final;
		var level_bg_o = $(level_bgs).eq(i).val();
		var level_bg = fixhexcolor(level_bg_o);
		var level_bg_final;
		var level_blink = $(level_blinkers).eq(i).prop("checked");
		var level_blink_final;
		var level_desc = $(level_descs).eq(i).val();
		var level_desc_final;
		
		//Validation priotirys tab
		if(!isNaN(level_weight)){
			pts(groupadmin_lbl_lvlweight, level_weight, true, "levels");
			level_weight_final = level_weight;
		}else{
			pts(groupadmin_lbl_lvlweight, groupadmin_missingno, false, "levels");
		}
		
		if(level_desc.length > 0){
			level_desc_final = level_desc;
			pts(groupadmin_lbl_lvldescription, level_desc, true, "levels");
		}else{
			pts(groupadmin_lbl_lvldescription, groupadmin_missingstring, false, "levels");
		}
		
		if(level_blink == true){
			level_blink_final = 1;
			pts(groupadmin_lbl_lvlisblinking, general_yes, true, "levels");
		}else{
			level_blink_final = 0;
			pts(groupadmin_lbl_lvlisblinking, general_no, true, "levels");
		}
		
		if(checkhexcolor(level_font) == true){
			level_font_final = level_font;
			pts(groupadmin_lbl_lvlcolor, level_font, true, "levels");
		}else{
			if(!(level_font_o.length > 0)){
				level_font_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_lvlcolor, level_font_o, false, "levels");
		}
		
		if(checkhexcolor(level_bg) == true){
			level_bg_final = level_bg;
			pts(groupadmin_lbl_lvlbgcolor, level_bg, true, "levels");
		}else{
			if(!(level_bg_o.length > 0)){
				level_bg_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_lvlbgcolor, level_bg_o, false, "levels");
		}
		
		vc.pushlevel(	level_id, level_weight_final, level_font_final, level_bg_final,
						level_blink_final, level_desc_final);
	}
	
	
	//Values from colors tab
	var colorshemes = $(colorsc).find("div.onecolorsheme");
	var colorshemescount = $(colorshemes).length;
	for(var i = 0; i < colorshemescount; i++){
		var cs_id = $(colorshemes).eq(i).find("button.groupadmin_removecs").attr("data-id");
		var cs_name = $(colorshemes).eq(i).find("input.groupadmin_csname:first").val();
		var cs_font_o = $(colorshemes).eq(i).find("input.groupadmin_csfont:first").val();
		var cs_bg_o = $(colorshemes).eq(i).find("input.groupadmin_csbg:first").val();
		var cs_title_o = $(colorshemes).eq(i).find("input.groupadmin_cstitle:first").val();
		var cs_titlebg_o = $(colorshemes).eq(i).find("input.groupadmin_csbgtitle:first").val();
		var cs_link_o = $(colorshemes).eq(i).find("input.groupadmin_cslink:first").val();
		var cs_border_o = $(colorshemes).eq(i).find("input.groupadmin_csborders:first").val();
		var cs_tblheaderbg_o = $(colorshemes).eq(i).find("input.groupadmin_cstblheaderbg:first").val();
		var cs_tblfont01bg_o = $(colorshemes).eq(i).find("input.groupadmin_cstblz01bg:first").val();
		var cs_tblfont02bg_o = $(colorshemes).eq(i).find("input.groupadmin_cstblz02bg:first").val();
		var cs_tblheader_o = $(colorshemes).eq(i).find("input.groupadmin_cstblheader:first").val();
		var cs_tblfont01_o = $(colorshemes).eq(i).find("input.groupadmin_cstblz01font:first").val();
		var cs_tblfont02_o = $(colorshemes).eq(i).find("input.groupadmin_cstblz02font:first").val();
		
		var cs_font = fixhexcolor(cs_font_o);
		var cs_bg = fixhexcolor(cs_bg_o);
		var cs_title = fixhexcolor(cs_title_o);
		var cs_titlebg = fixhexcolor(cs_titlebg_o);
		var cs_link = fixhexcolor(cs_link_o);
		var cs_border = fixhexcolor(cs_border_o);
		var cs_tblheaderbg = fixhexcolor(cs_tblheaderbg_o);
		var cs_tblfont01bg = fixhexcolor(cs_tblfont01bg_o);
		var cs_tblfont02bg = fixhexcolor(cs_tblfont02bg_o);
		var cs_tblheader = fixhexcolor(cs_tblheader_o);
		var cs_tblfont01 = fixhexcolor(cs_tblfont01_o);
		var cs_tblfont02 = fixhexcolor(cs_tblfont02_o);
		
		var cs_name_final;
		var cs_font_final;
		var cs_bg_final;
		var cs_title_final;
		var cs_titlebg_final;
		var cs_link_final;
		var cs_border_final;
		var cs_tblheaderbg_final;
		var cs_tblfont01bg_final;
		var cs_tblfont02bg_final;
		var cs_tblheader_final;
		var cs_tblfont01_final;
		var cs_tblfont02_final;
		
		//Validation colors tab
		if(cs_name.length > 0){
			cs_name_final = cs_name;
			pts(groupadmin_lbl_colorsheme, cs_name, true, "colors");
		}else{
			pts(groupadmin_lbl_colorsheme, groupadmin_missingstring, false, "colors");
		}
		
		if(checkhexcolor(cs_font) == true){
			cs_font_final = cs_font;
			pts(groupadmin_lbl_cs_font, cs_font, true, "colors");
		}else{
			if(!(cs_font_o.length > 0)){
				cs_font_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_font, cs_font_o, false, "colors");
		}
		
		if(checkhexcolor(cs_bg) == true){
			cs_bg_final = cs_bg;
			pts(groupadmin_lbl_cs_bg, cs_bg, true, "colors");
		}else{
			if(!(cs_bg_o.length > 0)){
				cs_bg_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_bg, cs_bg_o, false, "colors");
		}
		
		if(checkhexcolor(cs_title) == true){
			cs_title_final = cs_title;
			pts(groupadmin_lbl_cs_title, cs_title, true, "colors");
		}else{
			if(!(cs_title_o.length > 0)){
				cs_title_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_title, cs_title_o, false, "colors");
		}
		
		if(checkhexcolor(cs_titlebg) == true){
			cs_titlebg_final = cs_titlebg;
			pts(groupadmin_lbl_cs_bg_title, cs_titlebg, true, "colors");
		}else{
			if(!(cs_titlebg_o.length > 0)){
				cs_titlebg_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_bg_title, cs_titlebg_o, false, "colors");
		}
		
		if(checkhexcolor(cs_link) == true){
			cs_link_final = cs_link;
			pts(groupadmin_lbl_cs_link, cs_link, true, "colors");
		}else{
			if(!(cs_link_o.length > 0)){
				cs_link_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_link, cs_link_o, false, "colors");
		}
		
		if(checkhexcolor(cs_border) == true){
			cs_border_final = cs_border;
			pts(groupadmin_lbl_cs_borders, cs_border, true, "colors");
		}else{
			if(!(cs_border_o.length > 0)){
				cs_border_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_borders, cs_border_o, false, "colors");
		}
		
		if(checkhexcolor(cs_tblheaderbg) == true){
			cs_tblheaderbg_final = cs_tblheaderbg;
			pts(groupadmin_lbl_cs_tbl_header, cs_tblheaderbg, true, "colors");
		}else{
			if(!(cs_tblheaderbg_o.length > 0)){
				cs_tblheaderbg_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_tbl_header, cs_tblheaderbg_o, false, "colors");
		}
		
		if(checkhexcolor(cs_tblfont01bg) == true){
			cs_tblfont01bg_final = cs_tblfont01bg;
			pts(groupadmin_lbl_cs_tbl_z01, cs_tblfont01bg, true, "colors");
		}else{
			if(!(cs_tblfont01bg_o.length > 0)){
				cs_tblfont01bg_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_tbl_z01, cs_tblfont01bg_o, false, "colors");
		}
		
		if(checkhexcolor(cs_tblfont02bg) == true){
			cs_tblfont02bg_final = cs_tblfont02bg;
			pts(groupadmin_lbl_cs_tbl_z02, cs_tblfont02bg, true, "colors");
		}else{
			if(!(cs_tblfont02bg_o.length > 0)){
				cs_tblfont02bg_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_tbl_z02, cs_tblfont02bg_o, false, "colors");
		}
		
		if(checkhexcolor(cs_tblheader) == true){
			cs_tblheader_final = cs_tblheader;
			pts(groupadmin_lbl_cs_tbl_headerfont, cs_tblheader, true, "colors");
		}else{
			if(!(cs_tblheader_o.length > 0)){
				cs_tblheader_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_tbl_headerfont, cs_tblheader_o, false, "colors");
		}
		
		if(checkhexcolor(cs_tblfont01) == true){
			cs_tblfont01_final = cs_tblfont01;
			pts(groupadmin_lbl_cs_tbl_z01font, cs_tblfont01, true, "colors");
		}else{
			if(!(cs_tblfont01_o.length > 0)){
				cs_tblfont01_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_tbl_z01font, cs_tblfont01_o, false, "colors");
		}
		
		if(checkhexcolor(cs_tblfont02) == true){
			cs_tblfont02_final = cs_tblfont02;
			pts(groupadmin_lbl_cs_tbl_z02font, cs_tblfont02, true, "colors");
		}else{
			if(!(cs_tblfont02_o.length > 0)){
				cs_tblfont02_o = groupadmin_missingstring;
			}
			pts(groupadmin_lbl_cs_tbl_z02font, cs_tblfont02_o, false, "colors");
		}

		vc.pushcolorsheme(	cs_id, cs_name_final, cs_font_final, cs_bg_final, cs_title_final, cs_titlebg_final,
							cs_link_final, cs_border_final, cs_tblheaderbg_final, cs_tblfont01bg_final,
							cs_tblfont02bg_final, cs_tblheader_final, cs_tblfont01_final, cs_tblfont02_final);
	}
	
	/**
	 * This will try to fix every value which isn't in the format #000000 (only common things)
	 *@param rgbhex
	 *@return rgbhex in format #000000
	 */
	function fixhexcolor(rgbhex){
		rgbhex = rgbhex.trim();
		var ret = rgbhex;
		if(rgbhex.length == 6){
			ret = "#" + rgbhex;
			loginfo("popoverGroupadmin.js", "fixhexcolor", "A fix for the given color: " + rgbhex + " was applied. Now it is: " + ret);
		}else if(rgbhex.length == 3){
			ret = "#" + (rgbhex.substring(0,1) + "0") + (rgbhex.substring(1,2) + "0") + (rgbhex.substring(2,3) + "0");
			loginfo("popoverGroupadmin.js", "fixhexcolor", "A fix for the given color: " + rgbhex + " was applied. Now it is: " + ret);
		}
		if(rgbhex.length == 4){
			ret = (rgbhex.substring(0,2) + "0") + (rgbhex.substring(2,3) + "0") + (rgbhex.substring(3,4) + "0");
			loginfo("popoverGroupadmin.js", "fixhexcolor", "A fix for the given color: " + rgbhex + " was applied. Now it is: " + ret);
		}
		return ret;
	}
	
	/**
	 * This returns true if the given hexcolor is in the format #000000
	 * @param rgbhex
	 * @return true/false
	 */
	function checkhexcolor(rgbhex){
		if(rgbhex.match(new RegExp("^#[0-9|A-F]{6}$", "i"))){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * This pushes the given value into the given summary
	 * @param title
	 * @param val
	 * @param valid true/false
	 * @param summary ("settings", "levels", "colors")
	 */
	function pts(title, val, valid, summary){
		loginfo("popoverGroupadmin.js", "pts", "Push an entry into the summary");
		var cssclass = "correct";
		if(valid == true){
			loginfo("popoverGroupadmin.js", "pts", "The value of the input '" + title + "' is valid");
			cssclass = "correct";
		}else{
			logwarning("popoverGroupadmin.js", "pts", "The value of the input '" + title + "' is not valid!");
			vc.setValidation(false);
			cssclass = "wrong";
		}
		switch(summary){
		case "settings":
			$(sum_settings).append("<tr class='"+cssclass+"' ><td>"+title+"</td><td>"+val+"</td></tr>");
			break;
		case "levels":
			if(title == groupadmin_lbl_lvlweight){
				$(sum_levels).append("<tr class='line' ><td></td><td></td></tr>");
			}
			$(sum_levels).append("<tr class='"+cssclass+"' ><td>"+title+"</td><td>"+val+"</td></tr>");
			break;
		case "colors":
			if(title == groupadmin_lbl_colorsheme){
				$(sum_colors).append("<tr class='line' ><td></td><td></td></tr>");
			}
			$(sum_colors).append("<tr class='"+cssclass+"' ><td>"+title+"</td><td>"+val+"</td></tr>");
			break;
		}
	}
	
	$(summarys).each(function(){
		$(this).children("table").children().fadeIn(250);
	});
	return vc;
}

/**
 * This is a container for lists with elements which have to be removed.
 */
function gradminremovequeues(){
	loginfo("popoverGroupadmin.js", "gradminremovequeues", "Create remove queue container");
	this.removedlevels = new Array();
	this.removedcolors = new Array();
}

/**
 * This adds the id of a removed and currently in the db present level to the gradminvalcontainer.removedlevels array.
 * @param level_id
 */
gradminremovequeues.prototype.addLevel = function(level_id){
	if(!isNaN(level_id) && parseInt(level_id) > 0){
		loginfo("popoverGroupadmin.js", "gradminremovequeues.prototype.addLevel", "Add priority/level " + level_id + " to remove queue.");
		var entry = {level_id:parseInt(level_id)};
		this.removedlevels.push(entry);
	}else{
		loginfo("popoverGroupadmin.js", "gradminremovequeues.prototype.addLevel", "No valid id is given I assume that this entry doesn't exist in the db - there's nothing to remove");
	}
}

/**
 * This adds the id of a removed and currently in the db present colorsheme to the gradminvalcontainer.removedcolors array.
 * @param cs_id
 */
gradminremovequeues.prototype.addColorsheme = function(cs_id){
	if(!isNaN(cs_id) && parseInt(cs_id) > 0){
		loginfo("popoverGroupadmin.js", "gradminremovequeues.prototype.addColorsheme", "Add colorsheme " + cs_id + " to remove queue.");
		var entry = {cs_id:parseInt(cs_id)};
		this.removedcolors.push(entry);
	}else{
		loginfo("popoverGroupadmin.js", "gradminremovequeues.prototype.addColorsheme", "No valid id is given I assume that this entry doesn't exist in the db - there's nothing to remove");
	}
}


/**
 * This is a container for all groupadmin gui input.
 * The checkGroupadminInput function pushes them into it.
 */
function gradminvalcontainer(){
	loginfo("popoverGroupadmin.js", "gradminvalcontainer", "Create groupadmin valuecontainer ");
	this.group_id;
	this.group_name;
	this.group_pw;
	this.group_adminpw;
	this.group_desc;
	this.group_fieldresX;
	this.group_fieldresY;
	this.note_maxSizeX;
	this.note_maxSizeY;
	this.note_minSizeX;
	this.note_minSizeY;
	this.note_defaultSizeX;
	this.note_defaultSizeY;
	this.comment_maxeditT;
	this.levels = new Array();
	this.colors = new Array();
	this.isValid;
}

/**
 * Push the validated input from the groupadmin gui basic settings tab into the gradminvalcontainer
 * @param group_id
 * @param group_name
 * @param group_pw
 * @param group_adminpw
 * @param group_desc
 * @param group_fieldresX
 * @param group_fieldresY
 * @param note_maxSizeX
 * @param note_maxSizeY
 * @param note_minSizeX
 * @param note_minSizeY
 * @param note_defaultSizeX
 * @param note_defaultSizeY
 * @param comment_maxeditT
 */
gradminvalcontainer.prototype.pushsettings = function(group_id, group_name, group_pw, group_adminpw, group_desc, group_fieldresX, group_fieldresY, note_maxSizeX, note_maxSizeY, note_minSizeX, note_minSizeY, note_defaultSizeX, note_defaultSizeY, comment_maxeditT){
	loginfo("popoverGroupadmin.js", "gradminvalcontainer.prototype.pushsettings", "Push settings into groupadmin valuecontainer");
	this.group_id = group_id;
	this.group_name = group_name;
	this.group_pw = group_pw;
	this.group_adminpw = group_adminpw;
	this.group_desc = group_desc;
	this.group_fieldresX = group_fieldresX;
	this.group_fieldresY = group_fieldresY;
	this.note_maxSizeX = note_maxSizeX;
	this.note_maxSizeY = note_maxSizeY;
	this.note_minSizeX = note_minSizeX;
	this.note_minSizeY = note_minSizeY;
	this.note_defaultSizeX = note_defaultSizeX;
	this.note_defaultSizeY = note_defaultSizeY;
	this.comment_maxeditT = comment_maxeditT;
}

/**
 * This pushes a level row from the validatet input of the groupadmin gui priotity tab into the gradminvalcontainer. The parameter names are used as key names.
 * @param level_id
 * @param level_weight
 * @param level_font
 * @param level_bg
 * @param level_blink
 * @param level_desc
 */
gradminvalcontainer.prototype.pushlevel = function(level_id, level_weight, level_font, level_bg, level_blink, level_desc){
	loginfo("popoverGroupadmin.js", "gradminvalcontainer.prototype.pushlevel", "Push one level/priority into groupadmin valuecontainer");
	var row = {	level_id:level_id,
				level_weight:level_weight, 
				level_font:level_font, 
				level_bg:level_bg, 
				level_blink:level_blink, 
				level_desc:level_desc
				};
	this.levels.push(row);
}

/**
 * This pushes a colorsheme from the validatet input of the groupadmin gui colors tab into the gradminvalcontainer. The parameter names are used as key names.
 * @param cs_id
 * @param cs_name
 * @param cs_font
 * @param cs_bg
 * @param cs_title
 * @param cs_titlebg
 * @param cs_link
 * @param cs_border
 * @param cs_tblheaderbg
 * @param cs_tblfont01bg
 * @param cs_tblfont02bg
 * @param cs_tblheader
 * @param cs_tblfont01
 * @param cs_tblfont02
 */
gradminvalcontainer.prototype.pushcolorsheme = function(cs_id, cs_name, cs_font, cs_bg, cs_title, cs_titlebg, cs_link, cs_border, cs_tblheaderbg, cs_tblfont01bg, cs_tblfont02bg, cs_tblheader, cs_tblfont01, cs_tblfont02){
	loginfo("popoverGroupadmin.js", "gradminvalcontainer.prototype.pushcolorsheme", "Push one colorsheme into groupadmin valuecontainer");
	var row = {	cs_id:cs_id,
			cs_name:cs_name,
			cs_font:cs_font,
			cs_bg:cs_bg,
			cs_title:cs_title,
			cs_titlebg:cs_titlebg,
			cs_link:cs_link,
			cs_border:cs_border,
			cs_tblheaderbg:cs_tblheaderbg,
			cs_tblfont01bg:cs_tblfont01bg,
			cs_tblfont02bg:cs_tblfont02bg,
			cs_tblheader:cs_tblheader,
			cs_tblfont01:cs_tblfont01,
			cs_tblfont02:cs_tblfont02
			};
	this.colors.push(row);
}

/**
 * marks the container values as all valid/invalid
 * @param bool
 */
gradminvalcontainer.prototype.setValidation = function(bool){
	if(bool == true && bool != this.isValid){
		loginfo("popoverGroupadmin.js", "gradminvalcontainer.prototype.setValidation", "Change validation state to: " + bool);
		this.isValid = bool;
	}else if(bool == false && bool != this.isValid){
		loginfo("popoverGroupadmin.js", "gradminvalcontainer.prototype.setValidation", "Change validation state to: " + bool);
		this.isValid = bool;
	}
}

/**
 * Gets the validation state.
 * @return true/false or undefined if not set. 
 */
gradminvalcontainer.prototype.allValid = function(){
	loginfo("popoverGroupadmin.js", "gradminvalcontainer.prototype.allValid", "Get validation state. It is: " + this.isValid);
	return this.isValid;
}

/**
 * This function is called when the groupadmin gui is on edit mode. It will load all settings from the db into the gui
 * ready to edit.
 */
function loadGroupsettings(mtc){
	loginfo("popoverGroupadmin.js", "loadGroupsettings", "Try to load settings of group");
	$.ajax({
        type: "POST",
        url: './getGroupSettings',
        success: 	function (data) {
        				loginfo("popoverGroupadmin.js", "loadGroupsettings", "Got Settings of group");
        				fillIn(data);
			     	},
		error:		function(){
					logerror("popoverGroupadmin.js", "loadGroupsettings", "Can't reach servlet ./loadGroupsettings or it throws an error");
						handleError(error_unspecified, error_wedontknow);
					}
    });
	
	/**
	 * @param JSONObject, with JSONObject "SETTINGS", JSONObject "LEVELS" AND JSONObject "COLORSHEMES" As String. Generated with the servlet getGroupSettings.
	 */
	function fillIn(JSONString){
		loginfo("popoverGroupadmin.js", "fillIn", "Parse received group settings");
		var settingsview = mtc.getView(groupadmin_settings);
		var levelsview = mtc.getView(groupadmin_prioritys);
		var colorshemesview = mtc.getView(groupadmin_colors);
		
		var json_received = JSON.parse(JSONString);
		for(var subkey in json_received){
			//The settings of the group
			if(subkey == "SETTINGS"){
				var subobject = json_received[subkey];
				var id_group;
				var name;
				var password;
				var description;
				var admin_password;
				var field_resolution;
				var max_size;
				var min_size;
				var default_size;
				var max_commentedittime;
				$.each(subobject, function(key, value){
					switch(key){
						case "id_group": id_group = value; break;
						case "name": name = value; break;
						case "password": password = value; break;
						case "description": description = value; break;
						case "admin_password": admin_password = value; break;
						case "field_resolution": field_resolution = value; break;
						case "max_size": max_size = value; break;
						case "min_size": min_size = value; break;
						case "default_size": default_size = value; break;
						case "max_commentedittime": max_commentedittime = value; break;
					}
				})
				loginfo("popoverGroupadmin.js", "fillIn", "Basic settings part found");
				fillsettings(id_group, name, password, description, admin_password, field_resolution, max_size, min_size, default_size, max_commentedittime);
			}
			
			//The levels of the group
			if(subkey == "LEVELS"){
				loginfo("popoverGroupadmin.js", "fillIn", "Levels part found");
				var subobject = json_received[subkey]["ROWS"];
				$.each(subobject, function(key, value){//each level
					var subsubobject = value; //one level
					var id_level;
					var weight;
					var description;
					var font_color;
					var background_color;
					//var fk_profile; not used
					var isblinking;
					
					$.each(subsubobject, function(key, value){ //each value of a level
						switch(key){
							case "id_level": id_level = value; break;
							case "weight": weight = value; break;
							case "description": description = value; break;
							case "font_color": font_color = value; break;
							case "background_color": background_color = value; break;
							case "isblinking": isblinking = value; break;
						}
					});
					filllevel(id_level, weight, description, font_color, background_color, isblinking);
				})
			}
			
			
			//The colorshemes of the group
			if(subkey == "COLORSHEMES"){
				loginfo("popoverGroupadmin.js", "fillIn", "Colorshemes part found");
				var subobject = json_received[subkey]["ROWS"];
				$.each(subobject, function(key, value){ //each colorsheme
					var subsubobject = value; //one colorsheme
					var id_color;
					//var fk_profile; not used
					var description;
					var content_font;
					var content_background;
					var title_font;
					var title_background;
					var link_font;
					var borders;
					var table_header_background;
					var table_cell_01_background;
					var table_cell_02_background;
					var table_header_font;
					var table_cell_01_font;
					var table_cell_02_font;
					
					$.each(subsubobject, function(key, value){  //each value of a colorsheme
						switch(key){
							case "id_color": id_color = value; break;
							case "description": description = value; break;
							case "content_font": content_font = value; break;
							case "content_background": content_background = value; break;
							case "title_font": title_font = value; break;
							case "title_background": title_background = value; break;
							case "link_font": link_font = value; break;
							case "borders": borders = value; break;
							case "table_header_background": table_header_background = value; break;
							case "table_cell_01_background": table_cell_01_background = value; break;
							case "table_cell_02_background": table_cell_02_background = value; break;
							case "table_header_font": table_header_font = value; break;
							case "table_cell_01_font": table_cell_01_font = value; break;
							case "table_cell_02_font": table_cell_02_font = value; break;
						}
					});
					fillcolorsheme(	id_color, description, content_font, content_background, title_font, title_background, link_font, borders, 
							table_header_background, table_cell_01_background, table_cell_02_background, table_header_font, table_cell_01_font, table_cell_02_font);
				})
				
			}
			
		}
		
		/**
		 * Fill the settings into the groupadmin gui
		 * @param id_group
		 * @param name
		 * @param password
		 * @param description
		 * @param admin_password
		 * @param field_resolution
		 * @param max_size
		 * @param min_size
		 * @param default_size
		 * @param max_commentedittime
		 */
		function fillsettings(id_group, name, password, description, admin_password, field_resolution, max_size, min_size, default_size, max_commentedittime){
			loginfo("popoverGroupadmin.js", "fillsettings", "Fill reveiced settings into the admin gui");
			$(settingsview).find("input#group_id").val(id_group);
			$(settingsview).find("input#groupadmin_groupname").val(name);
			$(settingsview).find("input#groupadmin_password").val(password);
			$(settingsview).find("input#groupadmin_adminpassword").val(admin_password);
			$(settingsview).find("textarea#groupadmin_description").val(description);
			$(settingsview).find("input#groupadmin_fieldresolutionX").val(resolveXYSize(field_resolution)[0]);
			$(settingsview).find("input#groupadmin_fieldresolutionY").val(resolveXYSize(field_resolution)[1]);
			$(settingsview).find("input#groupadmin_maxsizeX").val(resolveXYSize(max_size)[0]);
			$(settingsview).find("input#groupadmin_maxsizeY").val(resolveXYSize(max_size)[1]);
			$(settingsview).find("input#groupadmin_minsizeX").val(resolveXYSize(min_size)[0]);
			$(settingsview).find("input#groupadmin_minsizeY").val(resolveXYSize(min_size)[1]);
			$(settingsview).find("input#groupadmin_defaultsizeX").val(resolveXYSize(default_size)[0]);
			$(settingsview).find("input#groupadmin_defaultsizeY").val(resolveXYSize(default_size)[1]);
			$(settingsview).find("input#groupadmin_commentedittime").val((max_commentedittime / 1000) / 60); //DB value uses ms the gui uses minutes
		}
		
		/**
		 * Fill one level into the groupadmin gui
		 * @param id_level
		 * @param weight
		 * @param description
		 * @param font_color
		 * @param background_color
		 * @param isblinking
		 */
		function filllevel(id_level, weight, description, font_color, background_color, isblinking){
			var rowindex;
			var btn_removelevels;
			var in_levelweights;
			var in_levelcolors;
			var in_levelbgcolors;
			var chkb_levelundeletables;
			var in_leveldescriptions;
			updatereferences();
			
			//if the line is empty add a new one
			if($(in_levelweights).val().length > 0 || $(in_levelcolors).val().length > 0 || $(in_levelbgcolors).val().length > 0 || $(in_leveldescriptions).val().length > 0 || $(chkb_levelundeletables).is(":checked")){
				$(levelsview).find("button.groupadmin_addlevel:first").trigger("click", function(){
					updatereferences(function(){
						fillline();
					})
				});
			}else{
				fillline();
			}
			
			/**
			 * enter the values
			 */
			function fillline(){
				$(btn_removelevels).attr("data-id", id_level);
				$(in_levelweights).val(weight);
				$(in_levelcolors).val(font_color);
				$(in_levelbgcolors).val(background_color);
				var undeletable;
				if(isblinking == "1"){
					undeletable = true;
				}else{
					undeletable = false;
				}
				$(chkb_levelundeletables).prop("checked", undeletable);
				$(in_leveldescriptions).val(description);
			}
			
			/**
			 * update the references of the last line
			 */
			function updatereferences(callback){
				rowindex = $(levelsview).find("input.groupadmin_levelweight").length - 1; //suboptimal because there are more than only this field on a row but should work anyway.
				btn_removelevels = $(levelsview).find("button.groupadmin_removelevel").eq(rowindex);
				in_levelweights = $(levelsview).find("input.groupadmin_levelweight").eq(rowindex);
				in_levelcolors = $(levelsview).find("input.groupadmin_levelcolor").eq(rowindex);
				in_levelbgcolors = $(levelsview).find("input.groupadmin_levelbgcolor").eq(rowindex);
				chkb_levelundeletables = $(levelsview).find("input.groupadmin_levelundeletable").eq(rowindex);
				in_leveldescriptions = $(levelsview).find("input.groupadmin_leveldescription").eq(rowindex);
				if(typeof callback == "function"){
					callback();
				}
			}

		}
		
		/**
		 * Fill one colorsheme into the groupadmin gui
		 * @param id_color
		 * @param description
		 * @param content_font
		 * @param content_background
		 * @param title_font
		 * @param title_background
		 * @param link_font
		 * @param borders
		 * @param table_header_background
		 * @param table_cell_01_background
		 * @param table_cell_02_background
		 * @param table_header_font
		 * @param table_cell_01_font
		 * @param table_cell_01_font
		 */
		function fillcolorsheme(id_color, description, content_font, content_background, title_font, title_background, link_font, borders, table_header_background, table_cell_01_background, table_cell_02_background, table_header_font, table_cell_01_font, table_cell_02_font){
			$(colorshemesview).find("div#onemptybtnholder").find("button.groupadmin_addcs:first").triggerHandler("click", function(){
				var newsheme = $(colorshemesview).find("div.onecolorsheme:last");
				$(newsheme).find("input.groupadmin_csname").val(description);
				$(newsheme).find("input.groupadmin_csfont").val(content_font);
				$(newsheme).find("input.groupadmin_csbg").val(content_background);
				$(newsheme).find("input.groupadmin_cstitle").val(title_font);
				$(newsheme).find("input.groupadmin_csbgtitle").val(title_background);
				$(newsheme).find("input.groupadmin_cslink").val(link_font);
				$(newsheme).find("input.groupadmin_csborders").val(borders);
				$(newsheme).find("input.groupadmin_cstblheaderbg").val(table_header_background);
				$(newsheme).find("input.groupadmin_cstblz01bg").val(table_cell_01_background);
				$(newsheme).find("input.groupadmin_cstblz02bg").val(table_cell_02_background);
				$(newsheme).find("input.groupadmin_cstblheader").val(table_header_font);
				$(newsheme).find("input.groupadmin_cstblz01font").val(table_cell_01_font);
				$(newsheme).find("input.groupadmin_cstblz02font").val(table_cell_02_font);
				$(newsheme).find("button.groupadmin_removecs").attr("data-id", id_color);
			});
		}
	}
}
