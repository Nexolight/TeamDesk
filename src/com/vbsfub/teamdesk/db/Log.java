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
package com.vbsfub.teamdesk.db;

/**
 * A little log tool
 */
public class Log {
	private String logholder;
	
	/**
	 * minimalized println. use this to start a console output.
	 */
	public void spStart(){
		logholder = "";
		spLine();
		spLine();
		for(int i = 0; i < 500; i++){
			logholder += "-";
		}
		spLine();
		logholder += "[LOG START]";
		spLine();
		for(int i = 0; i < 500; i++){
			logholder += "-";
		}
		spLine();
	}
	
	/**
	 * minimalized println. use this to start a console output.
	 */
	public void spEnd(){
		for(int i = 0; i < 500; i++){
			logholder += "-";
		}
		spLine();
		logholder += "[LOG END]";
		spLine();
		for(int i = 0; i < 500; i++){
			logholder += "-";
		}
		spLine();
		spLine();
		System.out.println(logholder);
		logholder = "";
	}

	/**
	 * minimalized println command. Use this for lines
	 * @param String toprint
	 * @param int tabs
	 */
	public void sp(Object toprint, int tabs){
		String tspace = "    ";
		for(int i = 0; i<tabs; i++){
			tspace += "    ";
		}
		logholder += tspace + toprint;
		spLine();
	}
	
	/**
	 * minimalized println. use this for titles
	 * @param String title
	 * @param int tabs
	 */
	public void spTitle(String title, int tabs){
		String tspace = "    ";
		for(int i = 0; i<tabs; i++){
			tspace += "----";
		}
		String tmp = tspace+title;
		logholder += tmp;
		spLine();
		
		spLine();
	}
	
	/**
	 * Adds an empty line in the console
	 */
	public void spLine(){
		logholder += System.getProperty("line.separator");
	}
}
