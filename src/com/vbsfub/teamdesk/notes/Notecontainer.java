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
import java.util.UUID;

import com.vbsfub.teamdesk.db.Log;

/**
 * This class represents a Notecontainer
 *
 */
public class Notecontainer {
	private int notecontainerId;
	private String notecontainerUuid;
	protected Notecontent myNotecontent;
	protected List<Attachment> myAttachments;
	protected List<Editor> myEditors;
	protected List<Comment> myComments;
	private Log l = new Log();
	
	/**
	 * This will create a Notecontainer with all informations of a complete note
	 * @param notecontainerId The id of the container
	 * @param MyNotecontent A Notecontent Object
	 * @param myAttachments A Attachment Object List
	 * @param myEditors A Editor Object List
	 * @param myComments A COmment Object List
	 */
	public Notecontainer(int notecontainerId, Notecontent MyNotecontent, List<Attachment> myAttachments, List<Editor> myEditors, List<Comment> myComments){
		this.setNotecontainerId(notecontainerId);
		this.setNotecontainerUUID(getUniqueID());
		this.setMyNotecontent(MyNotecontent);
		this.setMyAttachments(myAttachments);
		this.setMyEditors(myEditors);
		this.setMyComments(myComments);
	}
	
	/**
	 * This checks if this container exists in a List contains of Notecontainer objects
	 * @param meAsArray List with Notecontainer
	 * @return True if yes, false if not
	 */
	public boolean isIn(List<Notecontainer> meAsArray){
		boolean ret = false;
		for(Notecontainer row : meAsArray){
			if(row.getNotecontainerId() == this.getNotecontainerId()){
				ret = true;
			}
		}
		return ret;
	}
	
	/**
	 * This checks if the container exists in a List contains of Notecontainer objects. If it does the number of the index is returned. if it doesn't -1 is returned
	 * @param meAsArray List with Notecontainer
	 * @return -1 for not found >= 0 index of the entry
	 */
	public int isInNr(List<Notecontainer> meAsArray){
		int ret = -1;
		for(int i = 0; i < meAsArray.size(); i++){
			Notecontainer row = meAsArray.get(i);
			if(row.getNotecontainerId() == this.getNotecontainerId()){
				ret = i;
			}
		}
		return ret;
	}
	
	/**
	 * This prints all Values and subvalues into the console - for debug purposes
	 */
	public void consoleDump(){
		int nr;
		
		l.spStart();
		
		l.spLine();
		
		l.spTitle("[Notecontainer]", 0);
		l.sp("id: " + notecontainerId, 0);
		l.sp("uuid: " + notecontainerUuid, 0);
		
		l.spLine();
		
		l.spTitle("[Notecontent]", 1);
		l.sp("id: " + myNotecontent.getID(), 1);
		l.sp("fk level: " + myNotecontent.getFk_level(), 1);
		l.sp("fk group: " + myNotecontent.getFk_group(), 1);
		l.sp("fk colors: " + myNotecontent.getFk_colors(), 1);
		l.sp("PosX: " + myNotecontent.getPos_x(), 1);
		l.sp("PosY: " + myNotecontent.getPos_y(), 1);
		l.sp("size: " + myNotecontent.getSize(), 1);
		l.sp("showtime: " + myNotecontent.getShowtime(), 1);
		l.sp("archivetime: " + myNotecontent.getArchivetime(), 1);
		l.sp("savetime: " + myNotecontent.getSavetime(), 1);
		l.sp("lastview: " + myNotecontent.getLastview(), 1);
		l.sp("title: " + myNotecontent.getTitle(), 1);
		l.sp("content: " + myNotecontent.getContent(), 1);
		
		l.spLine();
		
		l.spTitle("[Comments]", 1);
		nr = 1;
		for(Comment crow: myComments){
			
			l.spLine();
			
			l.spTitle("[Comment "+nr+"]", 2);
			nr++;
			l.sp("id: " + crow.getId_comment(), 2);
			l.sp("fk note: " + crow.getFk_note(), 2);
			l.sp("savetime: " + crow.getSavetime(), 2);
			l.sp("writer name: " + crow.getWriter_name(), 2);
			l.sp("writer ip: " + crow.getWriter_ip(), 2);
			l.sp("comment: " + crow.getComment(), 2);
		}
		
		l.spLine();
		
		l.spTitle("[Attachments]", 1);
		nr = 1;
		for(Attachment arow: myAttachments){
			
			l.spLine();
			
			l.spTitle("[Attachment "+nr+"]", 2);
			nr++;
			l.sp("id: " + arow.getId_attachment(), 2);
			l.sp("fk note: " + arow.getFk_note(), 2);
			l.sp("info: " + arow.getInfo(), 2);
			l.sp("link: " + arow.getLink(), 2);
			l.sp("log: " + arow.getLog(), 2);
		}
		
		l.spLine();
		
		l.spTitle("[Editors]", 1);
		nr = 1;
		for(Editor erow: myEditors){
			
			l.spLine();
			
			l.spTitle("[Editor "+nr+"]", 2);
			nr++;
			l.sp("id: " + erow.getId_editor(), 2);
			l.sp("fk note: " + erow.getFk_note(), 2);
			l.sp("editor: " + erow.getId_editor(), 2);
			l.sp("edit time: " + erow.getEdit_time(), 2);
		}
		
		l.spLine();
		
		l.spEnd();
	}
	

	
	/**
	 * Sets the UUID of the Notecontainer
	 * @param String uuid
	 */
	private void setNotecontainerUUID(String notecontainerUuid) {
		this.notecontainerUuid = notecontainerUuid;
	}
	
	/**
	 * Gets the UUID of the Notecontainer
	 * @return String
	 */
	public String getNotecontainerUUID(){
		return this.notecontainerUuid;
	}

	/**
	 * Returns a unique string which can be used as id of elements
	 * @return String uuid with replaced "-" to "_"
	 */
	protected String getUniqueID(){
		return String.valueOf(UUID.randomUUID()).replace("-", "_");
	}
	
	/**
	 * Gets the id of the Notecontainer
	 * @return int
	 */
	public int getNotecontainerId() {
		return notecontainerId;
	}
	
	/**
	 * Sets the id of the Notecontainer
	 * @param id
	 */
	private void setNotecontainerId(int notecontainerId) {
		this.notecontainerId = notecontainerId;
	}
	
	/**
	 * Gets the Notecontent object from this Notecontainer
	 * @return Notecontent
	 */
	public Notecontent getMyNotecontent() {
		return myNotecontent;
	}
	
	/**
	 * Sets the Notecontent object of the Notecontainer
	 * @param myNotecontent
	 */
	public void setMyNotecontent(Notecontent myNotecontent) {
		this.myNotecontent = myNotecontent;
	}
	
	/**
	 * Gets the a List with all Attachments
	 * @return Attachment List
	 */
	public List<Attachment> getMyAttachments() {
		return myAttachments;
	}
	
	/**
	 * Sets the List with all Attachments
	 * @param myAttachments
	 */
	private void setMyAttachments(List<Attachment> myAttachments) {
		this.myAttachments = myAttachments;
	}
	
	/**
	 * Gets the a List with all Editors
	 * @return Editor List
	 */
	public List<Editor> getMyEditors() {
		return myEditors;
	}
	
	/**
	 * Sets the List with all Editors
	 * @param Editors
	 */
	private void setMyEditors(List<Editor> myEditors) {
		this.myEditors = myEditors;
	}
	
	/**
	 * Gets the a List with all Comments
	 * @return Comment List
	 */
	public List<Comment> getMyComments() {
		return myComments;
	}
	
	/**
	 * Sets the List with all Comments
	 * @param Comment
	 */
	private void setMyComments(List<Comment> myComments) {
		this.myComments = myComments;
	}
}
