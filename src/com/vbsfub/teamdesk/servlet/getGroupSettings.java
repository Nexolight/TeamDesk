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

import org.json.JSONException;
import org.json.JSONObject;

import com.vbsfub.teamdesk.db.Querys;

/**
 * Servlet implementation class getGroupSettings
 */
@WebServlet("/getGroupSettings")
public class getGroupSettings extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getGroupSettings() {
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
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		/*
		 * The fallowing two lines can only be used when the user is logged on in a group - Because this servlet is used to load the settings of a group into a
		 * groupadmin window, you have to change them when you want to edit the group settings without login.... Or just ask the user for the group password before
		 * and do the group auth and then the groupadmin auth, 
		 */
		if((String)session.getAttribute("Joined") == "yes" && (String)session.getAttribute("isGroupadmin") == "yes"){
			String groupname = (String) session.getAttribute("groupname");
			try {
				Querys myQuerys = new Querys();
				PrintWriter out = response.getWriter();
				
				JSONObject groupsettings = new JSONObject();
				
				JSONObject settings = myQuerys.getGroupSettings(groupname);
				groupsettings.put("SETTINGS", settings);
				
				JSONObject levels = myQuerys.getGroupLevels(groupname);
				groupsettings.put("LEVELS", levels);
				
				JSONObject colorshemes = myQuerys.getGroupColorshemes(groupname);
				groupsettings.put("COLORSHEMES", colorshemes);
				
				out.write(groupsettings.toString());
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}

}
