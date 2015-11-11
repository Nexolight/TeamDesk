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
<div id='popover'>
	<script type='text/javascript' src='./lib/popover.js'></script>
	<script type='text/javascript' src='./lib/popoverArchiv.js'></script>
	<div id='popover_shadow'>
	</div>
	<div id='popover_holder' class='popover_holderXL'>
		<div id='popover_flash'>
		</div>
		<div id='popover_header'>
			<%=lang.td_archiv_header%>
			<div id='popover_cancel'></div>
		</div>
		<div id='popover_content'>
			<div id='popover_archiv'>
				<div class='popover_txtrow'><%=lang.td_archiv_instructions %></div>
				<div class='popover_row'>
					<%=lang.td_archiv_instructions_t %>
				</div>
				
			</div>
		</div>
	</div>
</div>