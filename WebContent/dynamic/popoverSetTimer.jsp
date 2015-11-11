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
<%@ page import="com.vbsfub.teamdesk.db.Querys"%>
<%! 
	Querys myQuerys;
%>
<%
	myQuerys = new Querys();
%>
<div id='popover'>
	<script type='text/javascript' src='./lib/popover.js'></script>
	<script type='text/javascript' src='./lib/popoverSetTimer.js'></script>
	<div id='popover_shadow'>
	</div>
	<div id='popover_holder'>
		<div id='popover_flash'>
		</div>
		<div id='popover_header'>
			<%=lang.td_settimer_title%>
		</div>
		<div id='popover_content'>
			<div id='popover_SetTimer' data-datenow='<%=myQuerys.getDBDate()%>' data-timenow='<%=myQuerys.getDBTime()%>'>
				<div class='popover_txtrow'><%=lang.td_settimer_instructions %></div>
				<div class='popover_row'>
					<%=lang.td_settimer_instructions_t %>
				</div>
				
				<div class='popover_txtrow'><%=lang.td_settimer_displaydate %></div>
				<div class='popover_row'>
					<input type='text' class='default popover_SetTimer_date' id='popover_SetTimer_Displaydate'></input><%=" " + lang.td_settimer_dateformat + " "%>
					<input type='text' class='default popover_SetTimer_time' id='popover_SetTimer_Displaytime'></input><%=" " + lang.td_settimer_timeformat%>
				</div>
				
				<div class='popover_txtrow'><%=lang.td_settimer_archivedate %></div>
				<div class='popover_row'>
					<input type='text' class='default popover_SetTimer_date' id='popover_SetTimer_Archivedate'></input><%=" " + lang.td_settimer_dateformat + " "%>
					<input type='text' class='default popover_SetTimer_time' id='popover_SetTimer_Archivetime'></input><%=" " + lang.td_settimer_timeformat%>
				</div>
				
			</div>
		</div>
		<div id='popover_buttonholder'>
			<button id='popover_apply' class='default'><%=lang.td_gen_set %></button>
			<button id='popover_cancel' class='default'><%=lang.td_gen_cancel %></button>
		</div>
	</div>
</div>