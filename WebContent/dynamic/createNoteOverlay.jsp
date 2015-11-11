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
<%@ page import=" java.util.ArrayList"%>
<%@ include file="./language.jsp"%>
<%! int[] noteSizes = new int[6]; %>
<%! String mode; %>
<%! String id; %>
<%! Querys myQuerys; %>
<%
	myQuerys = new Querys();
	noteSizes = myQuerys.getNoteSizes((String)session.getAttribute("groupname"));
	mode = request.getParameter("mode");
	id = request.getParameter("id");
%>
<div id='createNoteOverlay' data-displaydate='<%=myQuerys.getDBDate()%>' data-displaytime='<%=myQuerys.getDBTime()%>' data-archivedate='' data-archivetime='' style='min-width:<%=noteSizes[0]%>px; min-height:<%=noteSizes[1]%>px; width:<%=noteSizes[2]%>px; height:<%=noteSizes[3]%>px; max-width:<%=noteSizes[4]%>px; max-height: <%=noteSizes[5]%>px' data-mode='<%=mode%>' data-edittarget='<%=id%>'>
	<script type='text/javascript' src='./lib/rangy-core.js'></script>
	<script type='text/javascript' src='./lib/rangy-selectionsaverestore.js'></script>
	<script type='text/javascript' src='./lib/createNote.js'></script>
	<div id='createNoteOverlay_flashlayer'></div>
	<div id='createNoteOverlay_flashcolor'></div>
	<div id='createNoteOverlay_prioholder'>
		<div id='createNoteOverlay_prioholder_text'>
			<%=lang.td_n_priority %>
			<select id='createNoteOverlay_prioselect' class='default'>
				<%
					List<String[]> myLevels = myQuerys.getLevels((String)session.getAttribute("groupname"));
					int rowNr = 0;
					for(String[] row: myLevels){
						rowNr++;
						if(rowNr == myLevels.size()){
							out.write("<option selected data-id='" + row[0] + "' data-description='" + row[2] + "' data-fontcolor='" + row[3] + "' data-bgcolor='" + row[4] + "'>" + row[1] + "</option>");
						}else{
							out.write("<option data-id='" + row[0] + "' data-description='" + row[2] + "' data-fontcolor='" + row[3] + "' data-bgcolor='" + row[4] + "'>" + row[1] + "</option>");
						}
					}
				%>
			</select>
		</div>
	</div>
	<div id='createNoteOverlay_maincontent'>
		<div class='note_attachmentholder' id='createNoteOverlay_attachmentholder'>
			<div class='note_attachmentpiece_actionholder note_attachmentpiece_singel'>
				<div id='note_attachmentpiece_add'></div>
			</div>
			<div class='note_attachmentpiece note_attachmentpiece_sub' style='display:none;'>
				<div class='note_attachmentpiece_media'><div class='note_attachmentnumber'></div></div>
			</div>
			<div class='note_attachmentpiece note_attachmentpiece_sub' style='display:none;'>
				<div class='note_attachmentpiece_image'><div class='note_attachmentnumber'></div></div>
			</div>
			<div class='note_attachmentpiece note_attachmentpiece_sub' style='display:none;'>
				<div class='note_attachmentpiece_doc'><div class='note_attachmentnumber'></div></div>
			</div>
			<div class='note_attachmentpiece note_attachmentpiece_end' style='display:none;'>
				<div class='note_attachmentpiece_archiv'><div class='note_attachmentnumber'></div></div>
			</div>
		</div>
		<div id='createNoteOverlay_editoptions_holder'>
				<div id='edit_icon_bold' class='option_icon_small'></div>
				<div id='edit_icon_italic' class='option_icon_small'></div>
				<div id='edit_icon_underlined' class='option_icon_small'></div>
				<div id='edit_icon_image' class='option_icon_small'></div>
				<div id='edit_icon_video' class='option_icon_small'></div>
				<div id='edit_icon_table' class='option_icon_small'></div>
				<div id='edit_icon_timer' class='option_icon_small'></div>
			</div>
		<div id='createNoteOverlay_customcontent'>
			<div id='createNoteOverlay_header'>
				<input type='text' class='default' id='createNoteOverlay_title' tabindex='0'></input>
				<div id='createNoteOverlay_apply'></div>
				<div id='createNoteOverlay_close'></div>
			</div>
			<div id='createNoteOverlay_notecontent' tabindex='1' contentEditable='true' spellcheck='false'></div>
			
			<div id='createNoteOverlay_att_image' class='attachment_tab' contentEditable='false' spellcheck='false'></div>
			<div id='createNoteOverlay_att_doc' class='attachment_tab' contentEditable='false' spellcheck='false'></div>
			<div id='createNoteOverlay_att_archiv' class='attachment_tab' contentEditable='false' spellcheck='false'></div>
			<div id='createNoteOverlay_att_media' class='attachment_tab' contentEditable='false' spellcheck='false'></div>
			
		</div>
		<div id='createNoteOverlay_notefooter'>
			<select id='createNoteOverlay_colors' class='default'>
				<%
					ArrayList<String[]> myPalletes = myQuerys.getSelectableColorpalettes((String)session.getAttribute("groupname"));
					out.write("<option data-id='0' selected>"+lang.td_notecolors_default+"</option>");
					for(String row[] : myPalletes){
						out.write("<option data-id='"+row[0]+"'>" + row[1] + "</option>");
					}
				%>
			</select>
			<div id='createNoteOverlay_resize'></div>
		</div>
	</div>
	
</div>