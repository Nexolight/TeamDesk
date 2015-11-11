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
 * Servlet implementation class removeColorsheme
 */
@WebServlet("/removeColorsheme")
public class removeColorsheme extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public removeColorsheme() {
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
			String groupname = (String) session.getAttribute("groupname");
			int csid = Integer.valueOf(request.getParameter("csid"));
			int groupid = Integer.valueOf(request.getParameter("groupid"));
			Querys myQuerys = new Querys();
			if(csid > 0 && groupid > 0){
				myQuerys.resetColorsheme(groupname, csid, groupid);
				if(!myQuerys.removeColorsheme(groupname, csid, groupid)){
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
