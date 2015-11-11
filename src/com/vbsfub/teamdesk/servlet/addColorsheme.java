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
 * Servlet implementation class addColorsheme
 */
@WebServlet("/addColorsheme")
public class addColorsheme extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public addColorsheme() {
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
		String cs_name = tr.replaceXSS((String) request.getParameter("cs_name"));	
		String cs_font = tr.replaceXSS((String) request.getParameter("cs_font"));	
		String cs_bg = tr.replaceXSS((String) request.getParameter("cs_bg"));	
		String cs_title = tr.replaceXSS((String) request.getParameter("cs_title"));	
		String cs_titlebg = tr.replaceXSS((String) request.getParameter("cs_titlebg"));	
		String cs_link = tr.replaceXSS((String) request.getParameter("cs_link"));	
		String cs_border = tr.replaceXSS((String) request.getParameter("cs_border"));	
		String cs_tblheaderbg = tr.replaceXSS((String) request.getParameter("cs_tblheaderbg"));	
		String cs_tblfont01bg = tr.replaceXSS((String) request.getParameter("cs_tblfont01bg"));	
		String cs_tblfont02bg = tr.replaceXSS((String) request.getParameter("cs_tblfont02bg"));	
		String cs_tblheader = tr.replaceXSS((String) request.getParameter("cs_tblheader"));	
		String cs_tblfont01 = tr.replaceXSS((String) request.getParameter("cs_tblfont01"));	
		String cs_tblfont02 = tr.replaceXSS((String) request.getParameter("cs_tblfont02"));	

		boolean check = myQuerys.addColorsheme(groupid, cs_name, cs_font, cs_bg, cs_title, cs_titlebg, cs_link, cs_border, cs_tblheaderbg, cs_tblfont01bg,
												cs_tblfont02bg, cs_tblheader, cs_tblfont01, cs_tblfont02);
		PrintWriter out = response.getWriter();
		if(!check){
			out.write("norowsaffected");
		}
	}

}
