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
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="com.vbsfub.teamdesk.lang.Language"%>
<%@ page import="com.vbsfub.teamdesk.lang.German"%>
<%@ page import="com.vbsfub.teamdesk.lang.English"%>
<%! 
	Language lang;
%>
<%
	String myLocation = request.getLocale().getLanguage();
	List<String> supportedLanguages = new ArrayList<String>();
	supportedLanguages.add("de");
	supportedLanguages.add("ch");
	supportedLanguages.add("en");
	if(supportedLanguages.contains(myLocation)){
		if(myLocation == "de" || myLocation == "ch"){
			lang = new German();
		}
		
		if(myLocation == "en"){
			lang = new English();
		}
		
	}else{
		lang = new English();
	}
%>