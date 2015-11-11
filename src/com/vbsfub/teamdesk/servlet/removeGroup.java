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

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.vbsfub.teamdesk.db.Querys;

/**
 * Servlet implementation class removeGroup
 */
@WebServlet("/removeGroup")
public class removeGroup extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public removeGroup() {
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
			int groupid = (int)session.getAttribute("groupid");
			long ttl = 10000;
			
			List<String> kickrequests = (List<String>)this.getServletContext().getAttribute("kickrequests");
			
			if(kickrequests == null){
				kickrequests = new ArrayList<String>();
			}
			
			kickrequests.add(groupname);
			
			this.getServletContext().setAttribute("kickrequests", kickrequests);
			
			try {
				Thread.sleep(ttl);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			
			Querys myQuerys = new Querys();
			String uploaddir = getServletContext().getRealPath("/upload") + "/";
			List<String> attachments =  myQuerys.getHostedGroupAttachments(groupname, uploaddir);
			for(String filename : attachments){
				File todelete = new File(uploaddir + filename);
				if(todelete.exists()){
					todelete.delete();
				}
			}
			myQuerys.removeGroup(groupname, groupid);

			kickrequests = (List<String>)this.getServletContext().getAttribute("kickrequests");
			if(kickrequests != null){
				kickrequests.remove(groupname);
				this.getServletContext().setAttribute("kickrequests", kickrequests);
			}
		}
	}

}
