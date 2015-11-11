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
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.vbsfub.teamdesk.db.Querys;

/**
 * Servlet implementation class removeLevel
 */
@WebServlet("/removeLevel")
public class removeLevel extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public removeLevel() {
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
			int levelid = Integer.valueOf(request.getParameter("levelid"));
			int groupid = Integer.valueOf(request.getParameter("groupid"));
			Querys myQuerys = new Querys();
			if(levelid > 0 && groupid > 0){
				/**
				 * Change the level reference of the notes which actually use this level.
				 */
				List<int[]> levels = myQuerys.getLevelWeights(groupid, groupname); //Get the list with levels
				Collections.sort(levels, new Comparator<int[]>(){ //Sort the list by the level weights.
					public int compare(int[] a, int[] b){
						return a[1] -b[1];
					}
				});
				int newlvlid = 0;
				for(int i = 0;  i < levels.size(); i++){
					if(levels.get(i)[0] == levelid){ //look if the list contains the level
						int newlvltouse;
						boolean lower = false;
						boolean upper = false;
						if(i > 0){
							upper = true;
						}
						if(i < levels.size() - 1){
							lower = true;
						}
						if(lower && upper){
							newlvltouse = i +1; //take the lower one (higher index)
							newlvlid = levels.get(newlvltouse)[0];
						}else if(lower && !upper){
							newlvltouse = i +1; //take the lower one (higher index)
							newlvlid = levels.get(newlvltouse)[0]; 
						}else if(!lower && upper){
							newlvltouse = i -1; //take the upper one (lower index)
							newlvlid = levels.get(newlvltouse)[0];
						}
						
					}
				}
				
				if(newlvlid > 0){ //This isn't 0 when some level references have to be replaced.
					myQuerys.changeLevels(groupname, levelid, newlvlid, groupid);
				}
				
				if(!myQuerys.removeLevel(groupname, levelid, groupid)){
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
