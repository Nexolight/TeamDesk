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
 * Creates a Object used to ask the user out.
 * you have to set each button and if you want a input field after you have called this.
 * Show the window with askWindow.appendTo(JQuery Object)
 * @param title
 * @param question
 */
function askWindow(title, question){
	loginfo("askWindow.js", "askWindow", "Create a window to ask the user out");
	this.myWindow = $(	"<div class='ask_windowholder' style='display:none'>" +
							"<div class='ask_windowheader'>"+title+"</div>" +
							"<div class='ask_flash'></div>" +
							"<div class='ask_windowcontent'>" +
								"<div class='ask_windowcontent_question'>"+question+"</div>" +
							"</div>" +
							"<div class='ask_windowbtns'>" +
							"</div>" +
						"</div>");
	this.header = $(this.myWindow).children("div.ask_windowheader:first");
	this.buttonholder = $(this.myWindow).children("div.ask_windowbtns:first");
	this.windowcontent = $(this.myWindow).children("div.ask_windowcontent:first");
	this.flashcolor = $(this.myWindow).children("div.ask_flash:first").css("background-color");
	this.userinput;
}

/**
 * Adds a Yes button with the given function
 * @param callback
 */
askWindow.prototype.btnYes = function(callback){
	loginfo("askWindow.js", "askWindow.prototype.btnYes", "Add a yes button");
	var btnYes = $("<button class='default entersensitive'>"+askwindow_btnyes+"</button>");
	$(this.buttonholder).append($(btnYes));
	$(btnYes).click(function(){
		callback();
	});
}

/**
 * Adds a no button with the given function
 * @param callback
 */
askWindow.prototype.btnNo = function(callback){
	loginfo("askWindow.js", "askWindow.prototype.btnNo", "Add a no button");
	var btnNo = $("<button class='default'>"+askwindow_btnno+"</button>");
	$(this.buttonholder).append($(btnNo));
	$(btnNo).click(function(){
		callback();
	});
}

/**
 * Adds a cancel button with the given function
 * @param callback
 */
askWindow.prototype.btnCancel = function(callback){
	loginfo("askWindow.js", "askWindow.prototype.btnCancel", "Add a cancel button");
	var btnCancel = $("<button class='default'>"+askwindow_btncancel+"</button>");
	$(this.buttonholder).append($(btnCancel));
	$(btnCancel).click(function(){
		callback();
	});
}

/**
 * Adds a ok button with the given function
 * @param callback
 */
askWindow.prototype.btnOk = function(callback){
	loginfo("askWindow.js", "askWindow.prototype.btnOk", "Add a ok button");
	var btnOk = $("<button class='default entersensitive'>"+askwindow_btnok+"</button>");
	$(this.buttonholder).append($(btnOk));
	$(btnOk).click(function(){
		callback();
	});
}

/**
 * Adds a user input field
 * @param type 'text' or 'pw'
 */
askWindow.prototype.addUserinput = function(type){
	var uinput;
	if(type == "text"){
		loginfo("askWindow.js", "askWindow.prototype.addUserinput", "Add a text input field");
		uinput = $("<input type='text' class='default'></input>");
	}
	
	if(type == "pw"){
		loginfo("askWindow.js", "askWindow.prototype.addUserinput", "Add a password input field");
		uinput = $("<input type='password' class='default'></input>");
	}
	this.userinput = $(uinput);
	$(this.windowcontent).append($(this.userinput));
	var buttonholder = $(this.buttonholder);
	$(this.userinput).keypress(function(event){
		if ((event.which || event.keyCode) == 13){
			$(buttonholder).children("button.entersensitive:first").click();
		}
	});
}

/**
 * Returns the value from the user input field
 * @returns userinput
 */
askWindow.prototype.getUserinput = function(){
	loginfo("askWindow.js", "askWindow.prototype.getUserinput", "Return the made user input");
	return $(this.userinput).val();
}

/**s
 * Shows the user that the made input is invalid
 */
askWindow.prototype.invalidInput = function(){
	loginfo("askWindow.js", "askWindow.prototype.invalidInput", "Mark input as invalid");
	var userinput = $(this.userinput);
	redShakeFeedback($(userinput), function(){
		$(userinput).val("");
	});
}

/**
 * Append and show the window
 * @param dest_object JQuery Object
 */
askWindow.prototype.appendTo = function(dest_object){
	loginfo("askWindow.js", "askWindow.prototype.appendTo", "Append and show the ask out window");
	$(dest_object).append($(this.myWindow));
	$(this.myWindow).fadeIn(250);	
	makeMovable($(this.header),$(this.myWindow),$(dest_object));
	flashdiv($(this.myWindow), this.flashcolor, 10, 50);
	
	fixElementheight($(this.myWindow));
	fixElementwidth($(this.myWindow));
	$(window).resize(function(){
		fixElementheight($(this.myWindow));
		fixElementwidth($(this.myWindow));
	});
	if($(this.userinput).length > 0){
		$(this.userinput).focus();
	}
}

/**
 * Close and remove the window
 */
askWindow.prototype.close = function(){
	loginfo("askWindow.js", "askWindow.prototype.close", "Hide and Close the ask out window");
	$(this.myWindow).fadeOut(250, function(){
		$(this).remove();
	});
}