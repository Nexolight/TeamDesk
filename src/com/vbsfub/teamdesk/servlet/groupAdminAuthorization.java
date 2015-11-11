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

/**
 * Servlet implementation class groupAdminAuthorization
 */
@WebServlet("/groupAdminAuthorization")
public class groupAdminAuthorization extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public groupAdminAuthorization() {
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
		String task = (String) request.getParameter("task");
		Querys myQuerys = new Querys();
		PrintWriter out = response.getWriter();
		if(task.equals("check")){
			if((String) session.getAttribute("isGroupadmin") == "yes"){
				out.write("authorized");
			}else{
				out.write("unauthorized");
			}
			
		}
		
		if(task.equals("authorize")){
			String dest_group;
			if(session.getAttribute("groupname") == null){
				dest_group = (String) request.getParameter("dest_group");
			}else{
				dest_group = (String) session.getAttribute("groupname");
			}
			String groupadmin_pw = (String) request.getParameter("groupadmin_pw");
			if(myQuerys.checkAdmin(dest_group, groupadmin_pw)){
				session.setAttribute("isGroupadmin", "yes");
				out.write("authorized");
			}else{
				out.write("unauthorized");
			}
		}
	}

}
