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
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class broadcastGroupDC
 */
@WebServlet("/broadcastGroupDC")
public class broadcastGroupDC extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public broadcastGroupDC() {
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
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		if((String)session.getAttribute("Joined") == "yes" && (String)session.getAttribute("isGroupadmin") == "yes"){
			String groupname = (String)session.getAttribute("groupname");
			long dcreqtime = 10000; //The time for clients to wait before they reconnect
			Object[] dcrequestdetails = {groupname, dcreqtime};
			
			List<Object[]> dcrequests = (List<Object[]>)this.getServletContext().getAttribute("dcrequests");
			
			if(dcrequests == null){
				dcrequests = new ArrayList<Object[]>();
			}
			
			dcrequests.add(dcrequestdetails);
			
			this.getServletContext().setAttribute("dcrequests", dcrequests);
			
			try {
				Thread.sleep(Math.round(dcreqtime / 4 * 3)); //doesn't really matter but make sure this happens before the dcreqtime expires - because then the client's will start to reconnect
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			
			dcrequests = (List<Object[]>)this.getServletContext().getAttribute("dcrequests");
			if(dcrequests != null){
				dcrequests.remove(dcrequestdetails);
				this.getServletContext().setAttribute("dcrequests", dcrequests);
			}
		}
	}

}
