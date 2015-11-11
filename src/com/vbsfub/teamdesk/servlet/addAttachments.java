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
 * Servlet implementation class addAttachments
 */
@WebServlet("/addAttachments")
public class addAttachments extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public addAttachments() {
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
			int fk_note = Integer.valueOf(request.getParameter("note_id"));
			String attachments = tr.replaceXSS((String) request.getParameter("attachments"));
			String groupname = (String) session.getAttribute("groupname");
			
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
			
			if(!myQuerys.addAttachments(separate_attachments, fk_note, groupname)){
				PrintWriter out = response.getWriter();
				out.write("norowsaffected");
			}
		}
	}

}
