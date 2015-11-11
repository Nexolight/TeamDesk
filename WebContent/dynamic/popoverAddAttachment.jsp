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
	<script type='text/javascript' src='./lib/popoverAddAttachment.js'></script>
	<div id='popover_shadow'>
	</div>
	<div id='popover_holder'>
		<div id='popover_flash'>
		</div>
		<div id='popover_header'>
			<%=lang.td_add_attachment_head%>
		</div>
		<div id='popover_content'>
			<div id='popover_AddAttachment'>
				
				<div class='popover_txtrow'><%=lang.td_addatt_instructions %></div>
				<div class='popover_row'>
					<%=lang.td_addatt_instructions_t %>
				</div>
				
				<div class='popover_txtrow'><%=lang.td_addatt_url %></div>
				<input type='text' id='popover_AddAtt_path' class='default'></input>
				
				<div class='popover_txtrow'><%=lang.td_gen_upload + " " + lang.td_file_bs %></div>
				<div class='popover_row'>
					<input type='text' class='default' id='popover_file' disabled>
					<button id='popover_browse' class='default'><%=lang.td_gen_browse %></button>
					<input style='display:none' type='file' id='popover_fileorigin'></input>
				</div>
				
				<div class='popover_txtrow'><%=lang.td_addatt_name %></div>
				<input type='text' id='popover_AddAtt_name' class='default'></input>
				
			</div>
		</div>
		<div id='popover_buttonholder'>
			<button id='popover_apply' class='default'><%=lang.td_gen_add %></button>
			<button id='popover_cancel' class='default'><%=lang.td_gen_cancel %></button>
		</div>
	</div>
</div>