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
$('#body').ready(function(){
	loadlang();
});

/**
 * This will import the correct language file for the client side messages
 */
function loadlang(){
	var lang = null;
	var lang_import = null;
	
	$.ajax({
        type: "POST",
        url: './dynamic/getLanguage.jsp',
        data: {},
        async: false,
        success: function (data) {
        	lang = data;
        },
        error: function(){
        	lang = navigator.language || navigator.userLanguage;
        }
    });
	switch(lang){
	case "de":
		lang_import = "<script type='text/javascript' src='./lib/lang/de.js' charset='UTF-8'></script>";
		break;
	case "ch":
		lang_import = "<script type='text/javascript' src='./lib/lang/de.js' charset='UTF-8'></script>";
		break;
	case "en":
		lang_import = "<script type='text/javascript' src='./lib/lang/en.js' charset='UTF-8'></script>";
		break;
	default:
		lang_import = "<script type='text/javascript' src='./lib/lang/en.js' charset='UTF-8'></script>";
		break;
	}
	$('head').append(lang_import);
}