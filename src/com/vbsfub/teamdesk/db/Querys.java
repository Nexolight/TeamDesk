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

import java.io.File;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.vbsfub.teamdesk.notes.Attachment;
import com.vbsfub.teamdesk.notes.Comment;
import com.vbsfub.teamdesk.notes.Editor;
import com.vbsfub.teamdesk.notes.Notecontainer;
import com.vbsfub.teamdesk.notes.Notecontent;

public class Querys {
	Connection myConn = null;
	Tools myTools = new Tools();
	
	/**
	 * if the class is loaded, the connection will be initialized
	 */
	public Querys(){
		Connector myConnector = new Connector();
		try {
			this.myConn = myConnector.getConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * This will return the minimap size depending on the profile resolution in the same format.
	 * @param groupname
	 * @param endWidth
	 * @return
	 */
	public int[] getMMRes(String groupname, int endWidth){
		int[] originSize = getProfRes(groupname);
		double[] sizeNow = {(double)originSize[0], (double)originSize[1]};
		while(sizeNow[0] >= (double)endWidth){
			sizeNow[0] = sizeNow[0] * 0.9999;
			sizeNow[1] = sizeNow[1] * 0.9999;
		}
		int[] ret = {(int)sizeNow[0], (int)sizeNow[1]};
		return ret;
	}
	
	/**
	 * This will return the display resolution from the choosen group
	 * @param groupname
	 * @return width and height
	 */
	public int[] getProfRes(String groupname){
		int[] ret = new int[2];
		String tmp = null;
		String query1 = ""
				+ "		SELECT field_resolution"
				+ "		FROM td_t_groups"	
				+ "		WHERE name LIKE '" + groupname + "';";
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			myRes.next();
			tmp = myRes.getString("field_resolution");
			myStm.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		ret = myTools.xResToInt(tmp);
		return ret;
	}
	
	
	/**
	 * This returns the group names with it's ids inside a 2d String Array
	 * @return
	 * [0] = ID<br>
	 * [1] = Name<br>
	 */
	public String[][] getGroups() {
		ArrayList<String[]> myList = new ArrayList<String[]>();
		String query1 = ""
				+ "		SELECT id_group, name"
				+ "		FROM td_t_groups;";
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			while(myRes.next()){
				String[] thisrow = {String.valueOf(myRes.getInt("id_group")), myRes.getString("name")};
				myList.add(thisrow);
			}
			myStm.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		String[][] ret = myTools.stringArrayList_to_stringArray2D(myList);
		return ret;
	}
	
	/**
	 * This returns the group description if it gets the group name.
	 * @param groupname The name from the group you want the description
	 * @return The group description
	 */
	public String getGroupDescription(String groupname){
		String ret = null;
		String query1 = ""
				+ "		SELECT description"
				+ "		FROM td_t_groups"
				+ "		WHERE name LIKE '" + groupname + "';";
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			while(myRes.next()){
				ret = myRes.getString("description");
			}
			myStm.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This will check if the password for the group is valid or not
	 * @param groupname The groupname you want to join
	 * @param password the password for the group
	 * @return
	 */
	public boolean checkGroupPermission(String groupname, String password){
		boolean ret = false;
		String query1;
		if(password != null){
			query1 = ""
			+ "		SELECT name, password"
			+ "		FROM td_t_groups"
			+ "		WHERE name LIKE '" + groupname + "' "
			+ "		AND password LIKE '" + password + "';";
		}else{
			query1 = ""
			+ "		SELECT name"
			+ "		FROM td_t_groups"
			+ "		WHERE name LIKE '" + groupname + "' "
			+ "		AND password IS NULL;";
		}
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			if(myRes.next()){
				String found_groupname = myRes.getString("name");
				if(found_groupname.equals(groupname)){
					if(password != null){
						String found_password = myRes.getString("password");
						if(found_password.equals(password)){
							ret = true;
						}else{
							ret = false;
						}
					}else{
						ret = true;
					}
				}else{
					ret = false;
				}
			}
			myStm.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This returns the min, max and default note sizes for the group
	 * @param groupname
	 * @return 
	 * [0] min size width<br>
	 * [1] min size height<br>
	 * [2] default size width<br>
	 * [3] default size height<br>
	 * [4] max size width<br>
	 * [5] max size height<br>
	 */
	public int[] getNoteSizes(String groupname){
		int[] ret = new int[6];
		String query1 = ""
				+ "		SELECT min_size, default_size, max_size"
				+ "		FROM td_t_groups"
				+ "		WHERE name LIKE '" + groupname + "';";
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			myRes.next();
			ret[0] = myTools.xResToInt(myRes.getString("min_size"))[0];
			ret[1] = myTools.xResToInt(myRes.getString("min_size"))[1];
			ret[2] = myTools.xResToInt(myRes.getString("default_size"))[0];
			ret[3] = myTools.xResToInt(myRes.getString("default_size"))[1];
			ret[4] = myTools.xResToInt(myRes.getString("max_size"))[0];
			ret[5] = myTools.xResToInt(myRes.getString("max_size"))[1];
			myStm.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This will return a List with all available levels for the group with their propreties.
	 * @param groupname
	 * @return
	 * [0] id_level<br>
	 * [1] weight<br>
	 * [2] description<br>
	 * [3] font_color<br>
	 * [4] background_color<br>
	 */
	public List<String[]> getLevels(String groupname){
		List<String[]> ret = new ArrayList<String[]>();
		String query1 = ""
				+ "		SELECT T1.id_level, T1.weight, T1.description, T1.font_color, T1.background_color"
				+ "		FROM td_t_levels AS T1"
				+ "		LEFT JOIN td_t_groups AS T2 ON T2.id_group = T1.fk_profile"
				+ "		WHERE T2.name LIKE '" + groupname + "'"
				+ "		ORDER BY T1.weight";
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			while(myRes.next()){
				String[] myrow = new String[5];
				myrow[0] = String.valueOf(myRes.getInt("id_level"));
				myrow[1] = String.valueOf(myRes.getInt("weight"));
				myrow[2] = myRes.getString("description");
				myrow[3] = myRes.getString("font_color");
				myrow[4] = myRes.getString("background_color");
				ret.add(myrow);
			}
			myStm.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This will return a String array which contains the data of a level with the given id and groupname
	 * @param groupname
	 * @param lvlid
	 * @return
	 * [0] id_level<br>
	 * [1] weight<br>
	 * [2] description<br>
	 * [3] font_color<br>
	 * [4] background_color<br>
	 * [5] isblinking<br>;
	 */
	public String[] getLevelById(String groupname, int lvlid){
		String[] ret = new String[6];
		String query1 = ""
				+ "		SELECT T1.id_level, T1.weight, T1.description, T1.font_color, T1.background_color, T1.isblinking"
				+ "		FROM td_t_levels AS T1"
				+ "		LEFT JOIN td_t_groups AS T2 ON T2.id_group = T1.fk_profile"
				+ "		WHERE T2.name LIKE '" + groupname + "' AND T1.id_level = " + lvlid
				+ "		ORDER BY T1.weight";
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			if(myRes.next()){
				ret[0] = String.valueOf(myRes.getInt("id_level"));
				ret[1] = String.valueOf(myRes.getInt("weight"));
				ret[2] = myRes.getString("description");
				ret[3] = myRes.getString("font_color");
				ret[4] = myRes.getString("background_color");
				ret[5] = String.valueOf( myRes.getInt("isblinking"));
			}
			myStm.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	
	/**
	 * This will return a String array List with selectable color palletes for the active settings in a group.
	 * @param groupname
	 * @return
	 * [0] = id<br>
	 * [1] = description<br>
	 */
	public ArrayList<String[]>getSelectableColorpalettes (String groupname){
		ArrayList<String[]> ret = new ArrayList<String[]>();
		
		String query1 = ""
				+ "		SELECT T2.id_color, T2.description"
				+ "		FROM td_t_groups AS T1"
				+ "		RIGHT JOIN td_t_selectablecolors AS T2 ON T2.fk_profile = T1.id_group"
				+ "		WHERE T1.name LIKE '" + groupname + "'"
				+ "		ORDER BY T2.description;";
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			while(myRes.next()){
				String[] myrow = new String[2];
				myrow[0] = myRes.getString("id_color");
				myrow[1] = myRes.getString("description");
				ret.add(myrow);
			}
			myStm.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This will return a String array which contains the colors from a specific id.
	 * @param groupname
	 * @return
	 * [0] = content_font
	 * [1] = content_background
	 * [2] = title_font
	 * [3] = title_background
	 * [4] = link_font
	 * [5] = borders
	 * [6] = table_header_background
	 * [7] = table_cell_01_background
	 * [8] = table_cell_02_background
	 * [9] = table_header_font
	 * [10] = table_cell_01_font
	 * [11] = table_cell_02_font
	 */
	public String[]getColorpalette(String groupname, int colorid){
		String[] ret = new String[12];
		
		String query1 = ""
				+ "		SELECT T2.content_font, T2.content_background, T2.title_font, T2.title_background, T2.link_font, T2.borders, T2.table_header_background, T2.table_cell_01_background, T2.table_cell_02_background, T2.table_header_font, T2.table_cell_01_font, T2.table_cell_02_font"
				+ "		FROM td_t_groups AS T1"
				+ "		RIGHT JOIN td_t_selectablecolors AS T2 ON T2.fk_profile = T1.id_group"
				+ "		WHERE T1.name LIKE '" + groupname + "' AND T2.id_color = "+ colorid
				+ "		ORDER BY T2.description;";
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			if(myRes.next()){
				ret[0] = myRes.getString("content_font");
				ret[1] = myRes.getString("content_background");
				ret[2] = myRes.getString("title_font");
				ret[3] = myRes.getString("title_background");
				ret[4] = myRes.getString("link_font");
				ret[5] = myRes.getString("borders");
				ret[6] = myRes.getString("table_header_background");
				ret[7] = myRes.getString("table_cell_01_background");
				ret[8] = myRes.getString("table_cell_02_background");
				ret[9] = myRes.getString("table_header_font");
				ret[10] = myRes.getString("table_cell_01_font");
				ret[11] = myRes.getString("table_cell_02_font");
			}else{
				ret = null;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * Returns the current DB Date in the mm.dd.yyyy format.
	 * @return
	 */
	public String getDBDate(){
		String ret = null;
		String query1 = ""
				+ "		SELECT CURDATE() AS datenow";
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			if(myRes.next()){
				String[] ret_tmp = myRes.getString("datenow").split("-");
				ret = ret_tmp[2] + "." + ret_tmp[1] + "." + ret_tmp[0];
			}
			myStm.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * Returns the current DB Time in the hh.mm format.
	 * @return
	 */
	public String getDBTime(){
		String ret = null;
		String query1 = ""
				+ "		SELECT CURTIME() AS timenow";
		try {
			Statement myStm = myConn.createStatement();
			ResultSet myRes = myStm.executeQuery(query1);
			if(myRes.next()){
				String[] ret_tmp = myRes.getString("timenow").split(":");
				ret = ret_tmp[0] + ":" + ret_tmp[1];
			}
			myStm.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This will add a new note.
	 * @param title The Title of the Note<br>
	 * @param content The maincontent of the note. That means the full content of the #createNoteOverlay_notecontent div<br>
	 * @param showtime A valid datetime when the note should be displayed. I will not check if it's valid ;)<br>
	 * @param archivetime  A valid datetime when the note should be archived. I will not check if it's valid.<br>
	 * @param posX The note it's distance from left on the map<br>
	 * @param posY The note it's distance from top on the map<br>
	 * @param fk_level The foreign key which points to the level -> means the note it's priority<br>
	 * @param size use 1366x768 format. It's the size of the note<br>
	 * @param groupname The name of the group where the note have to be posted<br>
	 * @param fk_colors The foreign key which points to the colorsheme which the note is using.<br>
	 * @param attachments A 2D String Array which contains informations about the Attachments.<br>
	 * @param user_ip The IP of the author<br>
	 * [for each][0] = Link<br>
	 * [for each][1] = Info<br>
	 * [for each][2] = Log<br>
	 */
	public void saveNewNote(String title, String content, String showtime, String archivetime, int posX, int posY, int fk_level, String size, String groupname, int fk_colors, String[][] attachments, String user_ip){
		int mynewid = 0;
		String query1 = ""
				+ "		INSERT INTO td_t_notes (title, content, showtime, archivetime, savetime, lastview, archived, pos_x, pos_y, fk_level, size, fk_group, fk_colors)"
				+ "		SELECT ?, ?, ?, ?, now(), now(), 0, ?, ?, ?, ?, T2.id_group, ?"
				+ "		FROM td_t_groups AS T2"
				+ "		WHERE T2.name LIKE ?;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1, Statement.RETURN_GENERATED_KEYS);
			pS1.setString(1, title);
			pS1.setString(2, content);
			
			if(showtime != null){
				pS1.setString(3, showtime);
			}else{
				pS1.setString(3, "now()");
			}
			
			if(archivetime != null){
				pS1.setString(4, archivetime);
			}else{
				pS1.setNull(4, Types.NULL);
			}
			pS1.setInt(5, posX);
			pS1.setInt(6, posY);
			pS1.setInt(7, fk_level);
			pS1.setString(8, size);
			if(fk_colors != 0){
				pS1.setInt(9, fk_colors);
			}else{
				pS1.setNull(9, Types.NULL);
			}
			pS1.setString(10, groupname);
			pS1.executeUpdate();
			
			ResultSet newRow = pS1.getGeneratedKeys();
			if(newRow.next()){
				mynewid = newRow.getInt(1);
			}
			pS1.close();
			
			if(mynewid != 0){
				addAttachments(attachments, mynewid, groupname);
				addEditor(mynewid, user_ip, groupname);
			}

		} catch (SQLException e1) {
			e1.printStackTrace();
		}
	}
	
	/**
	 * This adds new attachments to the note with the given id. Returns true if successful
	 * @param attachments A 2D String Array which contains informations about the Attachments.<br
	 * @param note_id The id of the notes
	 * @return true = successful, false = fail
	 */
	public boolean addAttachments(String[][] attachments , int note_id, String groupname){
		if(attachments != null){
			String query2 = ""
					+ "		INSERT INTO td_t_attachments(link, info, log, fk_note)"
					+ "		SELECT ?, ?, ?, T1.id_note"
					+ "		FROM td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		WHERE T1.id_note = "+note_id+" AND T2.name LIKE ?;";
			PreparedStatement pS2;
			try {
				int affectedrows = 0;
				pS2 = myConn.prepareStatement(query2);
				for(int i = 0; i < attachments.length; i++){
					
					pS2.setString(1, attachments[i][0]);
					pS2.setString(2, attachments[i][1]);
					pS2.setString(3, attachments[i][2]);
					pS2.setString(4, groupname);
					affectedrows += pS2.executeUpdate();
				}
				pS2.close();
				if(affectedrows > 0){
					return true;
				}else{
					return false;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}
		return false;
		
	}
	
	/**
	 * This will read out all Notes from the database which are in the given group
	 * @param groupname
	 * @return a Notecontainer List
	 */
	public List<Notecontainer> getVisibleGroupNotes(String groupname){
		List<Notecontainer> myNotecontainers = new ArrayList<Notecontainer>();

		//Get all notes
		String query1 = ""
				+ "		SELECT * FROM td_t_notes AS T1"
				+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
				+ "		WHERE T2.name LIKE '" + groupname + "' "
				+ "		AND T1.archived = 0 "
				+ "		AND (T1.archivetime > now() OR T1.archivetime IS NULL) "
				+ "		AND T1.showtime < now()"
				+ "		ORDER BY T1.id_note;";
		try {
			Statement myStm1 = myConn.createStatement();
			ResultSet myRes1 = myStm1.executeQuery(query1);
			while(myRes1.next()){
				//Get notecontent
				Notecontent myContent = new Notecontent(myRes1.getInt("id_note"),
														myRes1.getString("title"),
														myRes1.getString("content"),
														myRes1.getTimestamp("showtime"),
														myRes1.getTimestamp("archivetime"),
														myRes1.getTimestamp("savetime"),
														myRes1.getTimestamp("lastview"),
														myTools.intToBoolean(myRes1.getInt("archived")),
														myRes1.getInt("pos_x"),
														myRes1.getInt("pos_y"),
														myRes1.getInt("fk_level"),
														myRes1.getString("size"),
														myRes1.getInt("fk_group"),
														myRes1.getInt("fk_colors"),
														myRes1.getTimestamp("locked_at"),
														myRes1.getString("locked_by"));
				
				int tmp_id = myRes1.getInt("id_note"); //The id from the note to search attachments and comments
				
				//Get all attachments
				List<Attachment> myAttachments = new ArrayList<Attachment>(); 
				Statement myStm2 = myConn.createStatement();
				String query2 = ""
						+ "		SELECT * FROM td_t_attachments AS T1"
						+ "		WHERE T1.fk_note = "+tmp_id+";";
				ResultSet myRes2 = myStm2.executeQuery(query2);
				while(myRes2.next()){
					//Get attachment
					Attachment oneAttachment = new Attachment(	myRes2.getInt("id_attachment"),
																myRes2.getInt("fk_note"),
																myRes2.getString("link"),
																myRes2.getString("info"),
																myRes2.getString("log"));
					myAttachments.add(oneAttachment);
				}
				myStm2.close();
				
				
				//Get all comments
				List<Comment> myComments = new ArrayList<Comment>();
				Statement myStm3 = myConn.createStatement();
				String query3 = ""
						+ "		SELECT * FROM td_t_notecomments AS T1"
						+ "		WHERE T1.fk_note = "+tmp_id+";";
				ResultSet myRes3 = myStm3.executeQuery(query3);
				while(myRes3.next()){
					//Get comment					
					Comment oneComment = new Comment(	myRes3.getInt("id_comment"),
														myRes3.getInt("fk_note"),
														myRes3.getString("comment"),
														myRes3.getString("writer_ip"),
														myRes3.getTimestamp("savetime"),
														myRes3.getString("writer_name"));
					myComments.add(oneComment);
				}
				myStm3.close();
				
				
				//Get all editors
				List<Editor> myEditors = new ArrayList<Editor>();
				Statement myStm4 = myConn.createStatement();
				String query4 = ""
						+ "		SELECT * FROM td_t_editors AS T1"
						+ "		WHERE T1.fk_note = "+tmp_id+";";
				ResultSet myRes4 = myStm4.executeQuery(query4);
				while(myRes4.next()){
					//Get editor
					Editor oneEditor = new Editor(	myRes4.getInt("id_editor"), 
													myRes4.getInt("fk_note"),
													myRes4.getString("editor_ip"),
													myRes4.getTimestamp("edit_time"));
					myEditors.add(oneEditor);
				}
				myStm4.close();

				//Create the Notecontainer object
				Notecontainer myContainer = new Notecontainer(	tmp_id, 
																myContent,
																myAttachments,
																myEditors, 
																myComments);
				myNotecontainers.add(myContainer);
			}
			myStm1.close();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return myNotecontainers;
	}
	
	
	/**
	 * This adds an editor to a note
	 * It's Private because this happens automatically and should be called after the depending querys are executed
	 * @param fk_note
	 * @param editor_ip
	 * @param groupname 
	 */
	public void addEditor(int fk_note, String editor_ip, String groupname){
		String query1 = ""
				+ "		INSERT INTO td_t_editors(fk_note, editor_ip, edit_time)"
				+ "		SELECT T1.id_note, ?, now()"
				+ "		FROM td_t_notes AS T1"
				+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
				+ "		WHERE T1.id_note = ? AND T2.name LIKE ?;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);
			pS1.setString(1, editor_ip);
			pS1.setInt(2, fk_note);
			pS1.setString(3, groupname);
			pS1.executeUpdate();
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * This adds a comment to a note
	 * @param fk_note
	 * @param groupname
	 * @param comment
	 * @param writer_ip
	 * @param writer_name
	 */
	public void addComment(int fk_note, String groupname, String comment, String writer_ip, String writer_name){
		String query1 = ""
				+ "		INSERT INTO td_t_notecomments (fk_note, comment, writer_ip, savetime, writer_name)"
				+ "		SELECT T1.id_note, ?, ?, now(), ?"
				+ "		FROM td_t_notes AS T1"
				+ "		LEFT JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
				+ "		WHERE T1.id_note = ? AND T2.name LIKE ?;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);
			pS1.setString(1, comment);
			pS1.setString(2, writer_ip);
			pS1.setString(3, writer_name);
			pS1.setInt(4, fk_note);
			pS1.setString(5, groupname);
			pS1.executeUpdate();
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * This edits/updates a comment if it exists. Returns true if successful.
	 * @param fk_note
	 * @param id_comment
	 * @param groupname
	 * @param comment
	 * @param writer_ip
	 * @param writer_name
	 * @return true/false success/fail
	 */
	public boolean editComment(int fk_note, int id_comment, String groupname, String comment, String writer_ip, String writer_name){
		String query1 = ""
				+ "		UPDATE td_t_notecomments AS T1"
				+ "		INNER JOIN td_t_notes AS T2 ON T1.fk_note = T2.id_note"
				+ "		INNER JOIN td_t_groups AS T3 ON T2.fk_group = T3.id_group"
				+ "		INNER JOIN (SELECT subT1.id_comment, subT2.id_note, subT3.id_group, (ROUND(subT3.max_commentedittime / 1000) - ROUND(TIMESTAMPDIFF(second, '1970-01-01 00:00:00', now()) - TIMESTAMPDIFF(second, '1970-01-01 00:00:00', subT1.savetime))) AS expirein"
				+ "					FROM td_t_notecomments AS subT1"
				+ "					INNER JOIN td_t_notes AS subT2 ON subT1.fk_note = subT2.id_note"
				+ "					INNER JOIN td_t_groups AS subT3 ON subT2.fk_group = subT3.id_group"
				+ "		) AS T4 ON T1.id_comment = T4.id_comment"
				+ "		SET T1.comment = ?, T1.writer_ip = ?, T1.writer_name = ?"
				+ "		WHERE T3.name LIKE ?"
				+ "		AND T2.id_note = ?"
				+ "		AND T1.id_comment = ?"
				+ "		AND T1.writer_ip LIKE ?"
				+ "		AND T4.expirein > 0;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);
			pS1.setString(1, comment);
			pS1.setString(2, writer_ip);
			pS1.setString(3, writer_name);
			pS1.setString(4, groupname);
			pS1.setInt(5, fk_note);
			pS1.setInt(6, id_comment);
			pS1.setString(7, writer_ip);
			
			int affectedRows = pS1.executeUpdate();
			pS1.close();
			if(affectedRows == 0){
				return false;
			}else{
				return true;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * This removes a comment if it exists. Returns true if successful.
	 * @param fk_note
	 * @param id_comment
	 * @param groupname
	 * @param writer_ip
	 * @return true/false success/fail
	 */
	public boolean removeComment(int fk_note, int id_comment, String groupname, String writer_ip) {
		String query1 = ""
				+ "		DELETE T1.*"
				+ "		FROM td_t_notecomments AS T1"
				+ "		INNER JOIN td_t_notes AS T2 ON T1.fk_note = T2.id_note"
				+ "		INNER JOIN td_t_groups AS T3 ON T2.fk_group = T3.id_group"
				+ "		INNER JOIN (SELECT subT1.id_comment, subT2.id_note, subT3.id_group, (ROUND(subT3.max_commentedittime / 1000) - ROUND(TIMESTAMPDIFF(second, '1970-01-01 00:00:00', now()) - TIMESTAMPDIFF(second, '1970-01-01 00:00:00', subT1.savetime))) AS expirein"
				+ "					FROM td_t_notecomments AS subT1"
				+ "					INNER JOIN td_t_notes AS subT2 ON subT1.fk_note = subT2.id_note"
				+ "					INNER JOIN td_t_groups AS subT3 ON subT2.fk_group = subT3.id_group"
				+ "		) AS T4 ON T1.id_comment = T4.id_comment"
				+ "		WHERE T3.name LIKE ?"
				+ "		AND T2.id_note = ?"
				+ "		AND T1.id_comment = ?"
				+ "		AND T1.writer_ip LIKE ?"
				+ "		AND T4.expirein > 0;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);
			pS1.setString(1, groupname);
			pS1.setInt(2, fk_note);
			pS1.setInt(3, id_comment);
			pS1.setString(4, writer_ip);
			
			int affectedRows = pS1.executeUpdate();
			pS1.close();
			if(affectedRows == 0){
				return false;
			}else{
				return true;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * Gets the max time to edit comments depending on the given group
	 * @param groupname
	 * @return long (ms)
	 */
	public long getMaxCommentEditTime(String groupname){
		long ret = 0;
		String query1 = ""
				+ "		SELECT T1.max_commentedittime"
				+ "		FROM td_t_groups AS T1"
				+ "		WHERE T1.name LIKE ?;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);
			pS1.setString(1, groupname);
			ResultSet myRes1 = pS1.executeQuery();
			if(myRes1.next()){
				ret = myRes1.getLong("max_commentedittime");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * Updates the lastview of a note. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @return true/false success/fail
	 */
	public boolean updateLastview(String groupname, int note_id){
		String query1 = ""
				+ "		UPDATE td_t_notes AS T1"
				+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
				+ "		SET T1.lastview = now()"
				+ "		WHERE T2.name LIKE ?"
				+ "		AND T1.id_note = ?;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);
			pS1.setString(1, groupname);
			pS1.setInt(2, note_id);
			int affectedRows = pS1.executeUpdate();
			pS1.close();
			if(affectedRows == 0){
				return false;
			}else{
				return true;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * Updates the position of a note. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param posX
	 * @param posY
	 * @return true/false success/fail
	 */
	public boolean updateNoteposition(String groupname, int note_id, int posX, int posY) {
		if(posX != 0 && posY != 0 && note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.pos_x = ?, T1.pos_y = ?"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setInt(1, posX);
				pS1.setInt(2, posY);
				pS1.setString(3, groupname);
				pS1.setInt(4, note_id);

				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * Updates the size of a note. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param size
	 * @return true/false success/fail
	 */
	public boolean updateNotesize(String groupname, int note_id, String size) {
		if(size != null && note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.size = ?"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, size);
				pS1.setString(2, groupname);
				pS1.setInt(3, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * Updates the title of a note. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param title
	 * @return true/false success/fail
	 */
	public boolean updateNotetitle(String groupname, int note_id, String title) {
		if(title != null && note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.title = ?"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, title);
				pS1.setString(2, groupname);
				pS1.setInt(3, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}

	/**
	 * Updates the content text of a note. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param content
	 * @return true/false success/fail
	 */
	public boolean updateNotetext(String groupname, int note_id, String content) {
		if(content != null && note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.content = ?"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, content);
				pS1.setString(2, groupname);
				pS1.setInt(3, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * Updates the showtime of a note. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param display_at
	 * @return true/false success/fail
	 */
	public boolean updateNoteshowtime(String groupname, int note_id, String display_at) {
		if(display_at != null && note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.showtime = ?"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, display_at);
				pS1.setString(2, groupname);
				pS1.setInt(3, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * Updates the archivetime of a note. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param archive_at
	 * @return true/false success/fail
	 */
	@SuppressWarnings("unused")
	public boolean updateNotearchivetime(String groupname, int note_id, String archive_at) {
		if(archive_at != null && note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.archivetime = ?"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				if(archive_at != null){
					pS1.setString(1, archive_at);
				}else{
					pS1.setNull(1, Types.NULL);
				}
				pS1.setString(2, groupname);
				pS1.setInt(3, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This locks a note for the first time. including a hint to the editor. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param user_ip
	 * @return true/false success/fail
	 */
	public boolean initLockNote(String groupname, int note_id, String user_ip) {
		if(user_ip != null && note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.locked_at = now(), T1.locked_by = ?"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, user_ip);
				pS1.setString(2, groupname);
				pS1.setInt(3, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This updates the lock on a note. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @return true/false success/fail
	 */
	public boolean updateLockNote(String groupname, int note_id) {
		if(note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.locked_at = now()"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, groupname);
				pS1.setInt(2, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This removes the lock from a note if the given ip matches the one in de locked_by field in the db. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param user_ip
	 * @return true/false success/fail
	 */
	public boolean stopLockNote(String groupname, int note_id, String user_ip) {
		if(user_ip != null && note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.locked_at = NULL, T1.locked_by = NULL"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?"
					+ "		AND T1.locked_by LIKE ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, groupname);
				pS1.setInt(2, note_id);
				pS1.setString(3, user_ip);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This updates the level of a note with the given id of the note and the level. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param level
	 * @return true/false success/fail
	 */
	public boolean updateNotelevel(String groupname, int note_id, int level) {
		if(level > 0 && note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.fk_level = ?"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setInt(1, level);
				pS1.setString(2, groupname);
				pS1.setInt(3, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This removes an attachment with the given id from a note with the given id - has to match. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param attachment_id
	 * @return true/false success/fail
	 */
	public boolean removeAttachment(String groupname, int note_id, int attachment_id) {
		if(attachment_id > 0 && note_id > 0){
			String query1 = ""
					+ "		DELETE FROM T1 USING td_t_attachments AS T1"
					+ "		INNER JOIN td_t_notes AS T2 ON T1.fk_note = T2.id_note"
					+ "		INNER JOIN td_t_groups AS T3 ON T2.fk_group = T3.id_group"
					+ "		WHERE T1.id_attachment = ?"
					+ "		AND T2.id_note = ?"
					+ "		AND T3.name LIKE ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setInt(1, attachment_id);
				pS1.setInt(2, note_id);
				pS1.setString(3, groupname);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This updates the colors of a note with the given id of the colorsheme and note. Returns true if successful
	 * @param groupname
	 * @param note_id
	 * @param color
	 * @return true/false success/fail
	 */
	public boolean updateNotecolors(String groupname, int note_id, int color) {
		if(color >= 0 && note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.fk_colors = ?"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				if(color == 0){
					pS1.setNull(1, java.sql.Types.NULL);
				}else{
					pS1.setInt(1, color);
				}
				pS1.setString(2, groupname);
				pS1.setInt(3, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This will read out all not visible notes of the given group. Not invisible means archived or not showed yet
	 * @param groupname
	 * @return A Notecontainer list
	 */
	public List<Notecontainer> getInvisibleGroupNotes(String groupname) {
		List<Notecontainer> myNotecontainers = new ArrayList<Notecontainer>();
		//Get all notes
		String query1 = ""
				+ "		SELECT * FROM td_t_notes AS T1"
				+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
				+ "		WHERE T2.name LIKE '" + groupname + "' "
				+ "		AND (T1.archived = 1 OR ("
				+ "		(T1.archivetime < now() AND T1.archivetime IS NOT NULL)"
				+ "		OR T1.showtime > now()"
				+ "		))"
				+ "		ORDER BY T1.id_note;";
		try {
			Statement myStm1 = myConn.createStatement();
			ResultSet myRes1 = myStm1.executeQuery(query1);
			while(myRes1.next()){
				//Get notecontent
				Notecontent myContent = new Notecontent(myRes1.getInt("id_note"),
														myRes1.getString("title"),
														myRes1.getString("content"),
														myRes1.getTimestamp("showtime"),
														myRes1.getTimestamp("archivetime"),
														myRes1.getTimestamp("savetime"),
														myRes1.getTimestamp("lastview"),
														myTools.intToBoolean(myRes1.getInt("archived")),
														myRes1.getInt("pos_x"),
														myRes1.getInt("pos_y"),
														myRes1.getInt("fk_level"),
														myRes1.getString("size"),
														myRes1.getInt("fk_group"),
														myRes1.getInt("fk_colors"),
														myRes1.getTimestamp("locked_at"),
														myRes1.getString("locked_by"));
				
				int tmp_id = myRes1.getInt("id_note"); //The id from the note to search attachments and comments
				
				//Get all attachments
				List<Attachment> myAttachments = new ArrayList<Attachment>(); 
				Statement myStm2 = myConn.createStatement();
				String query2 = ""
						+ "		SELECT * FROM td_t_attachments AS T1"
						+ "		WHERE T1.fk_note = "+tmp_id+";";
				ResultSet myRes2 = myStm2.executeQuery(query2);
				while(myRes2.next()){
					//Get attachment
					Attachment oneAttachment = new Attachment(	myRes2.getInt("id_attachment"),
																myRes2.getInt("fk_note"),
																myRes2.getString("link"),
																myRes2.getString("info"),
																myRes2.getString("log"));
					myAttachments.add(oneAttachment);
				}
				myStm2.close();
				
				
				//Get all comments
				List<Comment> myComments = new ArrayList<Comment>();
				Statement myStm3 = myConn.createStatement();
				String query3 = ""
						+ "		SELECT * FROM td_t_notecomments AS T1"
						+ "		WHERE T1.fk_note = "+tmp_id+";";
				ResultSet myRes3 = myStm3.executeQuery(query3);
				while(myRes3.next()){
					//Get comment					
					Comment oneComment = new Comment(	myRes3.getInt("id_comment"),
														myRes3.getInt("fk_note"),
														myRes3.getString("comment"),
														myRes3.getString("writer_ip"),
														myRes3.getTimestamp("savetime"),
														myRes3.getString("writer_name"));
					myComments.add(oneComment);
				}
				myStm3.close();
				
				
				//Get all editors
				List<Editor> myEditors = new ArrayList<Editor>();
				Statement myStm4 = myConn.createStatement();
				String query4 = ""
						+ "		SELECT * FROM td_t_editors AS T1"
						+ "		WHERE T1.fk_note = "+tmp_id+";";
				ResultSet myRes4 = myStm4.executeQuery(query4);
				while(myRes4.next()){
					//Get editor
					Editor oneEditor = new Editor(	myRes4.getInt("id_editor"), 
													myRes4.getInt("fk_note"),
													myRes4.getString("editor_ip"),
													myRes4.getTimestamp("edit_time"));
					myEditors.add(oneEditor);
				}
				myStm4.close();

				//Create the Notecontainer object
				Notecontainer myContainer = new Notecontainer(	tmp_id, 
																myContent,
																myAttachments,
																myEditors, 
																myComments);
				myNotecontainers.add(myContainer);
			}
			myStm1.close();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return myNotecontainers;
	}

	public long getNoteExistTime(int id_note, String groupname) {
		long ret = 0;
		if(id_note > 0){
			String query1 = ""
					+ "		SELECT T1.savetime, now() AS acttime"
					+ "		FROM td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, groupname);
				pS1.setInt(2, id_note);
				ResultSet myRes1 = pS1.executeQuery();
				if(myRes1.next()){
					Timestamp savetime = myRes1.getTimestamp("savetime");
					Timestamp now = myRes1.getTimestamp("acttime");
					ret = now.getTime() - savetime.getTime();
				}
				pS1.close();
				
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return ret;
	}
	
	/**
	 * This will return a list with all attachments from all notes inside the given group
	 * @param groupname
	 * @param uploaddir
	 * @return A String list
	 */
	public List<String> getHostedGroupAttachments(String groupname, String uploaddir){
		List<String> hostedAttachments = new ArrayList<String>();
		String query1 = ""
				+ "		SELECT T1.link FROM td_t_attachments AS T1"
				+ "		LEFT JOIN td_t_notes AS T2 ON T1.fk_note = T2.id_note"
				+ "		LEFT JOIN td_t_groups AS T3 ON T2.fk_group = T3.id_group"
				+ "		WHERE T3.name LIKE ?;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);

			pS1.setString(1, groupname);
			ResultSet myRes1 = pS1.executeQuery();
			while(myRes1.next()){
				String row = myRes1.getString("link");
				if(row.matches("^./upload/.*")){
					hostedAttachments.add(row.replaceFirst("^./upload/", ""));
				}
			}
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return hostedAttachments;
	}
	
	/**
	 * This removes a note from the database and also it's contained and local hosted attachments. Returns true if successful
	 * @param note_id
	 * @param groupname
	 * @param uploaddir The directory where you've saved the attachments
	 * @return true = success, false = fail
	 */
	public boolean removeNote(int note_id, String groupname, String uploaddir) {
		if(note_id > 0 && uploaddir != null){
			List<String> hostedAttachments = new ArrayList<String>();
			
			String query1 = ""
					+ "		SELECT T1.link FROM td_t_attachments AS T1"
					+ "		LEFT JOIN td_t_notes AS T2 ON T1.fk_note = T2.id_note"
					+ "		INNER JOIN td_t_groups AS T3 ON T2.fk_group = T3.id_group"
					+ "		WHERE T3.name LIKE ?"
					+ "		AND T2.id_note = ?;";
			
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);

				pS1.setString(1, groupname);
				pS1.setInt(2, note_id);
				ResultSet myRes1 = pS1.executeQuery();
				while(myRes1.next()){
					String row = myRes1.getString("link");
					if(row.matches("^./upload/.*")){
						hostedAttachments.add(row.replaceFirst("^./upload/", ""));
					}
				}
				pS1.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			
			String query2 = ""
					+ "		DELETE T1.*"
					+ "		FROM td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS2 = myConn.prepareStatement(query2);

				pS2.setString(1, groupname);
				pS2.setInt(2, note_id);
				int affectedRows = pS2.executeUpdate();
				pS2.close();
				if(affectedRows == 0){
					return false;
				}else{
					for(String filename : hostedAttachments){
						File todelete = new File(uploaddir + filename);
						if(todelete.exists()){
							todelete.delete();
						}
					}
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This changes the archived and archivetime entry of a note with the given id. Returns true if successful
	 * @param note_id
	 * @param groupname
	 * @return true = success, false = fail
	 */
	public boolean archiveNote(int note_id, String groupname) {
		if(note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.archived = 1, T1.archivetime = now()"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, groupname);
				pS1.setInt(2, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This changes the archived and archivetime value of the given note to null and the showtime to now. The note should reappear then. Returns true if successful
	 * @param note_id
	 * @param groupname
	 * @return true = success, false = fail
	 */
	public boolean restoreNote(int note_id, String groupname) {
		if(note_id > 0){
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		SET T1.archived = 0, T1.archivetime = NULL, T1.showtime = now()"
					+ "		WHERE T2.name LIKE ?"
					+ "		AND T1.id_note = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, groupname);
				pS1.setInt(2, note_id);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This creates a new basic group. You have to add levels or colorshemes later.
	 * @param group_name
	 * @param group_pw
	 * @param group_adminpw
	 * @param group_desc
	 * @param group_fieldres
	 * @param note_maxSize
	 * @param note_minSize
	 * @param note_defaultSize
	 * @param comment_maxeditT
	 * @return The id of the new created group
	 */
	public int createBasicGroup(String group_name, String group_pw, String group_adminpw, String group_desc, String group_fieldres, String note_maxSize, String note_minSize, String note_defaultSize, long comment_maxeditT) {
		int mynewid = 0;
		String query1 = ""
				+ "		INSERT INTO td_t_groups(name, password, description, admin_password, field_resolution, max_size, min_size, default_size, max_commentedittime)"
				+ "		VALUES(?,?,?,?,?,?,?,?,?);";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1, Statement.RETURN_GENERATED_KEYS);
			pS1.setString(1, group_name);
			pS1.setString(2, group_pw);
			pS1.setString(3, group_desc);
			pS1.setString(4, group_adminpw);
			pS1.setString(5, group_fieldres);
			pS1.setString(6, note_maxSize);
			pS1.setString(7, note_minSize);
			pS1.setString(8, note_defaultSize);
			pS1.setLong(9, comment_maxeditT);
			pS1.executeUpdate();
			ResultSet newRow = pS1.getGeneratedKeys();
			if(newRow.next()){
				mynewid = newRow.getInt(1);
			}
			pS1.close();

		} catch (SQLException e) {
			e.printStackTrace();
		}
		return mynewid;
	}
	
	/**
	 * This adds a new level to the given group
	 * @param groupid
	 * @param level_weight
	 * @param level_font
	 * @param level_bg
	 * @param level_blink
	 * @param level_desc
	 * @return true = success, false = fail
	 */
	public boolean addLevel(int groupid, int level_weight, String level_font, String level_bg, int level_blink, String level_desc) {
		if(groupid > 0){
			String query1 = ""
					+ "		INSERT INTO td_t_levels (weight, description, font_color, background_color, fk_profile, isblinking)"
					+ "		VALUES(?,?,?,?,?,?);";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setInt(1, level_weight);
				pS1.setString(2, level_desc);
				pS1.setString(3, level_font);
				pS1.setString(4, level_bg);
				pS1.setInt(5, groupid);
				pS1.setInt(6, level_blink);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}

	/**
	 * This adds a new colorsheme to the given group.
	 * @param groupid
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
	 * @return true = success, false = fail
	 */
	public boolean addColorsheme(	int groupid, String cs_name, String cs_font, String cs_bg, String cs_title, String cs_titlebg, String cs_link, String cs_border, String cs_tblheaderbg, String cs_tblfont01bg,
									String cs_tblfont02bg, String cs_tblheader, String cs_tblfont01, String cs_tblfont02) {
		
		if(groupid > 0){
			String query1 = ""
					+ "		INSERT INTO td_t_selectablecolors (fk_profile, description, content_font, content_background, title_font, title_background, link_font, borders, table_header_background, table_cell_01_background, table_cell_02_background, table_header_font, table_cell_01_font, table_cell_02_font)"
					+ "		VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);	
				pS1.setInt(1, groupid);
				pS1.setString(2, cs_name);
				pS1.setString(3, cs_font);
				pS1.setString(4, cs_bg);
				pS1.setString(5, cs_title);
				pS1.setString(6, cs_titlebg);
				pS1.setString(7, cs_link);
				pS1.setString(8, cs_border);
				pS1.setString(9, cs_tblheaderbg);
				pS1.setString(10, cs_tblfont01bg);
				pS1.setString(11, cs_tblfont02bg);
				pS1.setString(12, cs_tblheader);
				pS1.setString(13, cs_tblfont01);
				pS1.setString(14, cs_tblfont02);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This returns true if the given password matches with the one of the given group
	 * @param groupname
	 * @param groupadmin_pw
	 * @return true = authorized, false = unauthorized
	 */
	public boolean checkAdmin(String groupname, String groupadmin_pw){
		String query1 = "	SELECT name, admin_password"
				+ "			FROM td_t_groups "
				+ "			WHERE name LIKE ? "
				+ "			AND admin_password LIKE ?;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);	
			pS1.setString(1, groupname);
			pS1.setString(2, groupadmin_pw);
			ResultSet myRes1 = pS1.executeQuery();
			if(myRes1.next()){
				String found_groupname = myRes1.getString("name");
				String found_groupadmin_pw = myRes1.getString("admin_password");
				pS1.close();
				if(found_groupname.equals(groupname) && found_groupadmin_pw.equals(groupadmin_pw)){ //the sql query is not case sensitive - this is.
					return true;
				}else{
					return false;
				}
			}else{
				pS1.close();
				return false;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * This gets all group settings as a json object. They key values are the database column names.
	 * Main Purpose: groupadmin gui.
	 * @param groupname
	 * @return JSONObject
	 * @throws JSONException 
	 */
	public JSONObject getGroupSettings(String groupname) throws JSONException {
		JSONObject ret = new JSONObject();
		
		String query1 = "	SELECT *"
				+ "			FROM td_t_groups"
				+ "			WHERE name LIKE ?;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);	
			pS1.setString(1, groupname);
			ResultSet myRes1 = pS1.executeQuery();
			if(myRes1.next()){
				int colcount = myRes1.getMetaData().getColumnCount();
				for(int i = 1; i <= colcount; i++){
					String colname = myRes1.getMetaData().getColumnName(i);
					String colrowvalue = myRes1.getString(i);
					ret.put(colname, colrowvalue);
				}
				
			}
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This gets all group levels as a json object. They key values are the database column names.
	 * Main Purpose: groupadmin gui.
	 * @param groupname
	 * @return JSONObject
	 * @throws JSONException 
	 */
	public JSONObject getGroupLevels(String groupname) throws JSONException {
		JSONObject ret = new JSONObject();
		JSONArray rows = new JSONArray();
		String query1 = "	SELECT T1.*"
				+ "			FROM td_t_levels AS T1"
				+ "			LEFT JOIN td_t_groups AS T2 ON T1.fk_profile = T2.id_group" 
				+ "			WHERE T2.name LIKE ?;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);	
			pS1.setString(1, groupname);
			ResultSet myRes1 = pS1.executeQuery();
			while(myRes1.next()){
				JSONObject colrowpair = new JSONObject();
				int colcount = myRes1.getMetaData().getColumnCount();
				for(int i = 1; i <= colcount; i++){
					String colname = myRes1.getMetaData().getColumnName(i);
					String colrowvalue = myRes1.getString(i);
					colrowpair.put(colname, colrowvalue);
				}
				rows.put(colrowpair);
			}
			ret.put("ROWS", rows);
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This gets all group colorshemes as a json object. They key values are the database column names.
	 * Main Purpose: groupadmin gui.
	 * @param groupname
	 * @return JSONObject
	 * @throws JSONException
	 */
	public JSONObject getGroupColorshemes(String groupname) throws JSONException {
		JSONObject ret = new JSONObject();
		JSONArray rows = new JSONArray();
		String query1 = "	SELECT T1.*"
				+ "			FROM td_t_selectablecolors AS T1"
				+ "			LEFT JOIN td_t_groups AS T2 ON T1.fk_profile = T2.id_group" 
				+ "			WHERE T2.name LIKE ?;";
		try {
			PreparedStatement pS1 = myConn.prepareStatement(query1);	
			pS1.setString(1, groupname);
			ResultSet myRes1 = pS1.executeQuery();
			while(myRes1.next()){
				JSONObject colrowpair = new JSONObject();
				int colcount = myRes1.getMetaData().getColumnCount();
				for(int i = 1; i <= colcount; i++){
					String colname = myRes1.getMetaData().getColumnName(i);
					String colrowvalue = myRes1.getString(i);
					colrowpair.put(colname, colrowvalue);
				}
				rows.put(colrowpair);
			}
			ret.put("ROWS", rows);
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This removes the given level from the given group
	 * @param groupname
	 * @param levelid
	 * @param groupid
	 * @return true if successful, false if fail.
	 */
	public boolean removeLevel(String groupname, int levelid, int groupid) {
		if(levelid > 0 && groupid > 0){
			String query1 = ""
					+ "		DELETE FROM T1 USING td_t_levels AS T1"
					+ "		LEFT JOIN td_t_groups AS T2 ON T1.fk_profile = T2.id_group"
					+ "		WHERE T1.id_level = ?"
					+ "		AND T2.id_group = ?"
					+ "		AND T2.name LIKE ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setInt(1, levelid);
				pS1.setInt(2, groupid);
				pS1.setString(3, groupname);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This removes the given colorsheme from the given group
	 * @param groupname
	 * @param csid
	 * @param groupid
	 * @return true if successful, false if fail.
	 */
	public boolean removeColorsheme(String groupname, int csid, int groupid) {
		if(csid > 0 && groupid > 0){
			String query1 = ""
					+ "		DELETE FROM T1 USING td_t_selectablecolors AS T1"
					+ "		LEFT JOIN td_t_groups AS T2 ON T1.fk_profile = T2.id_group"
					+ "		WHERE T1.id_color = ?"
					+ "		AND T2.id_group = ?"
					+ "		AND T2.name LIKE ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setInt(1, csid);
				pS1.setInt(2, groupid);
				pS1.setString(3, groupname);
				int affectedRows = pS1.executeUpdate();
				pS1.close();
				if(affectedRows == 0){
					return false;
				}else{
					return true;
				}
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This updates the basic values of a group
	 * @param groupid
	 * @param old_group_name
	 * @param new_group_name
	 * @param group_pw
	 * @param group_adminpw
	 * @param group_desc
	 * @param group_fieldres
	 * @param note_maxSize
	 * @param note_minSize
	 * @param note_defaultSize
	 * @param comment_maxeditT
	 * @return true if successful, false if fail.
	 */
	public boolean updateBasicGroup(int groupid, String old_group_name, String new_group_name, String group_pw, String group_adminpw, String group_desc, String group_fieldres,
								String note_maxSize, String note_minSize, String note_defaultSize, long comment_maxeditT) {
		if(groupid > 0){
			int affectedrows = 0;
			String query1 = ""
					+ "		UPDATE td_t_groups AS T1"
					+ "		SET T1.name = ?, T1.password = ?, T1.description = ?, T1.admin_password = ?, T1.field_resolution = ?, T1.max_size = ?, T1.min_size = ?, T1.default_size = ?, T1.max_commentedittime = ?"
					+ "		WHERE T1.id_group = ?"
					+ "		AND T1.name LIKE ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, new_group_name);
				pS1.setString(2, group_pw);
				pS1.setString(3, group_desc);
				pS1.setString(4, group_adminpw);
				pS1.setString(5, group_fieldres);
				pS1.setString(6, note_maxSize);
				pS1.setString(7, note_minSize);
				pS1.setString(8, note_defaultSize);
				pS1.setLong(9, comment_maxeditT);
				pS1.setInt(10, groupid);
				pS1.setString(11, old_group_name);
				affectedrows = pS1.executeUpdate();
				pS1.close();

			} catch (SQLException e) {
				e.printStackTrace();
			}
			if(affectedrows > 0){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
		
	}
	
	/**
	 * This will read out all Notes from the database which are in the given group doensn't matter if visible or not.
	 * @param groupname
	 * @return a Notecontainer List
	 */
	public List<Notecontainer> getAllGroupNotes(String groupname){
		List<Notecontainer> myNotecontainers = new ArrayList<Notecontainer>();

		//Get all notes
		String query1 = ""
				+ "		SELECT * FROM td_t_notes AS T1"
				+ "		INNER JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
				+ "		WHERE T2.name LIKE '" + groupname + "'"
				+ "		ORDER BY T1.id_note;";
		try {
			Statement myStm1 = myConn.createStatement();
			ResultSet myRes1 = myStm1.executeQuery(query1);
			while(myRes1.next()){
				//Get notecontent
				Notecontent myContent = new Notecontent(myRes1.getInt("id_note"),
														myRes1.getString("title"),
														myRes1.getString("content"),
														myRes1.getTimestamp("showtime"),
														myRes1.getTimestamp("archivetime"),
														myRes1.getTimestamp("savetime"),
														myRes1.getTimestamp("lastview"),
														myTools.intToBoolean(myRes1.getInt("archived")),
														myRes1.getInt("pos_x"),
														myRes1.getInt("pos_y"),
														myRes1.getInt("fk_level"),
														myRes1.getString("size"),
														myRes1.getInt("fk_group"),
														myRes1.getInt("fk_colors"),
														myRes1.getTimestamp("locked_at"),
														myRes1.getString("locked_by"));
				
				int tmp_id = myRes1.getInt("id_note"); //The id from the note to search attachments and comments
				
				//Get all attachments
				List<Attachment> myAttachments = new ArrayList<Attachment>(); 
				Statement myStm2 = myConn.createStatement();
				String query2 = ""
						+ "		SELECT * FROM td_t_attachments AS T1"
						+ "		WHERE T1.fk_note = "+tmp_id+";";
				ResultSet myRes2 = myStm2.executeQuery(query2);
				while(myRes2.next()){
					//Get attachment
					Attachment oneAttachment = new Attachment(	myRes2.getInt("id_attachment"),
																myRes2.getInt("fk_note"),
																myRes2.getString("link"),
																myRes2.getString("info"),
																myRes2.getString("log"));
					myAttachments.add(oneAttachment);
				}
				myStm2.close();
				
				
				//Get all comments
				List<Comment> myComments = new ArrayList<Comment>();
				Statement myStm3 = myConn.createStatement();
				String query3 = ""
						+ "		SELECT * FROM td_t_notecomments AS T1"
						+ "		WHERE T1.fk_note = "+tmp_id+";";
				ResultSet myRes3 = myStm3.executeQuery(query3);
				while(myRes3.next()){
					//Get comment					
					Comment oneComment = new Comment(	myRes3.getInt("id_comment"),
														myRes3.getInt("fk_note"),
														myRes3.getString("comment"),
														myRes3.getString("writer_ip"),
														myRes3.getTimestamp("savetime"),
														myRes3.getString("writer_name"));
					myComments.add(oneComment);
				}
				myStm3.close();
				
				
				//Get all editors
				List<Editor> myEditors = new ArrayList<Editor>();
				Statement myStm4 = myConn.createStatement();
				String query4 = ""
						+ "		SELECT * FROM td_t_editors AS T1"
						+ "		WHERE T1.fk_note = "+tmp_id+";";
				ResultSet myRes4 = myStm4.executeQuery(query4);
				while(myRes4.next()){
					//Get editor
					Editor oneEditor = new Editor(	myRes4.getInt("id_editor"), 
													myRes4.getInt("fk_note"),
													myRes4.getString("editor_ip"),
													myRes4.getTimestamp("edit_time"));
					myEditors.add(oneEditor);
				}
				myStm4.close();

				//Create the Notecontainer object
				Notecontainer myContainer = new Notecontainer(	tmp_id, 
																myContent,
																myAttachments,
																myEditors, 
																myComments);
				myNotecontainers.add(myContainer);
			}
			myStm1.close();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return myNotecontainers;
	}
	
	/**
	 * This updates an existing colorsheme.
	 * @param csid
	 * @param groupid
	 * @param groupname
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
	 * @return true if successfull, false if fail
	 */
	public boolean updateColorsheme(int csid, int groupid, String groupname, String cs_name,
			String cs_font, String cs_bg, String cs_title, String cs_titlebg,
			String cs_link, String cs_border, String cs_tblheaderbg,
			String cs_tblfont01bg, String cs_tblfont02bg, String cs_tblheader,
			String cs_tblfont01, String cs_tblfont02) {
		if(csid > 0 && groupid > 0){
			int affectedrows = 0;
			String query1 = ""
					+ "		UPDATE td_t_selectablecolors AS T1"
					+ "		LEFT JOIN td_t_groups AS T2 ON T1.fk_profile = T2.id_group"
					+ "		SET T1.description = ?, T1.content_font = ?, T1.content_background = ?, T1.title_font = ?, T1.title_background = ?, T1.link_font = ?, "
					+ "			T1.borders = ?, T1.table_header_background = ?, T1.table_cell_01_background = ?, T1.table_cell_02_background = ?, "
					+ "			T1.table_header_font = ?, T1.table_cell_01_font = ?, T1.table_cell_02_font = ?"
					+ "		WHERE T1.id_color = ?"
					+ "		AND T2.id_group = ?"
					+ "		AND T2.name LIKE ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setString(1, cs_name);
				pS1.setString(2, cs_font);
				pS1.setString(3, cs_bg);
				pS1.setString(4, cs_title);
				pS1.setString(5, cs_titlebg);
				pS1.setString(6, cs_link);
				pS1.setString(7, cs_border);
				pS1.setString(8, cs_tblheaderbg);
				pS1.setString(9, cs_tblfont01bg);
				pS1.setString(10, cs_tblfont02bg);
				pS1.setString(11, cs_tblheader);
				pS1.setString(12, cs_tblfont01);
				pS1.setString(13, cs_tblfont02);
				pS1.setInt(14, csid);
				pS1.setInt(15, groupid);
				pS1.setString(16, groupname);

				affectedrows = pS1.executeUpdate();
				pS1.close();

			} catch (SQLException e) {
				e.printStackTrace();
			}
			if(affectedrows > 0){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This updates an existing level
	 * @param groupid
	 * @param levelid
	 * @param group_name
	 * @param level_weight
	 * @param level_font
	 * @param level_bg
	 * @param level_blink
	 * @param level_desc
	 * @return true if success, false if fail
	 */
	public boolean updateLevel(int groupid, int levelid, String group_name,
			int level_weight, String level_font, String level_bg,
			int level_blink, String level_desc) {
		if(groupid > 0 && levelid > 0){
			int affectedrows = 0;
			String query1 = ""
					+ "		UPDATE td_t_levels AS T1"
					+ "		LEFT JOIN td_t_groups AS T2 ON T1.fk_profile = T2.id_group"
					+ "		SET T1.weight = ?, T1.description = ?, T1.font_color = ?, T1.background_color = ?, T1.isblinking = ?"
					+ "		WHERE T1.id_level = ?"
					+ "		AND T2.id_group = ?"
					+ "		AND T2.name LIKE ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setInt(1, level_weight);
				pS1.setString(2, level_desc);
				pS1.setString(3, level_font);
				pS1.setString(4, level_bg);
				pS1.setInt(5, level_blink);
				pS1.setInt(6, levelid);
				pS1.setInt(7, groupid);
				pS1.setString(8, group_name);

				affectedrows = pS1.executeUpdate();
				pS1.close();

			} catch (SQLException e) {
				e.printStackTrace();
			}
			if(affectedrows > 0){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This returns a int array list<br>
	 * [0] = id of level<br>
	 * [1] = weight of level<br> 
	 * @param groupid
	 * @param groupname
	 * @return int array list
	 */
	public List<int[]> getLevelWeights(int groupid, String groupname) {
		List<int[]> ret = new ArrayList<int[]>();
		String query1 = ""
				+ "		SELECT T1.id_level, T1.weight "
				+ "		FROM td_t_levels AS T1"
				+ "		LEFT JOIN td_t_groups AS T2 ON T1.fk_profile = T2.id_group"
				+ "		WHERE T2.id_group = ?"
				+ "		AND T2.name LIKE ?;";
		
		PreparedStatement pS1;
		try {
			pS1 = myConn.prepareStatement(query1);
			pS1.setInt(1, groupid);
			pS1.setString(2, groupname);
			ResultSet myRes1 = pS1.executeQuery();
			while(myRes1.next()){
				int[] row = new int[2];
				row[0] = myRes1.getInt("id_level");
				row[1] = myRes1.getInt("weight");
				ret.add(row);
			}
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This changes the level/priority of a note
	 * @param groupname
	 * @param old_lvlid
	 * @param new_lvlid
	 * @param noteid
	 * @return true if successful, false if fail
	 */
	public boolean changeLevels(String groupname, int old_lvlid, int new_lvlid, int groupid){
		if(old_lvlid > 0 && new_lvlid > 0 && groupid > 0){
			int affectedrows = 0;
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		LEFT JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		LEFT JOIN td_t_levels AS T3 ON T3.id_level = T1.fk_level"
					+ "		SET T1.fk_level = ?"
					+ "		WHERE T3.id_level = ?"
					+ "		AND T2.name LIKE ?"
					+ "		AND T2.id_group = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				pS1.setInt(1, new_lvlid);
				pS1.setInt(2, old_lvlid);
				pS1.setString(3, groupname);
				pS1.setInt(4, groupid);
				affectedrows = pS1.executeUpdate();
				pS1.close();

			} catch (SQLException e) {
				e.printStackTrace();
			}
			if(affectedrows > 0){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * This resets the colorsheme reference of all notes which are using the given colorsheme id.
	 * @param groupname
	 * @param csid
	 * @param groupid
	 * @return true if successful, false if fail
	 */
	public boolean resetColorsheme(String groupname, int csid, int groupid) {
		if(csid > 0 && groupid > 0){
			int affectedrows = 0;
			String query1 = ""
					+ "		UPDATE td_t_notes AS T1"
					+ "		LEFT JOIN td_t_groups AS T2 ON T1.fk_group = T2.id_group"
					+ "		LEFT JOIN td_t_selectablecolors AS T3 ON T3.id_color = T1.fk_colors"
					+ "		SET T1.fk_colors = NULL"
					+ "		WHERE T3.id_color = ?"
					+ "		AND T2.name LIKE ?"
					+ "		AND T2.id_group = ?;";
			try {
				PreparedStatement pS1 = myConn.prepareStatement(query1);
				
				pS1.setInt(1, csid);
				pS1.setString(2, groupname);
				pS1.setInt(3, groupid);
				affectedrows = pS1.executeUpdate();
				pS1.close();

			} catch (SQLException e) {
				e.printStackTrace();
			}
			if(affectedrows > 0){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * Returns the id of a group
	 * @param groupname
	 * @return int
	 */
	public int getGroupID(String groupname){
		int ret = 0;
		String query1 = ""
				+ "		SELECT T1.id_group"
				+ "		FROM td_t_groups AS T1"
				+ "		WHERE T1.name LIKE ?;";
		
		PreparedStatement pS1;
		try {
			pS1 = myConn.prepareStatement(query1);
			pS1.setString(1, groupname);
			ResultSet myRes1 = pS1.executeQuery();
			if(myRes1.next()){
				ret = myRes1.getInt("id_group");
			}
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * Returns the name of a group
	 * @param id
	 * @return String
	 */
	public String getGroupnameByID(int id){
		String ret = "";
		String query1 = ""
				+ "		SELECT T1.name"
				+ "		FROM td_t_groups AS T1"
				+ "		WHERE T1.id_group = ?;";
		
		PreparedStatement pS1;
		try {
			pS1 = myConn.prepareStatement(query1);
			pS1.setInt(1, id);
			ResultSet myRes1 = pS1.executeQuery();
			if(myRes1.next()){
				ret = myRes1.getString("name");
			}
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * Returns the field resolution size of the given group
	 * @param groupname
	 * @return String  
	 */
	public String getGroupfieldSize(String groupname) {
		String ret = new String();
		String query1 = ""
				+ "		SELECT T1.field_resolution"
				+ "		FROM td_t_groups AS T1"
				+ "		WHERE T1.name LIKE ?;";
		
		PreparedStatement pS1;
		try {
			pS1 = myConn.prepareStatement(query1);
			pS1.setString(1, groupname);
			ResultSet myRes1 = pS1.executeQuery();
			if(myRes1.next()){
				ret = myRes1.getString("field_resolution");
			}
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * This removes a whole group from the db
	 * @param groupname
	 * @param groupid
	 */
	public void removeGroup(String groupname, int groupid) {
		String query1 = ""
				+ "		DELETE FROM td_t_groups"
				+ "		WHERE name LIKE ?"
				+ "		AND id_group = ?;";
		PreparedStatement pS1;
		try {
			pS1 = myConn.prepareStatement(query1);
			pS1.setString(1, groupname);
			pS1.setInt(2, groupid);
			pS1.executeUpdate();
			pS1.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
