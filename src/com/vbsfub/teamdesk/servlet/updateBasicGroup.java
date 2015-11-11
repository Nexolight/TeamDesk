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
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.vbsfub.teamdesk.db.Querys;
import com.vbsfub.teamdesk.db.Tools;
import com.vbsfub.teamdesk.notes.Notecontainer;
import com.vbsfub.teamdesk.security.ThreatRemover;

/**
 * Servlet implementation class updateBasicGroup
 */
@WebServlet("/updateBasicGroup")
public class updateBasicGroup extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public updateBasicGroup() {
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
		PrintWriter out = response.getWriter();
		if((String)session.getAttribute("Joined") == "yes" && (String)session.getAttribute("isGroupadmin") == "yes"){
			Querys myQuerys = new Querys();
			ThreatRemover tr = new ThreatRemover();
			String old_group_name = (String) session.getAttribute("groupname");
			int groupid = Integer.valueOf(request.getParameter("groupid"));
			String new_group_name = tr.replaceXSS((String) request.getParameter("group_name"));
			String group_pw = (String) request.getParameter("group_pw");
			String group_adminpw = (String) request.getParameter("group_adminpw");
			String group_desc = tr.replaceXSS((String) request.getParameter("group_desc"));
			int group_fieldresX = Integer.valueOf(request.getParameter("group_fieldresX"));
			int group_fieldresY = Integer.valueOf(request.getParameter("group_fieldresY"));
			String group_fieldres = group_fieldresX + "x" + group_fieldresY;
			int note_maxSizeX = Integer.valueOf(request.getParameter("note_maxSizeX"));
			int note_maxSizeY = Integer.valueOf(request.getParameter("note_maxSizeY"));
			String note_maxSize = note_maxSizeX + "x" + note_maxSizeY;
			int note_minSizeX = Integer.valueOf(request.getParameter("note_minSizeX"));
			int note_minSizeY = Integer.valueOf(request.getParameter("note_minSizeY"));
			String note_minSize = note_minSizeX + "x" + note_minSizeY;
			int note_defaultSizeX = Integer.valueOf(request.getParameter("note_defaultSizeX"));
			int note_defaultSizeY = Integer.valueOf(request.getParameter("note_defaultSizeY"));
			String note_defaultSize = note_defaultSizeX + "x" + note_defaultSizeY;
			long comment_maxeditT = Long.valueOf(request.getParameter("comment_maxeditT"));
			
			/**
			 * 
			 * Maybe you should add a server side examination of the values atm. it's js
			 * 
			 */
			
			if(!old_group_name.equals(new_group_name)){
				session.setAttribute("groupname", new_group_name);
			}
			
			if(groupid > 0){
				if(myQuerys.updateBasicGroup(groupid, old_group_name, new_group_name, group_pw, group_adminpw, group_desc, group_fieldres, note_maxSize, note_minSize, note_defaultSize, comment_maxeditT)){
					/**
					 * Get all notes and change their props when they are out of range 
					 */
					List<Notecontainer> myNotes = myQuerys.getAllGroupNotes(new_group_name);
					Tools myTools = new Tools();
					for(Notecontainer oneNote : myNotes){
						int noteid = oneNote.getMyNotecontent().getID();
						int[] notesize = myTools.xResToInt(oneNote.getMyNotecontent().getSize());
						int notesizeX = notesize[0];
						int notesizeY = notesize[1];
						int notesizeX_final = notesizeX;
						int notesizeY_final = notesizeY;
						int noteposX = oneNote.getMyNotecontent().getPos_x();
						int noteposX_final = noteposX;
						int noteposY = oneNote.getMyNotecontent().getPos_y();
						int noteposY_final = noteposY;
						
						if(notesizeX > note_maxSizeX){
							notesizeX_final = note_maxSizeX;
							int[] newsize = {notesizeX_final, notesizeY_final};
							myQuerys.updateNotesize(new_group_name, noteid, myTools.intToXRes(newsize));
						}
						
						if(notesizeX < note_minSizeX){
							notesizeX_final = note_minSizeX;
							int[] newsize = {notesizeX_final, notesizeY_final};
							myQuerys.updateNotesize(new_group_name, noteid, myTools.intToXRes(newsize));
						}
						
						if(notesizeY > note_maxSizeY){
							notesizeY_final = note_maxSizeY;
							int[] newsize = {notesizeX_final, notesizeY_final};
							myQuerys.updateNotesize(new_group_name, noteid, myTools.intToXRes(newsize));
						}
						
						if(notesizeY < note_minSizeY){
							notesizeY_final = note_minSizeY;
							int[] newsize = {notesizeX_final, notesizeY_final};
							myQuerys.updateNotesize(new_group_name, noteid, myTools.intToXRes(newsize));
						}
						
						if(noteposX > (group_fieldresX - notesizeX_final) || noteposY > (group_fieldresY - notesizeY_final)){
							int randX = (int) (Math.random() * ((group_fieldresX - notesizeX_final) - 0)) + 0;
							int randY = (int) (Math.random() * ((group_fieldresX - notesizeX_final) - 0)) + 0;
							noteposX_final = randX;
							noteposY_final = randY;
							myQuerys.updateNoteposition(new_group_name, noteid, noteposX_final, noteposY_final);
						}
					}
					out.write("ok");
				}else{
					out.write("norowsaffected");
				}
			}else{
				out.write("norowsaffected"); 
			}
		}else{
			out.write("norowsaffected");
		}
	}

}
