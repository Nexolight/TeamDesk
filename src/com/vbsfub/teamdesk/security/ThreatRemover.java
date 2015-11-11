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
package com.vbsfub.teamdesk.security;

/**
 * This class was made to do some security checks and remove dangerous parts from strings
 *
 */
public class ThreatRemover {
	
	public ThreatRemover(){
		
	}
	
	/**
	 * Removes all script tags and the content between them
	 * @param input
	 * @return
	 */
	public String replaceXSS(String input){
		String output = new String();
		output = input.replaceAll("(<[^\\<]*script[^\\>]*>)", "<span style='color:#ff0000;'>!XSS!</span>");
		return output;
	}
	
	
}
