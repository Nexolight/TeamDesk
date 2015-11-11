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
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class Connector{
	private String dbms;
	private String dbUser;
	private String dbPassword;
	private String dbName;
	private String serverName;
	private String portNumber;
	
	public Connector(){
		List<String> foundSettings = new ArrayList<String>();
		try {
			InputStream mySettings = Thread.currentThread().getContextClassLoader().getResourceAsStream("/connection.txt");
			BufferedReader read = new BufferedReader(new InputStreamReader(mySettings));
			String row;
			while((row = read.readLine()) != null){
				if(row.matches("^->.*")){
					foundSettings.add(row.replace("->", "").replace(" ", "").replace("\t", ""));
				}
			}
			read.close();
			mySettings.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		int expectedSettings = 6;
		if(foundSettings.size() == expectedSettings){
			for(String row : foundSettings){
				String[] splitrow = row.split(":");
				switch(splitrow[0]){
				case "DatabaseManagementSystem":
					this.dbms = splitrow[1].replace("\"", "");
					break;
				case "DatabaseName":
					this.dbName = splitrow[1].replace("\"", "");
					break;
				case "DatabaseUser":
					this.dbUser = splitrow[1].replace("\"", "");
					break;
				case "DatabasePassword":
					this.dbPassword = splitrow[1].replace("\"", "");
					break;
				case "DatabaseHost":
					this.serverName = splitrow[1].replace("\"", "");
					break;
				case "DatabasePort":
					this.portNumber = splitrow[1].replace("\"", "");
					break;
				}
			}
		}else{
			System.out.println("Teamdesk -> Missing DB Settings, can't connect");
		}
		
	}
	
	public Connection getConnection() throws SQLException{	
	    Properties connectionProps = new Properties();
	    connectionProps.put("user", this.dbUser);
	    connectionProps.put("password", this.dbPassword);
	    Connection myConnection = null;
	    
	    
	    if (this.dbms.equals("mysql")) {
	    	try {
	            Class.forName("com.mysql.jdbc.Driver");
	        } catch (ClassNotFoundException e) {
	            e.printStackTrace();
	        }
	    	myConnection = DriverManager.getConnection(
	                   "jdbc:" + this.dbms + "://" +
	                   this.serverName +
	                   ":" + this.portNumber + "/" + dbName,
	                   connectionProps);
	    }
	    return myConnection;
	}
}
