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

/**
 * This class represents the details and content of an editor
 *
 */
public class Editor{
	
	private int id_editor;
	private int fk_note;
	private String editor_ip;
	private Timestamp edit_time;
	
	/**
	 * The constructor for an editor
	 * @param id_editor
	 * @param fk_note
	 * @param editor_ip
	 * @param edit_time
	 */
	public Editor(int id_editor, int fk_note, String editor_ip, Timestamp edit_time) {
		this.setId_editor(id_editor);
		this.setFk_note(fk_note);
		this.setEditor_ip(editor_ip);
		this.setEdit_time(edit_time);
	}
	
	/**
	 * This returns a int count with changes compared from this to another Editor object 
	 * @param toCompare Editor
	 * @return int
	 */
	public int countChanges(Editor toCompare){
		int changes = 0;
		
		if(!(toCompare.getId_editor() == this.id_editor)){
			changes++;
		}
		
		if(!(toCompare.getFk_note() == this.fk_note)){
			changes++;
		}
		
		if(!toCompare.getEditor_ip().equals(this.getEditor_ip())){
			changes++;
		}
		
		if(!toCompare.getEdit_time().equals(this.getEdit_time())){
			changes++;
		}
		return changes;
	}
	
	/**
	 * This checks if the object has changed
	 * @param toCompare Editor to compare
	 * @return boolean True if changed false if not
	 */
	public boolean hasChanged(Editor toCompare){
		if(this.countChanges(toCompare) != 0){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * This gets the changes of another given Editor object
	 * @param toCompare Editor object to compare
	 * @param applyChanges boolean Set this to true if you want to apply the found changes
	 * @return JSONObject which contains the changed values from the given Editor object. the Object can contain:<br>
	 * id<br>
	 * fk_note<br>
	 * editor_ip<br>
	 * edit_time<br>
	 */
	public JSONObject getChanges(Editor toCompare, boolean applyChanges){
		JSONObject myChanges = new JSONObject();
		try {
			if(!(toCompare.getId_editor() == this.id_editor)){
				myChanges.put("id", toCompare.getId_editor());
				if(applyChanges){
					this.setId_editor(toCompare.getId_editor());
				}
			}
			
			if(!(toCompare.getFk_note() == this.fk_note)){
				myChanges.put("fk_note", toCompare.getFk_note());
				if(applyChanges){
					this.setFk_note(toCompare.getFk_note());
				}
			}
			
			if(!toCompare.getEditor_ip().equals(this.getEditor_ip())){
				myChanges.put("editor_ip", toCompare.getEditor_ip());
				if(applyChanges){
					this.setEditor_ip(toCompare.getEditor_ip());
				}
			}
			
			if(!toCompare.getEdit_time().equals(this.getEdit_time())){
				myChanges.put("edit_time", toCompare.getEdit_time());
				if(applyChanges){
					this.setEdit_time(toCompare.getEdit_time());
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return myChanges;
	}
	
	/**
	 * This checks if this Editor exists in a List contains of Editor objects
	 * @param meAsArray List with Editor
	 * @return True if yes, false if not
	 */
	public boolean isIn(List<Editor> meAsArray){
		boolean ret = false;
		for(Editor row : meAsArray){
			if(row.getId_editor()== this.getId_editor()){
				ret = true;
			}
		}
		return ret;
	}
	
	/**
	 * This checks if the container exists in a List contains of Editor objects. If it does the number of the index is returned. if it doesn't -1 is returned
	 * @param meAsArray List with Editor
	 * @return -1 for not found >= 0 index of the entry
	 */
	public int isInNr(List<Editor> meAsArray){
		int ret = -1;
		for(int i = 0; i < meAsArray.size(); i++){
			Editor row = meAsArray.get(i);
			if(row.getId_editor() == this.getId_editor()){
				ret = i;
			}
		}
		return ret;
	}
	
	/**
	 * Gets the ID of the editor
	 * @return int
	 */
	public int getId_editor() {
		return id_editor;
	}
	
	/**
	 * Sets the ID of the editor
	 * @param id_editor int
	 */
	private void setId_editor(int id_editor) {
		this.id_editor = id_editor;
	}
	
	/**
	 * Gets the FK to the note
	 * @return int
	 */
	public int getFk_note() {
		return fk_note;
	}
	
	/**
	 * Sets the FK to the note
	 * @param fk_note int
	 */
	private void setFk_note(int fk_note) {
		this.fk_note = fk_note;
	}
	
	/**
	 * Gets the editor ip
	 * @return String
	 */
	public String getEditor_ip() {
		return editor_ip;
	}
	
	/**
	 * Sets the editor ip
	 * @param editor_ip String
	 */
	private void setEditor_ip(String editor_ip) {
		this.editor_ip = editor_ip;
	}
	
	/**
	 * Gets the edit time
	 * @return String
	 */
	public Timestamp getEdit_time() {
		return edit_time;
	}
	
	/**
	 * Sets the edit time
	 * @param edit_time String
	 */
	private void setEdit_time(Timestamp edit_time) {
		this.edit_time = edit_time;
	}

}
