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
import java.util.ArrayList;
import java.util.Date;
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
 * Servlet implementation class initializeNotes_tmp
 */
@WebServlet("/initializeNotes")
public class initializeNotes extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	List<HttpSession> allsessions = new ArrayList<HttpSession>();
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public initializeNotes() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		response.setContentType("text/event-stream");
		response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		if((String)session.getAttribute("Joined") == "yes"){
			Querys myQuerys = new Querys();
			String groupname =(String) session.getAttribute("groupname");
			int timerange_cts = 40000; //ms to wait for a keep alive message (client to server)
			int timerange_stc = 30000; //ms intervall to send a hello message to the client
			long lasthello = new Date().getTime();
			long now = new Date().getTime();
			PrintWriter out = response.getWriter();
			boolean feedClient = true;
			boolean reload = false;
			boolean kick = false;
			long sessionupdatetimeout = 0;
			
			List<Notecontainer> oldNotes = null;
			List<Notecontainer> newNotes = myQuerys.getVisibleGroupNotes(groupname);
			
			JSONObject clientCommands = new JSONObject();
			ClientsFriend processor = new ClientsFriend(); //This instance is used to compare and get the client commands
			
			//"now" is the current time minus some seconds. If the last keep alive timestamp is older it will break the loop.
			//This will send every change to the note change to the client.
			try{
				while(now - ((Long) session.getAttribute("client_alive")) < timerange_cts){
					
					/**
					 * This part is listening for a disconnect broadcast. This is vergy ugly but the Servlet API doesn't provide any way to share
					 * a broadcast. If one client sends a disconnect broadcast the broadcastGroupDC Servlet is called.
					 * It will add a groupname and a timeout in form of a object[(String)groupname,(long)timeout] into a List
					 * which is available inside the servlet context as 'dcrequests'. The other servlet will remove This entry
					 * 1000 ms before the timeout expires. If the groupname on which this servlet is running on is inside this list
					 * it will send a reconnectdelay_[delay] to the client which will close the connection, wait, then reload the settings 
					 * and finally reconnect to this stream.
					 * In this case the stream loop will break immediately and the session variable 'groupname' will be updated
					 * before the client starts to reload.
					 */
					@SuppressWarnings("unchecked")
					List<Object[]> dcrequests = (List<Object[]>)this.getServletContext().getAttribute("dcrequests");
					if(dcrequests != null && dcrequests.size() > 0){
						for(Object[] dcrequestdetails : dcrequests){
							if(groupname.equals((String) dcrequestdetails[0]) && feedClient == true){
								out.write("data:reconnectdelay_"+(long)dcrequestdetails[1]+"\n\n");
								out.flush();
								out.close();
								feedClient = false;
								reload = true;
							}
						}
					}
					
					/**
					 * This acts like the above part. But this part is used to listen if a group has been deleted. The client's will simply disconnect.
					 */
					@SuppressWarnings("unchecked")
					List<String> kickrequests = (List<String>)this.getServletContext().getAttribute("kickrequests");
					if(kickrequests != null && kickrequests.size() > 0){
						for(String kickgroup : kickrequests){
							if(kickgroup.equals(groupname)){
								out.write("data:groupdeleted\n\n");
								out.flush();
								out.close();
								feedClient = false;
								kick = true;
							}
						}
					}
					
					/**
					 * Just break the loop - look at the above code then you know why
					 */
					if(feedClient == false){
						break;
					}
					
					/**
					 * Send a hello packet to the server. Some Browsers need this to keep the connection.
					 */
					if(lasthello < now - timerange_stc){
						lasthello = now;
						out.write("data:hello\n\n");
						out.flush();
					}
					
					/**
					 * Dump the notes of a group and compare them to get and send commands to the client.
					 */
					newNotes = myQuerys.getVisibleGroupNotes(groupname);
					clientCommands = processor.getClientCommands(oldNotes, newNotes);
					if(processor.updateRequired() == true){
						oldNotes = newNotes;
						//System.out.println(clientCommands);
						out.write("data:" + clientCommands.toString() + "\n\n");
						out.flush();
					}
					try {
						Thread.sleep(500); //Time between updates Not to high, not to low
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
					now =  new Date().getTime(); //Do this before the next loop starts
				}
				
				/**
				 * The loop wad breaked by a disconnect broadcast - which can be caused by a group settings change
				 * The session variable 'groupname' is used in almost all servlets so you have to update it.
				 * Sadly this can't be done in the Servlets which are responsible for the changes because they
				 * can't access all sessions and their attributes.
				 */
				if(feedClient == false){
					if(reload){
						try {
							Thread.sleep(Math.round(sessionupdatetimeout / 4 * 3));
							int groupid = (int) session.getAttribute("groupid");
							groupname = myQuerys.getGroupnameByID(groupid);
							session.setAttribute("groupname", groupname);
						} catch (InterruptedException e) {
							e.printStackTrace();
						}
					}
					if(kick){
						session.invalidate();
					}
				}
				
			} catch (IllegalStateException e){
				//It's ok the session was just invalidated
			}
		}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}
}
