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
import java.util.Date;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import com.vbsfub.teamdesk.db.Tools;

/**
 * This class represents the details and content of a note
 *
 */
public class Notecontent{
	private int 		id_note;
	private String 		title;
	private String 		content;
	private Timestamp 	showtime;
	private Timestamp	archivetime;
	private Timestamp	savetime;
	private Timestamp	lastview;
	private boolean		archived;
	private int			pos_x;
	private int			pos_y;
	private int			fk_level;
	private String		size;
	private int			fk_group;
	private int 		fk_colors;
	private Timestamp 	locked_at;
	private int 		locktimerange = 10000;
	private Date 		meNow = new Date();
	private String		locked_by;
	private Tools myTools = new Tools();
	
	/**
	 * The Constructor of the Notecontent
	 * @param id_note
	 * @param title
	 * @param content
	 * @param showtime
	 * @param archivetime
	 * @param savetime
	 * @param lastview
	 * @param archived
	 * @param pos_x
	 * @param pos_y
	 * @param fk_level
	 * @param size
	 * @param fk_group
	 * @param fk_colors
	 * @param locked
	 */
	public Notecontent(int id_note, String title, String content, Timestamp showtime, Timestamp archivetime,
			Timestamp savetime, Timestamp lastview, boolean archived, int pos_x, int pos_y, int fk_level,
			String size, int fk_group, int fk_colors, Timestamp locked_at, String locked_by){
		this.setID(id_note);
		this.setTitle(title);
		this.setContent(content);
		this.setShowtime(showtime);
		this.setArchivetime(archivetime);
		this.setSavetime(savetime);
		this.setLastview(lastview);
		this.setArchived(archived);
		this.setPos_x(pos_x);
		this.setPos_y(pos_y);
		this.setFk_level(fk_level);
		this.setSize(size);
		this.setFk_group(fk_group);
		this.setFk_colors(fk_colors);
		this.setLocked_at(locked_at);
		this.setLocked_by(locked_by);
	}
	
	/**
	 * This returns a int count with changes compared from this to another Notecontent
	 * @param toCompare Notecontent
	 * @return int 
	 */
	public int countChanges(Notecontent toCompare){
		int changes = 0;
		
		if(!toCompare.getTitle().equals(this.title)){
			changes++;
		}
		
		if(!(toCompare.getID() == this.id_note)){
			changes++;
		}
		
		if(!toCompare.getContent().equals(this.content)){
			changes++;
		}
		
		if(!toCompare.getShowtime().equals(this.showtime)){
			changes++;
		}
		
		if(toCompare.getArchivetime() != null && this.archivetime != null){
			if(!toCompare.getArchivetime().equals(this.archivetime)){
				changes++;
			}
		}else if (toCompare.getArchivetime() == null && this.archivetime != null){
			changes++;
		}else if (toCompare.getArchivetime() != null && this.archivetime == null){
			changes++;
		}
		
		if(!toCompare.getSavetime().equals(this.savetime)){
			changes++;
		}
		
		if(!toCompare.getLastview().equals(this.lastview)){
			changes++;
		}
		
		if(!(toCompare.getPos_x() == this.pos_x)){
			changes++;
		}
		
		if(!(toCompare.getPos_y() == this.pos_y)){
			changes++;
		}
		
		if(!(toCompare.getFk_level() == this.fk_level)){
			changes++;
		}
		
		if(!toCompare.getSize().equals(this.size)){
			changes++;
		}
		
		if(!(toCompare.getFk_group() == this.fk_group)){
			changes++;
		}
		
		if(!(toCompare.getFk_colors() == this.fk_colors)){
			changes++;
		}
		
		if(!(toCompare.isLocked() == this.isLocked())){
			changes++;
		}
		
		if(!(toCompare.isArchived() == this.archived)){
			changes++;
		}
		
		return changes;
	}
	
	/**
	 * This checks if the object has changed
	 * @param toCompare Notecontent to compare
	 * @return boolean True if changed false if not
	 */
	public boolean hasChanged(Notecontent toCompare){
		if(this.countChanges(toCompare) != 0){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * This gets the changes of another given Notecontent object
	 * @param toCompare Notecontent to compare
	 * @param applyChanges boolean Set this to true if you want to apply the found changes
	 * @return JSONObject which contains the changed values from the given Notecontent object. the Object can contain:<br>
	 * id<br>
	 * title<br>
	 * content<br>
	 * showtime<br>
	 * archivetime<br>
	 * savetime<br>
	 * lastview<br>
	 * archived<br>
	 * pos_x<br>
	 * pos_y<br>
	 * fk_level<br>
	 * size<br>
	 * fk_group<br>
	 * fk_colors<br>
	 * locked
	 */
	public JSONObject getChanges(Notecontent toCompare, boolean applyChanges){
		
		JSONObject myChanges = new JSONObject();
		try {
			if(!(toCompare.getID() == this.id_note)){
				myChanges.put("id", toCompare.getID());
				if(applyChanges){
					this.setID(id_note);
				}
			}
			
			if(!toCompare.getTitle().equals(this.title)){
				myChanges.put("title", toCompare.getTitle());
				if(applyChanges){
					this.setTitle(toCompare.getTitle());
				}
			}
			
			if(!toCompare.getContent().equals(this.content)){
				myChanges.put("content", toCompare.getContent());
				if(applyChanges){
					this.setContent(toCompare.getContent());
				}
			}
			
			if(!toCompare.getShowtime().equals(this.showtime)){
				myChanges.put("showtime", myTools.formatTsToStr(toCompare.getShowtime()));
				if(applyChanges){
					this.setShowtime(toCompare.getShowtime());
				}
			}
			
			if(toCompare.getArchivetime() != null && this.archivetime != null){
				if(!toCompare.getArchivetime().equals(this.archivetime)){
					myChanges.put("archivetime", myTools.formatTsToStr(toCompare.getArchivetime()));
					if(applyChanges){
						this.setArchivetime(toCompare.getArchivetime());
					}
				}
			}else if(toCompare.getArchivetime() == null && this.archivetime != null){
				if(toCompare.getArchivetime() == null){
					myChanges.put("archivetime", JSONObject.NULL);
				}else{
					myChanges.put("archivetime", myTools.formatTsToStr(toCompare.getArchivetime()));
				}
				if(applyChanges){
					this.setArchivetime(toCompare.getArchivetime());
				}
			}else if(toCompare.getArchivetime() != null && this.archivetime == null){
				if(toCompare.getArchivetime() == null){
					myChanges.put("archivetime", JSONObject.NULL);
				}else{
					myChanges.put("archivetime", myTools.formatTsToStr(toCompare.getArchivetime()));
				}

				if(applyChanges){
					this.setArchivetime(toCompare.getArchivetime());
				}
			}
			
			
			if(!toCompare.getSavetime().equals(this.savetime)){
				myChanges.put("savetime", myTools.formatTsToStr(toCompare.getSavetime()));
				if(applyChanges){
					this.setSavetime(toCompare.getSavetime());
				}
			}
			
			if(!toCompare.getLastview().equals(this.lastview)){
				myChanges.put("lastview", myTools.formatTsToStr(toCompare.getLastview()));
				if(applyChanges){
					this.setLastview(toCompare.getLastview());
				}
			}
			
			if(!(toCompare.isArchived() == this.archived)){
				myChanges.put("archived", toCompare.isArchived());
				if(applyChanges){
					this.setArchived(toCompare.isArchived());
				}
			}
			
			if(!(toCompare.getPos_x() == this.pos_x)){
				myChanges.put("pos_x", toCompare.getPos_x());
				if(applyChanges){
					this.setPos_x(toCompare.getPos_x());
				}
			}
			
			if(!(toCompare.getPos_y() == this.pos_y)){
				myChanges.put("pos_y", toCompare.getPos_y());
				if(applyChanges){
					this.setPos_y(toCompare.getPos_y());
				}
			}
			
			if(!(toCompare.getFk_level() == this.fk_level)){
				myChanges.put("fk_level", toCompare.getFk_level());
				if(applyChanges){
					this.setFk_level(toCompare.getFk_level());
				}
			}
			
			if(!toCompare.getSize().equals(this.size)){
				myChanges.put("size", toCompare.getSize());
				if(applyChanges){
					this.setSize(toCompare.getSize());
				}
			}
			
			if(!(toCompare.getFk_group() == this.fk_group)){
				myChanges.put("fk_group", toCompare.getFk_group());
				if(applyChanges){
					this.setFk_group(toCompare.getFk_group());
				}
			}
			
			if(!(toCompare.getFk_colors() == this.fk_colors)){
				myChanges.put("fk_colors", toCompare.getFk_colors());
				if(applyChanges){
					this.setFk_colors(toCompare.getFk_colors());
				}
			}
			if(!(toCompare.isLocked() == this.isLocked())){
				myChanges.put("locked", toCompare.isLocked());
				myChanges.put("locked_by", toCompare.getLocked_by());
				myChanges.put("locked_at", myTools.formatTsToStr(toCompare.getLocked_at()));
				
				if(applyChanges){
					this.setLocked_by(toCompare.getLocked_by());
					this.setLocked_at(toCompare.getLocked_at());
					this.meNow = new Date();
				}
			}
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return myChanges;
	}
	
	/**
	 * This checks if this notecontent exists in a List contains of Notecontent objects
	 * @param meAsArray List with Notecontent
	 * @return True if yes, false if not
	 */
	public boolean isIn(List<Notecontent> meAsArray){
		boolean ret = false;
		for(Notecontent row : meAsArray){
			if(row.getID() == this.getID()){
				ret = true;
			}
		}
		return ret;
	}
	
	/**
	 * This checks if the container exists in a List contains of Notecontent objects. If it does the number of the index is returned. if it doesn't -1 is returned
	 * @param meAsArray List with Notecontent
	 * @return -1 for not found >= 0 index of the entry
	 */
	public int isInNr(List<Notecontent> meAsArray){
		int ret = -1;
		for(int i = 0; i < meAsArray.size(); i++){
			Notecontent row = meAsArray.get(i);
			if(row.getID() == this.getID()){
				ret = i;
			}
		}
		return ret;
	}
	
	/**
	 * Gets the ID of this note
	 * @return int
	 */
	public int getID(){
		return this.id_note;
	}
	
	/**
	 * Sets the ID of this note
	 * @param id_note int
	 */
	private void setID(int id_note){
		this.id_note = id_note;
	}
	
	/**
	 * Gets the title of this note
	 * @return String
	 */
	public String getTitle(){
		return this.title;
	}
	
	/**
	 * Sets the title of this note
	 * @param title String
	 */
	public void setTitle(String title){
		this.title = title;
	}
	
	/**
	 * Gets the content of the note
	 * @return String
	 */
	public String getContent(){
		return this.content;
	}
	
	/**
	 * Sets the content of the note
	 * @param content String
	 */
	public void setContent(String content){
		this.content = content;
	}
	
	/**
	 * Gets the showtime of the note
	 * @return Timestamp
	 */
	public Timestamp getShowtime() {
		return showtime;
	}
	
	/**
	 * Sets the showtime of the note
	 * @param showtime Timestamp
	 */
	public void setShowtime(Timestamp showtime) {
		this.showtime = showtime;
	}
	
	/**
	 * Gets the archivetime of the note
	 * @return Timestamp
	 */
	public Timestamp getArchivetime() {
		return archivetime;
	}
	
	/**
	 * Sets the archivetime of the note
	 * @param archivetime Timestamp
	 */
	public void setArchivetime(Timestamp archivetime) {
		this.archivetime = archivetime;
	}
	
	/**
	 * Gets the savetime of the note
	 * @return Timestamp
	 */
	public Timestamp getSavetime() {
		return savetime;
	}
	
	/**
	 * Sets the savetime of the note
	 * @param savetime Timestamp
	 */
	public void setSavetime(Timestamp savetime) {
		this.savetime = savetime;
	}
	
	/**
	 * Gets the lastview of the note
	 * @return Timestamp
	 */
	public Timestamp getLastview() {
		return lastview;
	}
	
	/**
	 * Sets the lastview of the note
	 * @param lastview Timestamp
	 */
	public void setLastview(Timestamp lastview) {
		this.lastview = lastview;
	}
	
	/**
	 * Check if the note is archived
	 * @return boolean
	 */
	public boolean isArchived() {
		return archived;
	}
	
	/**
	 * Sets the archived state of the note
	 * @param archived boolean
	 */
	public void setArchived(boolean archived) {
		this.archived = archived;
	}
	
	/**
	 * Gets the X position of the note
	 * @return int
	 */
	public int getPos_x() {
		return pos_x;
	}
	
	/**
	 * Sets the X position of the note
	 * @param pos_x int
	 */
	public void setPos_x(int pos_x) {
		this.pos_x = pos_x;
	}
	
	/**
	 * Gets the Y position of the note
	 * @return int
	 */
	public int getPos_y() {
		return pos_y;
	}
	
	/**
	 * Sets the Y position of the note
	 * @param pos_y int
	 */
	public void setPos_y(int pos_y) {
		this.pos_y = pos_y;
	}
	
	/**
	 * Gets the fk_level from the note
	 * @return int
	 */
	public int getFk_level() {
		return fk_level;
	}
	
	/**
	 * Sets the fk_level of the note
	 * @param fk_level int
	 */
	public void setFk_level(int fk_level) {
		this.fk_level = fk_level;
	}
	
	/**
	 * Gets the size of the note 1366x798 format
	 * @return String
	 */
	public String getSize() {
		return size;
	}
	
	/**
	 * Sets the size of the note 1366x798 format
	 * @param size String
	 */
	public void setSize(String size) {
		this.size = size;
	}
	
	/**
	 * Gets the fk_group from the note
	 * @return int
	 */
	public int getFk_group() {
		return fk_group;
	}
	
	/**
	 * Sets the fk_group of the note
	 * @param fk_group int
	 */
	private void setFk_group(int fk_group) {
		this.fk_group = fk_group;
	}
	
	/**
	 * Gets the fk_colors from the note
	 * @return int
	 */
	public int getFk_colors() {
		return fk_colors;
	}
	
	/**
	 * Sets the fk_colors of the note
	 * @param fk_colors int
	 */
	public void setFk_colors(int fk_colors) {
		this.fk_colors = fk_colors;
	}
	
	/**
	 * Check if the note is locked 
	 * @return boolean
	 */
	public boolean isLocked() {
		if(this.getLocked_at() == null || this.getLocked_at().getTime() + locktimerange < meNow.getTime()){
			return false;
		}else{
			return true;
		}
	}
	
	/**
	 * Gets the last locked at state of the note
	 * @return Timestamp
	 */
	public Timestamp getLocked_at() {
		return locked_at;
	}
	
	/**
	 * Sets the last locked at state of the note
	 * @param locked_at
	 */
	public void setLocked_at(Timestamp locked_at) {
		this.locked_at = locked_at;
		this.meNow = new Date();
	}
	
	/**
	 * Gets the info about the person who last locked the note
	 * @return String
	 */
	public String getLocked_by() {
		return locked_by;
	}
	
	/**
	 * Sets the info about the person who last locked the note
	 * @param locked_by
	 */
	public void setLocked_by(String locked_by) {
		this.locked_by = locked_by;
	}
}


