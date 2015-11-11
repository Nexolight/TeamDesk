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

<div id='logonholder'>
	<div id='logonholder_header'>
		<%=lang.td_logon_title%>
	</div>
	<script type='text/javascript' src="./lib/logon_groupchooser.js"></script>
	<div id='logonholder_content'>
		<%=lang.td_logon_instruction%>
		<div id='logonholder_content_form'>
			<select id='logonholder_content_select' class='default'>
				<%
					Querys myQuerys = new Querys();
					String[][] tmp = myQuerys.getGroups();
					for(int i = 0; i < tmp.length; i++){
						out.write("<option>" + tmp[i][1] + "</option>");
					}
				%>
			</select>
			<textarea disabled id='logonholder_content_textarea' class='default'></textarea>
			
			<div id='logonholder_content_passwordholder'>
					<span class='inputspan'><%=lang.td_logon_password%></span>
					<input type='password' id='logonholder_content_password' class='default'></input>
			</div>
			<div id='logonholder_content_buttonholder'>
				<button id='logonholder_content_newgroup' class='default'><%=lang.td_logon_btn_newgroup%></button>
				<button id='logonholder_content_proceeed' class='default'><%=lang.td_logon_nextbtn%></button>
				<div class='clearfix'></div>
			</div>
		</div>
		
	</div>
</div> 