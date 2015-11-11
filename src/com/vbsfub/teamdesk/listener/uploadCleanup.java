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
package com.vbsfub.teamdesk.listener;

import java.io.File;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import com.vbsfub.teamdesk.db.Querys;
import com.vbsfub.teamdesk.notes.Attachment;
import com.vbsfub.teamdesk.notes.Notecontainer;

/**
 * Application Lifecycle Listener implementation class appRunListener
 */
@WebListener
public class uploadCleanup implements ServletContextListener {
	
	private Querys myQuerys;
	
    /**
     * Default constructor. 
     */
    public uploadCleanup() {
    	this.myQuerys = new Querys();
    }

	/**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent arg0)  { 
    	
    }

	/**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent arg0)  { 
    	final ServletContextEvent myContextEvent = arg0;
    	
    	/**
    	 * This thread is used to cleanup uploaded files which don't have a reference to a note anymore.
    	 * Attachments should be deleted normally but not for sure. The Embled attachments inside the notes
    	 * can't be really controlled. 
    	 */
        TimerTask fileCleaner = new TimerTask(){
        	
        	@Override
        	public void run(){   
        		String uploaddir = myContextEvent.getServletContext().getRealPath("/upload") + "/";
    			File[] existingFiles = new File(uploaddir).listFiles();
    			List<String> usedFiles = new ArrayList<String>();
    			
    			String[][] groups = myQuerys.getGroups();
    			for(String[] group : groups){
    				String groupname = group[1];
    				List<Notecontainer> notes = myQuerys.getAllGroupNotes(groupname);
    				for(Notecontainer notecontainer : notes){
    					
    					//Get the uploads which are used in attachments
    					List<Attachment> attachments = notecontainer.getMyAttachments();
    					for(Attachment attachment : attachments){
    						if(attachment.getLink().matches("^\\./upload/.*$")){
    							usedFiles.add(attachment.getLink().replaceFirst("^\\./upload/", ""));
    						}
    					}
    					
    					/**
    					 * Get the uploads which are used in the notes maincontent
    					 */
    					String notemaincontent = notecontainer.getMyNotecontent().getContent();
    					Pattern pV = Pattern.compile("<div[^<>]*?data-videolink=\"\\./upload/([^\"]*?)\"[^<>]*?>"); //filters the filenames of the uploaded videos out of the html content
    					Matcher mV = pV.matcher(notemaincontent);
    					Pattern pI = Pattern.compile("<img[^<>]*?src=\"\\./upload/([^\"]*?)\"[^<>]*?>"); //filters the filenames of the uploaded images out of the html content
    					Matcher mI = pI.matcher(notemaincontent);
    					while(mV.find()){
    						String foundMovie = mV.group(mV.groupCount());
    						usedFiles.add(foundMovie);
    					}
    					while(mI.find()){
    						String foundImage = mI.group(mI.groupCount());
    						usedFiles.add(foundImage);
    					}
    				}
    				
    			}
    			
    			for(File onefile : existingFiles){
    				if(!usedFiles.contains(onefile.getName())){
    					if(onefile.exists()){
    						onefile.delete();
    					}
    				}
    			}
        	}
        };
        
        Timer fc = new Timer();
        long now = System.currentTimeMillis();
        Calendar fcd = Calendar.getInstance();
        fcd.add(Calendar.DAY_OF_MONTH, 1);
        fcd.set(Calendar.HOUR_OF_DAY, 3); // At 3am. No users should be online
        fcd.set(Calendar.MINUTE, 0);
        fcd.set(Calendar.SECOND, 0);
        fcd.set(Calendar.MILLISECOND, 0);
        long firstcleanin = (fcd.getTimeInMillis() - now); 
        long cleanevery = 86400000; //once per day 86400000 do it at night or something. If a user uses the editor and this thing is called his file will be removed.
        
    	fc.scheduleAtFixedRate(fileCleaner, firstcleanin, cleanevery);

    }
	
}
