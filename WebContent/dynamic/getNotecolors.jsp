<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%
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
%>
<%@ page import="com.vbsfub.teamdesk.db.Querys"%>
<%
	Querys myQuerys = new Querys();
	String[] myColors = myQuerys.getColorpalette((String)session.getAttribute("groupname"), Integer.valueOf(request.getParameter("colorscheme_id")));
	if(myColors != null){
		for(int i = 0; i < myColors.length; i++){
			if(i == myColors.length - 1){
				out.write(myColors[i]);
			}else{
				out.write(myColors[i] + ";");
			}
		}
	}else{
		out.write("nodata");
	}
%>