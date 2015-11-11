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

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.UUID;

/**
 * Just a bunch of tools to parse Variables
 */
public class Tools {
	
	/**
	 * This makes a 2D array from a String ArrayList
	 * @param myList ArrayList<String[]>
	 * @return
	 */
	public String[][] stringArrayList_to_stringArray2D(ArrayList<String[]> myList){
		if(myList.size() > 0){
			String[] oneitem =  myList.get(0);
			
			String[][] my2DArr = new String[myList.size()][oneitem.length];
			
			for(int i = 0; i < myList.size(); i++){
				
				String[] currentItem = myList.get(i);
				
				for(int i2 = 0; i2 < oneitem.length; i2++){
					my2DArr[i][i2] = currentItem[i2];
				}
			}
			return my2DArr;
		}else{
			System.out.println("Your list is Empty - can't convert!");
			return null;
		}
	}
	
	/**
	 * This will resolve the 1366x768 measure format to [0] 1366 [1] 768
	 * @return int array 
	 */
	public int[] xResToInt(String xFormat){
		int[] ret = new int[2];
		ret[0] = Integer.valueOf(xFormat.split("[xX]")[0]);
		ret[1] = Integer.valueOf(xFormat.split("[xX]")[1]);
		return ret;
	}
	
	/**
	 * This returns a size/position format like 1366x786 from a given int array
	 * @param wh Int array [0] width/x [1] height/y
	 * @return String
	 */
	public String intToXRes(int[] wh){
		String ret = wh[0] + "x" + wh[1];
		return ret;
	}
	
	/**
	 * because Reasons..... The - causes problem when it's used for id's
	 * @return a uuid with replaced "-" to "_"
	 */
	public String getUUIDAsID(){
		return String.valueOf(UUID.randomUUID()).replace("-", "_");
	}
	
	/**
	 * Format a Timestamp to javascript friendly (Date) String
	 * @return
	 */
	public String formatTsToStr(Timestamp myTs){
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if(myTs != null){
			return dateformat.format(myTs);
		}else{
			return "";
		}
	}
	
	/**
	 * This converts an int to boolean. 1=true, 0=false
	 * @param value
	 * @return true for 1 and false for 0
	 */
	public boolean intToBoolean(int value){
		if(value == 1){
			return true;
		}else if(value == 0){
			return false;
		}else{
			return false;
		}
	}
	
	/**
	 * This converts a boolean into int true = 1, false = 0
	 * @param bool ture or false
	 * @return 1 for true, 0 for false
	 */
	public int booleanToInt(boolean bool){
		if(bool){
			return 1;
		}else{
			return 0;
		}
	}
}
