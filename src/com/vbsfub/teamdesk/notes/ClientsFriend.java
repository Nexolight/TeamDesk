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

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.vbsfub.teamdesk.db.Tools;

/**
 * This class is used for comparison and client friendly translation of this package
 */
public class ClientsFriend {
	
	private boolean doUpdate;
	private Tools myTools;
	
	/**
	 * The constructor of ClientsFriend. Just load it
	 */
	public ClientsFriend(){
		doUpdate = false;
		myTools = new Tools();
	}
	
	/**
	 * This returns true after a getClientCommands call when it found differences between the two given Notecontainer lists.
	 * If no differences were found it returns false
	 * @return boolean
	 */
	public boolean updateRequired(){
		return doUpdate;
	}
	
	/**
	 * This creates a construct like this<br>
	 * JSON Object<br>
	 * 		Multiple JSON Objects (key = Command type, value = JSON Array)<br>
	 * 			JSON Array<br>
	 * 				Multiple JSON Objects (Key = purpose, value = data)<br>
	 * @param oldNotes Notecontainer list before update
	 * @param newNotes Notecontainer list after update
	 * @return A JSON Object which contains all needed remove/add/change instructions for the client
	 */
	public JSONObject getClientCommands(List<Notecontainer> oldNotes, List<Notecontainer> newNotes) {
		
		doUpdate = false;
		JSONObject commands = new JSONObject();
		try {
			if(oldNotes!= null){ //Workaround
				JSONArray delete_notes = new JSONArray();
				JSONArray delete_comments = new JSONArray();
				JSONArray delete_attachments = new JSONArray();
				//Editors are final static entrys - no remove needed
				//Notecontent is removed within the notecontainer
				
				List<Integer> oldNotesToRemove = new ArrayList<Integer>();
				for(int i = 0; oldNotes.size() > i; i++){
					Notecontainer myOldContainer = oldNotes.get(i);
					int nCExist = -1;
					if((nCExist = myOldContainer.isInNr(newNotes)) < 0){
						//Remove Notecontainer - It contains every detail of a note - so there are no more options needed if it doesn't exist anymore
						JSONObject delete_note = new JSONObject();
						delete_note.put("containerID", myOldContainer.getNotecontainerId());
						delete_note.put("uuid", myOldContainer.getNotecontainerUUID());
						delete_notes.put(delete_note);
						oldNotesToRemove.add(i);
						doUpdate = true;
					}else{
						//Check for old Attachments and remove
						List<Attachment> oldAttachments = myOldContainer.getMyAttachments();
						List<Attachment> newAttachments = newNotes.get(nCExist).getMyAttachments(); // nCExist alias "i" - Notecontainer
						List<Integer> oldAttachmentsToRemove = new ArrayList<Integer>();
						for(int i2 = 0; i2 < oldAttachments.size(); i2++){
							if(!oldAttachments.get(i2).isIn(newAttachments)){
								Attachment oneAttachment = oldAttachments.get(i2);
								JSONObject delete_attachment = new JSONObject();
								delete_attachment.put("id", oneAttachment.getId_attachment());
								delete_attachment.put("fk_note", myOldContainer.getNotecontainerId());
								delete_attachments.put(delete_attachment);
								oldAttachmentsToRemove.add(i2);
								doUpdate = true;
							}
						}
						for(Integer index : oldAttachmentsToRemove){
							oldNotes.get(nCExist).getMyAttachments().remove(Integer.valueOf(index)); //Remove the Attachments because it was deleted
						}
						
						//Check for old Comments and remove
						List<Comment> oldComments = myOldContainer.getMyComments();
						List<Comment> newComments = newNotes.get(nCExist).getMyComments(); // nCExist alias "i" - Notecontainer
						List<Integer> oldCommentsToRemove = new ArrayList<Integer>();
						for(int i2 = 0; i2 < oldComments.size(); i2++){
							if(!oldComments.get(i2).isIn(newComments)){
								Comment oneComment = oldComments.get(i2);
								JSONObject delete_comment = new JSONObject();
								delete_comment.put("id", oneComment.getId_comment());
								delete_comment.put("fk_note", myOldContainer.getNotecontainerId());
								delete_comments.put(delete_comment);
								oldCommentsToRemove.add(i2);
								doUpdate = true;
							}
						}
						for(Integer index : oldCommentsToRemove){
							oldNotes.get(nCExist).getMyComments().remove(Integer.valueOf(index)); //Remove the Comments because it was deleted
						}
					}
				}
				for(Integer index : oldNotesToRemove){
					oldNotes.remove(Integer.valueOf(index)); //Remove this whole container because it didn't exist before. Later these two lists comparing again
				}
				
				commands.put("REMOVE_NOTES", delete_notes);
				commands.put("REMOVE_COMMENTS", delete_comments);
				commands.put("REMOVE_ATTACHMENTS", delete_attachments);
				//Editors are final static entrys - no remove needed
				//Notecontent is removed within the notecontainer
			}
			
			JSONArray add_notes = new JSONArray();
			JSONArray add_notecontents = new JSONArray();
			JSONArray add_editors = new JSONArray();
			JSONArray add_comments = new JSONArray();
			JSONArray add_attachments = new JSONArray();
			
			for(int i = 0; newNotes.size() > i; i++){	
				Notecontainer myNewContainer = newNotes.get(i);
				int nCExist = -1;
				if(oldNotes == null || (nCExist = myNewContainer.isInNr(oldNotes)) < 0){ //Workaround
					//Add Notecontainer
					JSONObject add_note = new JSONObject();
					add_note.put("containerID", myNewContainer.getNotecontainerId());
					add_note.put("uuid", myNewContainer.getNotecontainerUUID());
					add_notes.put(add_note);
					//Add Notecontent
					Notecontent myContent = myNewContainer.getMyNotecontent();
					JSONObject add_notecontent = new JSONObject();
					add_notecontent.put("id", myContent.getID());
					add_notecontent.put("title", myContent.getTitle());
					add_notecontent.put("content", myContent.getContent());
					add_notecontent.put("showtime", myTools.formatTsToStr(myContent.getShowtime()));
					add_notecontent.put("archivetime", myTools.formatTsToStr(myContent.getArchivetime()));
					add_notecontent.put("savetime", myTools.formatTsToStr(myContent.getSavetime()));
					add_notecontent.put("lastview", myTools.formatTsToStr(myContent.getLastview()));
					add_notecontent.put("archived", myTools.booleanToInt(myContent.isArchived()));
					add_notecontent.put("pos_x", myContent.getPos_x());
					add_notecontent.put("pos_y", myContent.getPos_y());
					add_notecontent.put("fk_level", myContent.getFk_level());
					add_notecontent.put("size", myContent.getSize());
					add_notecontent.put("fk_group", myContent.getFk_group());
					add_notecontent.put("fk_colors", myContent.getFk_colors());
					add_notecontent.put("locked", myTools.booleanToInt(myContent.isLocked()));
					add_notecontent.put("locked_by", myContent.getLocked_by());
					add_notecontent.put("locked_at", myTools.formatTsToStr(myContent.getLocked_at()));
					add_notecontents.put(add_notecontent);	
					//Add Editors
					List<Editor> myEditors = myNewContainer.getMyEditors();
					for(int i2 = 0; myEditors.size() > i2; i2++){
						Editor oneEditor = myEditors.get(i2);
						//Add them and don't care about if they could exist already, because the note is new!
						JSONObject add_editor = new JSONObject();
						add_editor.put("id", oneEditor.getId_editor());
						add_editor.put("editor_ip", oneEditor.getEditor_ip());
						add_editor.put("edit_time", myTools.formatTsToStr(oneEditor.getEdit_time()));
						add_editor.put("fk_note", oneEditor.getFk_note());
						add_editors.put(add_editor);
					}
					//Add Attachments
					List<Attachment> myAttachments = myNewContainer.getMyAttachments();
					for(int i2 = 0; myAttachments.size() > i2; i2++){
						Attachment oneAttachment = myAttachments.get(i2);
						//Add them and don't care about if they could exist already, because the note is new!
						JSONObject add_attachment = new JSONObject();
						add_attachment.put("id", oneAttachment.getId_attachment());
						add_attachment.put("link", oneAttachment.getLink());
						add_attachment.put("info", oneAttachment.getInfo());
						add_attachment.put("log", oneAttachment.getLog());
						add_attachment.put("fk_note", oneAttachment.getFk_note());
						add_attachments.put(add_attachment);
					}
					//Add comments
					List<Comment> myComments = myNewContainer.getMyComments();
					for(int i2 = 0; myComments.size() > i2; i2++){
						Comment oneComment = myComments.get(i2);
						//Add them and don't care about if they could exist already, because the note is new!
						JSONObject add_comment = new JSONObject();
						add_comment.put("id", oneComment.getId_comment());
						add_comment.put("comment", oneComment.getComment());
						add_comment.put("writer_ip", oneComment.getWriter_ip());
						add_comment.put("savetime", myTools.formatTsToStr(oneComment.getSavetime()));
						add_comment.put("writer_name", oneComment.getWriter_name());
						add_comment.put("fk_note", oneComment.getFk_note());
						add_comments.put(add_comment);
					}
					//Add this whole container because it didn't exist before. Later these two lists comparing again
					if(oldNotes != null){ //Workaround
						oldNotes.add(myNewContainer);
					}
					doUpdate = true;
				}else{
					//Check for new Attachments and add
					List<Attachment> newAttachments = myNewContainer.getMyAttachments();
					List<Attachment> oldAttachments = oldNotes.get(nCExist).getMyAttachments(); // nCExist alias "i" - Notecontainer
					for(int i3 = 0; i3 < newAttachments.size(); i3++){
						if(!newAttachments.get(i3).isIn(oldAttachments)){
							Attachment oneAttachment = newAttachments.get(i3);
							JSONObject add_attachment = new JSONObject();
							add_attachment.put("id", oneAttachment.getId_attachment());
							add_attachment.put("link", oneAttachment.getLink());
							add_attachment.put("info", oneAttachment.getInfo());
							add_attachment.put("log", oneAttachment.getLog());
							add_attachment.put("fk_note", oneAttachment.getFk_note());
							add_attachments.put(add_attachment);
							oldNotes.get(nCExist).getMyAttachments().add(oneAttachment);
							doUpdate = true;
						}
					}
					//Check for new Comments and add
					List<Comment> newComments = myNewContainer.getMyComments();
					List<Comment> oldComments = oldNotes.get(nCExist).getMyComments(); // nCExist alias "i" - Notecontainer
					for(int i3 = 0; i3 < newComments.size(); i3++){
						if(!newComments.get(i3).isIn(oldComments)){
							Comment oneComment = newComments.get(i3);
							JSONObject add_comment = new JSONObject();
							add_comment.put("id", oneComment.getId_comment());
							add_comment.put("comment", oneComment.getComment());
							add_comment.put("writer_ip", oneComment.getWriter_ip());
							add_comment.put("savetime", myTools.formatTsToStr(oneComment.getSavetime()));
							add_comment.put("writer_name", oneComment.getWriter_name());
							add_comment.put("fk_note", oneComment.getFk_note());
							add_comments.put(add_comment);
							oldNotes.get(nCExist).getMyComments().add(oneComment);
							doUpdate = true;
						}
					}
					//Check for new Editors and add
					List<Editor> newEditors = myNewContainer.getMyEditors();
					List<Editor> oldEditors = oldNotes.get(nCExist).getMyEditors(); // nCExist alias "i" - Notecontainer
					for(int i3 = 0; i3 < newEditors.size(); i3++){
						if(!newEditors.get(i3).isIn(oldEditors)){
							Editor oneEditor = newEditors.get(i3);
							JSONObject add_editor = new JSONObject();
							add_editor.put("id", oneEditor.getId_editor());
							add_editor.put("editor_ip", oneEditor.getEditor_ip());
							add_editor.put("edit_time", myTools.formatTsToStr(oneEditor.getEdit_time()));
							add_editor.put("fk_note", oneEditor.getFk_note());
							add_editors.put(add_editor);
							oldNotes.get(nCExist).getMyEditors().add(oneEditor);
							doUpdate = true;
						}
					}
				}
			}
			
			commands.put("ADD_NOTES", add_notes);
			commands.put("ADD_NOTECONTENTS", add_notecontents);
			commands.put("ADD_EDITORS", add_editors);
			commands.put("ADD_COMMENTS", add_comments);
			commands.put("ADD_ATTACHMENTS", add_attachments);
			
			JSONArray change_notecontents = new JSONArray();
			JSONArray change_comments = new JSONArray();
			//Editors are final static entrys - no change will be done
			//Notes are containers - no change will be done
			//Attachments are final static entrys - no change will be done 
			
			//Above we've added each new entry and removed each old entry from the oldNotes and it's subcontainers.
			//Now both (newNotes & oldNotes) have the same container, but they can still differ if there where only changes.
			if(oldNotes != null && oldNotes.size() == newNotes.size()){ //Workarround
				int sharedcontainersize = oldNotes.size();
				//Get the changes in the content
				for(int i5 = 0; i5 < sharedcontainersize; i5++){
					Notecontainer myNewContainer = newNotes.get(i5);
					int oldContainerIndex = myNewContainer.isInNr(oldNotes);
					Notecontainer myOldContainer = oldNotes.get(oldContainerIndex); //The Containers have different indexes now - idk why. Because of this i use isInNr.
					Notecontent myOldContent = myOldContainer.getMyNotecontent();
					Notecontent myNewContent = myNewContainer.getMyNotecontent();
					
					JSONObject contentchanges = myOldContent.getChanges(myNewContent, true);
					if(contentchanges.length() > 0){
						contentchanges.put("id_note", myNewContent.getID());
						change_notecontents.put(contentchanges);
						oldNotes.get(oldContainerIndex).setMyNotecontent(myNewContent); //apply
						doUpdate = true;
					}
					
					if(myOldContainer.getMyComments().size() == myNewContainer.getMyComments().size()){
						int sharedcommentssize = myOldContainer.getMyComments().size();
						//Get the changes in the comments
						for(int i6 = 0; i6 < sharedcommentssize; i6++){
							Comment myNewComment = myNewContainer.getMyComments().get(i6);
							int oldCommentIndex = myNewComment.isInNr(myOldContainer.getMyComments()); //The Containers have different indexes now - idk why. Because of this i use isInNr.
							Comment myOldComment = myOldContainer.getMyComments().get(oldCommentIndex);		
							JSONObject commentchanges = myOldComment.getChanges(myNewComment, true);
							if(commentchanges.length() > 0){
								commentchanges.put("id_comment", myNewComment.getId_comment());
								commentchanges.put("fk_note", myNewComment.getFk_note());
								change_comments.put(commentchanges);
								oldNotes.get(oldContainerIndex).getMyComments().set(oldCommentIndex, myNewComment); //apply
								doUpdate = true;
							}
						}
					}
				}
			}
			
			commands.put("CHANGE_NOTECONTENTS", change_notecontents);
			commands.put("CHANGE_COMMENTS", change_comments);
			//Editors are final static entrys - no change will be done
			//Notes are containers - no change will be done
			//Attachments are final static entrys - no change will be done 
			
		} catch (JSONException e4) {
			e4.printStackTrace();
		}
		
		return commands;
	}
}
