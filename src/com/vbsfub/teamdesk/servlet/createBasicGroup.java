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

import com.vbsfub.teamdesk.db.Querys;
import com.vbsfub.teamdesk.security.ThreatRemover;

/**
 * Servlet implementation class createBasicGroup
 */
@WebServlet("/createBasicGroup")
public class createBasicGroup extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public createBasicGroup() {
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
		Querys myQuerys = new Querys();
		ThreatRemover tr = new ThreatRemover();
		String group_name = tr.replaceXSS((String) request.getParameter("group_name"));
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
		
		int newid = myQuerys.createBasicGroup(group_name, group_pw, group_adminpw, group_desc, group_fieldres, note_maxSize, note_minSize, note_defaultSize, comment_maxeditT);
		PrintWriter out = response.getWriter();
		if(newid > 0){
			out.write(String.valueOf(newid));
		}else{
			out.write("norowsaffected");
		}
	}

}
