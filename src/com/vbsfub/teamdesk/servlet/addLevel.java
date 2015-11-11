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
 * Servlet implementation class addLevel
 */
@WebServlet("/addLevel")
public class addLevel extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public addLevel() {
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
		int groupid = Integer.valueOf(request.getParameter("groupid"));	
		int level_weight = Integer.valueOf(request.getParameter("level_weight"));	
		String level_font = tr.replaceXSS((String) request.getParameter("level_font"));	
		String level_bg = tr.replaceXSS((String) request.getParameter("level_bg"));
		int level_blink = Integer.valueOf(request.getParameter("level_blink"));
		String level_desc = tr.replaceXSS((String) request.getParameter("level_desc"));
		boolean check = myQuerys.addLevel(groupid, level_weight, level_font, level_bg, level_blink, level_desc);
		PrintWriter out = response.getWriter();
		if(!check){
			out.write("norowsaffected");
		}
	}

}
