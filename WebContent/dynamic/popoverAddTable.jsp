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
	<script type='text/javascript' src='./lib/popoverAddTable.js'></script>
	<div id='popover_shadow'>
	</div>
	<div id='popover_holder'>
		<div id='popover_flash'>
		</div>
		<div id='popover_header'>
			<%=lang.td_add_table_head%>
		</div>
		<div id='popover_content'>
			<div id='popover_AddTable'>
			
				<div class='popover_txtrow'><%=lang.td_addtable_instructions %></div>
				<div class='popover_row'>
					<%=lang.td_addtable_instructions_t %>
				</div>
				
				<div class='popover_txtrow'><%=lang.td_addtable_formatting %></div>
				<div class='popover_row'>
					<input type='checkbox' checked id='popover_AddTable_HeaderTop'><%= lang.td_addtable_headertop %><br>
					<input type='checkbox' checked id='popover_AddTable_HeaderLeft'><%= lang.td_addtable_headerleft %><br>
					<input type='checkbox' checked id='popover_AddTable_Zebra'><%= lang.td_addtable_zebra %><br>
				</div>
				
				<div class='popover_txtrow'><%=lang.td_addtable_columns %></div>
				<div class='popover_row'>
					<input type='text' class='default' id='popover_AddTable_Cols'></input><%=" " + lang.td_addtable_count %>
					<input type='text' class='default' id='popover_AddTable_ColumnX'></input><%=" " + lang.td_addtable_width + " " %><span id='popover_AddTable_ColumnX_Recommendation'></span>
				</div>
				
				<div class='popover_txtrow'><%=lang.td_addtable_rows %></div>
				<div class='popover_row'>
					<input type='text' class='default' id='popover_AddTable_Rows'></input><%=" " + lang.td_addtable_count %>
					<input type='text' class='default' id='popover_AddTable_RowY'></input><%=" " + lang.td_addtable_height + " " %><span id='popover_AddTable_RowY_Recommendation'></span>
				</div>
				
				<div class='popover_txtrow'><%=lang.td_addtable_size %></div>
				<div class='popover_row'>
					<input type='text' class='default' id='popover_AddTable_sizeX'></input><%=" " + lang.td_gen_x + " " %>
					<input type='text' class='default' id='popover_AddTable_sizeY'></input><%=" " + lang.td_gen_pica + " "%><span id='popover_AddTable_Table_Recommendation'></span>
				</div>
				
			</div>
		</div>
		<div id='popover_buttonholder'>
			<button id='popover_apply' class='default'><%=lang.td_gen_add %></button>
			<button id='popover_cancel' class='default'><%=lang.td_gen_cancel %></button>
		</div>
	</div>
</div>