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

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.vbsfub.teamdesk.db.Querys;
import com.vbsfub.teamdesk.security.ThreatRemover;

/**
 * Servlet implementation class updateNotearchivetime
 */
@WebServlet("/updateNotearchivetime")
public class updateNotearchivetime extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public updateNotearchivetime() {
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
			int note_id = Integer.valueOf(request.getParameter("note_id"));
			
			String archivedate = tr.replaceXSS(request.getParameter("archivedate"));
			String archivetime = tr.replaceXSS(request.getParameter("archivetime"));
			String archive_at = null;
			
			if(archivedate != "" && archivetime != ""){
				archive_at = archivedate.split("\\.")[2] + "-" + archivedate.split("\\.")[1] + "-" + archivedate.split("\\.")[0] + " " + archivetime + ":00";
			}
			
			boolean check = myQuerys.updateNotearchivetime(groupname, note_id, archive_at);
			if(check == false){
				PrintWriter out = response.getWriter();
				out.write("norowsaffected");
			}
		}
	}

}
