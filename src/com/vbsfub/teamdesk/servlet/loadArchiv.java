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
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import com.vbsfub.teamdesk.db.Querys;
import com.vbsfub.teamdesk.notes.ClientsFriend;
import com.vbsfub.teamdesk.notes.Notecontainer;

/**
 * Servlet implementation class loadArchiv
 */
@WebServlet("/loadArchiv")
public class loadArchiv extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public loadArchiv() {
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
		response.setContentType("text/event-stream");
		response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		
		if((String)session.getAttribute("Joined") == "yes"){
			Querys myQuerys = new Querys();
			String groupname = (String) session.getAttribute("groupname");
			ClientsFriend proccessor = new ClientsFriend(); //This instance is used to gain a client friendly format from the Notecontainer List
			List<Notecontainer> archivedNotes = myQuerys.getInvisibleGroupNotes(groupname);

			/**
			 * The getClientCommands(old, new) is basically made for comparison and updates
			 * It's a huge function and I'm just to lazy to write a new one for the archive, since
			 * the arguments "null" and "Notecontainer list" causes a return value with commands to add everything 
			 * (because it was compared to null). If you feed this function with another choice of Notecontainers
			 * As done in initializeNotes it shouldn't be a problem.
			 * 
			 * The client side archiv window don't have to be dynamic, so just listen to the ADD commands.
			 * However you can also implement it like in initalizeNotes. If you do so then pls remember that this 
			 * function isn't made for a dynamic archive. 
			 * 
			 * It could theoretically work but I assure nothing.
			 */
			JSONObject clientCommands = proccessor.getClientCommands(null, archivedNotes);
			
			PrintWriter out = response.getWriter();
			out.write(clientCommands.toString());
		}
	}
}
