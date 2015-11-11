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
<%@ include file="./language.jsp"%>
<%! 
	Querys myQuerys;
	String groupname;
%>

<% 
	myQuerys = new Querys();
	groupname = (String)session.getAttribute("groupname");
%>
<script type="text/javascript" src="./lib/autoscroll.js"></script>
<script type="text/javascript" src="./lib/minimap.js"></script>
<script type="text/javascript" src="./lib/actionbar.js"></script>
<script type="text/javascript" src="./lib/infobar.js"></script>
<script type="text/javascript" src="./lib/eventsource.js"></script>
<script type="text/javascript" src="./lib/surface.js"></script>

<div id="surfaceholder">
	<div id="infobar"></div>
	<div id="mmHolder">
		<div id="mmViewport"></div>
	</div>
	<div id="optionHolder">
		<div id="optionHolder_options">
			<div id="option_icon_write" class="option_icon"></div>
			<div id="option_icon_archiv" class="option_icon"></div>
			<div id="option_icon_settings" class="option_icon"></div>
			<div id="option_icon_info" class="option_icon"></div>
			<div id="option_icon_logout" class="option_icon"></div>
		</div>
		<div id="optionHolder_slider">
			<span id="optionHolder_slidertext"><%=lang.td_actionslide%></span>
		</div>
	</div>
	<div id="surface" style="width:<%= myQuerys.getProfRes(groupname)[0]%>px; height:<%= myQuerys.getProfRes(groupname)[1]%>px;">
		
	</div>
</div>
