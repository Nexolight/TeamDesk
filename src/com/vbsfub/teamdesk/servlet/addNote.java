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
package com.vbsfub.teamdesk.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.vbsfub.teamdesk.db.Querys;
import com.vbsfub.teamdesk.security.ThreatRemover;

/**
 * Servlet implementation class addNote
 */
@WebServlet("/addNote")
public class addNote extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public addNote() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		if((String)session.getAttribute("Joined") == "yes"){
			Querys myQuerys = new Querys();
			ThreatRemover tr = new ThreatRemover();
			String groupname = (String) session.getAttribute("groupname");
			int priority_id = Integer.valueOf(request.getParameter("priority_id"));
			int colorsheme = Integer.valueOf(request.getParameter("colorsheme"));
			int posX = Integer.valueOf(request.getParameter("posX"));
			int posY = Integer.valueOf(request.getParameter("posY"));
			String size = tr.replaceXSS(request.getParameter("size"));
			String title = tr.replaceXSS(request.getParameter("title"));
			String maincontent = tr.replaceXSS(request.getParameter("maincontent"));
			String attachments = tr.replaceXSS(request.getParameter("attachments"));
			String displaydate = tr.replaceXSS(request.getParameter("displaydate"));
			String displaytime = tr.replaceXSS(request.getParameter("displaytime"));
			String archivedate = tr.replaceXSS(request.getParameter("archivedate"));
			String archivetime = tr.replaceXSS(request.getParameter("archivetime"));
			String user_ip = request.getRemoteAddr();
			
			String display_at = null;
			String archive_at = null;
			
			if(displaydate != "" && displaytime != ""){ //client should never send null
				display_at = displaydate.split("\\.")[2] + "-" + displaydate.split("\\.")[1] + "-" + displaydate.split("\\.")[0] + " " + displaytime + ":00";
			}
			
			if(archivedate != "" && archivetime != ""){
				archive_at = archivedate.split("\\.")[2] + "-" + archivedate.split("\\.")[1] + "-" + archivedate.split("\\.")[0] + " " + archivetime + ":00";
			}
			
			String[][] separate_attachments = null;
			if(attachments != ""){
				String[] multi_attachments = attachments.split("\\$");
				separate_attachments = new String[multi_attachments.length][3];
				
				for(int i = 0; i < multi_attachments.length; i++){
					String[] sub_attachment = multi_attachments[i].split("~");
					separate_attachments[i][0] = sub_attachment[0]; //Link
					separate_attachments[i][1] = sub_attachment[1] + "~" + sub_attachment[2] + "~" + sub_attachment[3] + "~" + sub_attachment[4];// Name, Type, Host, Size
					separate_attachments[i][2] = sub_attachment[5] + "~" + sub_attachment[6] ; //Uploader, Time
				}
			}
			
			myQuerys.saveNewNote(title, maincontent, display_at, archive_at, posX, posY, priority_id, size, groupname, colorsheme, separate_attachments, user_ip);
		}
	}
}
