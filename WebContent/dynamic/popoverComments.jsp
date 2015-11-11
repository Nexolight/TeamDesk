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
<div id='popover'>
	<script type='text/javascript' src='./lib/popover.js'></script>
	<script type='text/javascript' src='./lib/popoverComments.js'></script>
	<div id='popover_shadow'>
	</div>
	<div id='popover_holder' class='popover_holderXL'>
		<div id='popover_flash'>
		</div>
		<div id='popover_header'>
			<%=lang.td_gen_comments%>
			<div id='popover_cancel'></div>
		</div>
		<div id='popover_content'>
			<div id='popover_comments' data-timetoedit='<%=myQuerys.getMaxCommentEditTime(groupname)%>' data-mynote='<%=request.getParameter("target_dataid")%>'>
				<div id='popoverComments_historyarea'>

				</div>
				<div id='popoverComments_writearea'>
					<button class='default' id='popoverComments_sendcomment'><%=lang.td_gen_set%></button>
					<input type='text' class='default' id='popoverComments_inputauthor'></input>
					<textarea class='default' id='popoverComments_inputtext'></textarea>
				</div>
			</div>
		</div>
	</div>
</div>