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
import java.nio.file.Files;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import com.vbsfub.teamdesk.security.ThreatRemover;

/**
 * An upload service. The Server will place the files automatically
 */
@WebServlet("/uploadfile")
@MultipartConfig
public class uploadfile extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public uploadfile() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		if((String)session.getAttribute("Joined") == "yes"){
			try {
				
				ThreatRemover tr = new ThreatRemover();
				
				//Get the file to save
				Part input_file = request.getPart("bindata");
	
				//Get filename and build Path
				String str_filename = tr.replaceXSS(request.getParameter("filename"));
				String dest_folder = getServletContext().getRealPath("/upload");
				File dir = new File(dest_folder);
				System.out.println(dir.getPath().toString());
				if(!dir.exists()){
					dir.mkdir();
				}
				String input_filepath =  dest_folder + "/" + str_filename;
				
				//Write down the received file
				input_file.write(input_filepath);
				
			}catch(IOException e){
				e.printStackTrace();
			}
		}
	}

}
