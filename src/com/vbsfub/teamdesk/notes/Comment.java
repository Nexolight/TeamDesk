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
package com.vbsfub.teamdesk.notes;

import java.sql.Timestamp;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import com.vbsfub.teamdesk.db.Tools;

/**
 * This class represents the details and content of a comment
 *
 */
public class Comment{
	private int id_comment;
	private int fk_note;
	private String comment;
	private String writer_ip;
	private Timestamp savetime;
	private String writer_name;
	private Tools myTools = new Tools();
	
	/**
	 * The constructor for one comment
	 * @param id_comment
	 * @param fk_note
	 * @param comment
	 * @param writer_ip
	 * @param savetime
	 * @param writer_name
	 */
	public Comment(int id_comment, int fk_note, String comment, String writer_ip, Timestamp savetime, String writer_name) {
		this.setId_comment(id_comment);
		this.setFk_note(fk_note);
		this.setSavetime(savetime);
		this.setComment(comment);
		this.setWriter_ip(writer_ip);
		this.setWriter_name(writer_name);
	}
	
	/**
	 * This returns a int count with changes compared from this to another Comment object 
	 * @param toCompare Comment
	 * @return int
	 */
	public int countChanges(Comment toCompare){
		int changes = 0;
		
		if(!(toCompare.getId_comment() == this.getId_comment())){
			changes++;
		}
		
		if(!(toCompare.getFk_note() == this.getFk_note())){
			changes++;
		}
		
		if(!toCompare.getComment().equals(this.getComment())){
			changes++;
		}
		
		if(!toCompare.getWriter_ip().equals(this.getWriter_ip())){
			changes++;
		}
		
		if(!toCompare.getSavetime().equals(this.getSavetime())){
			changes++;
		}
		
		if(!toCompare.getWriter_name().equals(this.getWriter_name())){
			changes++;
		}
		
		return changes;
	}
	
	/**
	 * This checks if the object has changed
	 * @param toCompare Comment to compare
	 * @return boolean True if changed false if not
	 */
	public boolean hasChanged(Comment toCompare){
		if(this.countChanges(toCompare) != 0){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * This checks if this Comment exists in a List contains of Comment objects
	 * @param meAsArray List with Comment
	 * @return True if yes, false if not
	 */
	public boolean isIn(List<Comment> meAsArray){
		boolean ret = false;
		for(Comment row : meAsArray){
			if(row.getId_comment() == this.getId_comment()){
				ret = true;
			}
		}
		return ret;
	}
	
	/**
	 * This checks if the container exists in a List contains of Comment objects. If it does the number of the index is returned. if it doesn't -1 is returned
	 * @param meAsArray List with Comment
	 * @return -1 for not found >= 0 index of the entry
	 */
	public int isInNr(List<Comment> meAsArray){
		int ret = -1;
		for(int i = 0; i < meAsArray.size(); i++){
			Comment row = meAsArray.get(i);
			if(row.getId_comment() == this.getId_comment()){
				ret = i;
			}
		}
		return ret;
	}
	
	/**
	 * This gets the changes of another given Comment object
	 * @param toCompare Comment object to compare
	 * @param applyChanges boolean Set this to true if you want to apply the found changes
	 * @return JSONObject which contains the changed values from the given Comment object. the Object can contain:<br>
	 * id<br>
	 * fk_note<br>
	 * comment<br>
	 * writer_ip<br>
	 * savetime<br>
	 * writer_name
	 */
	public JSONObject getChanges(Comment toCompare, boolean applyChanges){
		JSONObject myChanges = new JSONObject();
		try {
			if(!(toCompare.getId_comment() == this.getId_comment())){
				myChanges.put("id", toCompare.getId_comment());
				if(applyChanges){
					this.setId_comment(toCompare.getId_comment());
				}
			}
			
			if(!(toCompare.getFk_note() == this.getFk_note())){
				myChanges.put("fk_note", toCompare.getFk_note());
				if(applyChanges){
					this.setFk_note(toCompare.getFk_note());
				}
			}
			
			if(!toCompare.getComment().equals(this.getComment())){
				myChanges.put("comment", toCompare.getComment());
				if(applyChanges){
					this.setComment(toCompare.getComment());
				}
			}
			
			if(!toCompare.getWriter_ip().equals(this.getWriter_ip())){
				myChanges.put("writer_ip", toCompare.getWriter_ip());
				if(applyChanges){
					this.setWriter_ip(toCompare.getWriter_ip());
				}
			}
			
			if(!toCompare.getSavetime().equals(this.getSavetime())){
				myChanges.put("savetime", myTools.formatTsToStr(toCompare.getSavetime()));
				if(applyChanges){
					this.setSavetime(toCompare.getSavetime());
				}
			}
			
			if(!toCompare.getWriter_name().equals(this.getWriter_name())){
				myChanges.put("writer_name", toCompare.getWriter_name());
				if(applyChanges){
					this.setWriter_name(toCompare.getWriter_name());
				}
			}
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return myChanges;
	}
	
	/**
	 * Gets the id of the comment
	 * @return int
	 */
	public int getId_comment() {
		return id_comment;
	}
	
	/**
	 * Sets the id of the comment
	 * @param id_comment int
	 */
	private void setId_comment(int id_comment) {
		this.id_comment = id_comment;
	}
	
	/**
	 * Gets the fk to the note
	 * @return int
	 */
	public int getFk_note() {
		return fk_note;
	}
	
	/**
	 * Sets the fk to the note	
	 * @param fk_note int
	 */
	public void setFk_note(int fk_note) {
		this.fk_note = fk_note;
	}

	/**
	 * Gets the comment text
	 * @return String
	 */
	public String getComment() {
		return comment;
	}
	
	/**
	 * Sets the comment text 
	 * @param comment String
	 */
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	/**
	 * Gets the writer ip of the comment
	 * @return String
	 */
	public String getWriter_ip() {
		return writer_ip;
	}
	
	/**
	 * Sets  the writer ip of the comment
	 * @param writer_ip Stirng
	 */
	public void setWriter_ip(String writer_ip) {
		this.writer_ip = writer_ip;
	}
	
	/**
	 * Gets the savetime of the comment
	 * @return Timestamp
	 */
	public Timestamp getSavetime() {
		return savetime;
	}
	
	/**
	 * Sets the savetime of the comment
	 * @param savetime Timestamp
	 */
	public void setSavetime(Timestamp savetime) {
		this.savetime = savetime;
	}

	/**
	 * Gets the writer name of the comment
	 * @return String
	 */
	public String getWriter_name() {
		return writer_name;
	}
	
	/**
	 * Sets the writer name of the comment
	 * @param writer_name String
	 */
	public void setWriter_name(String writer_name) {
		this.writer_name = writer_name;
	}

}
