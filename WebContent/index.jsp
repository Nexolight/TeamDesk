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
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<%@include file="./dynamic/language.jsp"%>
		<title><%=lang.td_title%></title>
		<link rel="stylesheet" type="text/css" href="./styles/kork.css">
		<link rel="stylesheet" type="text/css" href="./lib/projekktor/themes/maccaco/projekktor.style.css">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="keywords" content="<%=lang.td_keywords%>">
		<meta name="description" content="<%=lang.td_description%>">
		<meta name="author" content="<%=lang.td_author%>">
		<script type="text/javascript" src="./lib/jquery2.1.1.js"></script>
		<script type="text/javascript" src="./lib/lang/langselect.js" charset="UTF-8"></script>
		<script type="text/javascript" src="./lib/general.js"></script>
		<script type="text/javascript" src="./lib/askWindow.js"></script>
		<script type="text/javascript" src="./lib/projekktor/projekktor-1.3.09.js"></script>
	</head>
	<body id="body">
		<div id="header">
			<div id="header_textholder">
				<%=lang.td_header_text%>
			</div>
			<div id="header_logoholder">
			</div>
		</div>
		<div id="content">
			
		</div>
	</body>
</html>