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

import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * This class represents the details and content of an attachment
 *
 */
public class Attachment{
	private int id_attachment;
	private int fk_note;
	private String link;
	private String info;
	private String log;
	
	/**
	 * The constructor for an Attachment
	 * @param id_attachment
	 * @param fk_note
	 * @param link
	 * @param info
	 * @param log
	 */
	public Attachment(int id_attachment, int fk_note, String link, String info, String log) {
		this.setId_attachment(id_attachment);
		this.setFk_note(fk_note);
		this.setLink(link);
		this.setInfo(info);
		this.setLog(log);
	}
	
	/**
	 * This returns a int count with changes compared from this to another Attachment object 
	 * @param toCompare Comment
	 * @return int
	 */
	public int countChanges(Attachment toCompare){
		int changes = 0;
		
		if(!(toCompare.getId_attachment() == this.getId_attachment())){
			changes++;
		}
		
		if(!(toCompare.getFk_note() == this.getFk_note())){
			changes++;
		}
		
		if(!toCompare.getLink().equals(this.getLink())){
			changes++;
		}
		
		if(!toCompare.getInfo().equals(this.getInfo())){
			changes++;
		}
		
		if(!toCompare.getLog().equals(this.getLog())){
			changes++;
		}
		
		return changes;
	}
	
	/**
	 * This gets the changes of another given Attachment object
	 * @param toCompare Attachment object to compare
	 * @param applyChanges boolean Set this to true if you want to apply the found changes
	 * @return JSONObject which contains the changed values from the given Attachment object. the Object can contain:<br>
	 */
	public JSONObject getChanges(Attachment toCompare, boolean applyChanges){
		JSONObject myChanges = new JSONObject();
		try {
			
			/**
			 * toadd_attachment.put("id", String.valueOf(new_attachment_hash[0]));
				toadd_attachment.put("link", (String) new_attachment.get(i)[1]);
				toadd_attachment.put("info", (String) new_attachment.get(i)[2]);
				toadd_attachment.put("log", (String) new_attachment.get(i)[3]);
				toadd_attachment.put("fk_note", String.valueOf(new_attachment.get(i)[4]));
				toadd_attachment.put("uuid", (String) new_attachment.get(i)[5]);
			 */
			
			if(!(toCompare.getId_attachment() == this.getId_attachment())){
				myChanges.put("id", toCompare.getId_attachment());
				if(applyChanges){
					this.setId_attachment(toCompare.getId_attachment());
				}
			}
			
			if(!(toCompare.getFk_note() == this.getFk_note())){
				myChanges.put("fk_note", toCompare.getFk_note());
				if(applyChanges){
					this.setFk_note(toCompare.getFk_note());
				}
			}
			
			if(!toCompare.getLink().equals(this.getLink())){
				myChanges.put("link", toCompare.getLink());
				if(applyChanges){
					this.setLink(toCompare.getLink());
				}
			}
			
			if(!toCompare.getInfo().equals(this.getInfo())){
				myChanges.put("info", toCompare.getInfo());
				if(applyChanges){
					this.setInfo(toCompare.getInfo());
				}
			}
			
			if(!toCompare.getLog().equals(this.getLog())){
				myChanges.put("log", toCompare.getLog());
				if(applyChanges){
					this.setLog(toCompare.getLog());
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return myChanges;
	}
	
	/**
	 * This checks if the object has changed
	 * @param toCompare Attachment to compare
	 * @return boolean True if changed false if not
	 */
	public boolean hasChanged(Attachment toCompare){
		if(this.countChanges(toCompare) != 0){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * This checks if this Attachment exists in a List contains of Attachment objects
	 * @param meAsArray List with Attachment objects
	 * @return True if yes, false if not
	 */
	public boolean isIn(List<Attachment> meAsArray){
		boolean ret = false;
		for(Attachment row : meAsArray){
			if(row.getId_attachment() == this.getId_attachment()){
				ret = true;
			}
		}
		return ret;
	}
	
	/**
	 * This checks if the container exists in a List contains of Attachment objects. If it does the number of the index is returned. if it doesn't -1 is returned
	 * @param meAsArray List with Attachment
	 * @return -1 for not found >= 0 index of the entry
	 */
	public int isInNr(List<Attachment> meAsArray){
		int ret = -1;
		for(int i = 0; i < meAsArray.size(); i++){
			Attachment row = meAsArray.get(i);
			if(row.getId_attachment() == this.getId_attachment()){
				ret = i;
			}
		}
		return ret;
	}
	
	/**
	 * Gets the id of the attachment
	 * @return int
	 */
	public int getId_attachment() {
		return id_attachment;
	}
	
	/**
	 * Sets the id of the attachment
	 * @param id_attachment int
	 */
	private void setId_attachment(int id_attachment) {
		this.id_attachment = id_attachment;
	}
	
	/**
	 * Gets the fk of the note
	 * @return int
	 */
	public int getFk_note() {
		return fk_note;
	}
	
	/**
	 * Sets the fk of the note
	 * @param fk_note int
	 */
	private void setFk_note(int fk_note) {
		this.fk_note = fk_note;
	}
	
	/**
	 * Gets the Link of the attachment
	 * @return String
	 */
	public String getLink() {
		return link;
	}
	
	/**
	 * Sets the Link of the attachment
	 * @param link String
	 */
	private void setLink(String link) {
		this.link = link;
	}
	
	/**
	 * Gets the info of the attachment
	 * @return String
	 */
	public String getInfo() {
		return info;
	}
	
	/**
	 * Sets the info of the attachment
	 * @param info String
	 */
	private void setInfo(String info) {
		this.info = info;
	}
	
	/**
	 * Gets the log of the attachment
	 * @return String
	 */
	public String getLog() {
		return log;
	}
	
	/**
	 * Sets the log of the attachmnet
	 * @param log
	 */
	private void setLog(String log) {
		this.log = log;
	}

}
