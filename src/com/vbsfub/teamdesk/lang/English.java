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
package com.vbsfub.teamdesk.lang;

public class English extends Language{
	public English(){
		
		super.td_title					= "Teamdesk";
		super.td_keywords				= "Digital, Pinnwall, Teamdesk, Tasks, Group";
		super.td_description			= "Teamdesk is a digital pinnwal which should basically help oservice desks or task groups to do their work";
		super.td_author					= "Lucy von Känel on behalf of the Swiss defence departement VBS FUB";
		super.td_header_text			= "VBS FUB - TeamDesk v0.93 Pre-Beta";
		super.td_error_security			= "Security problem";
		super.td_errorinf_groupauth		= "Something went wrong during the authentication to the choosen group";
		super.td_button_back			= "Back";
		super.td_logon_title			= "Please choose a group";
		super.td_logon_instruction		= "Teamdesk offers multiple groups. Please choose the one you want to join. Maybe a password is needed.";
		super.td_logon_nextbtn			= "Join";
		super.td_logon_password			= "Password:";
		super.td_actionslide			= "Actions";
		super.td_n_priority				= "Priority";
		super.td_add_image_head			= "Add image";
		super.td_addimg_instructions	= "Info";
		super.td_addimg_instructions_t	= "You can add an external image by paste the URL into the correct input field.<br><br>You can also upload one as long as it has the correct format.<br><br>The scale is optional (default is the full width of the note).";
		super.td_gen_link				= "Link";
		super.td_gen_upload				= "Upload";
		super.td_addimg_scale			= "Scale image (optional)";
		super.td_gen_add				= "Add";
		super.td_gen_set				= "Set";
		super.td_gen_cancel				= "Discard";
		super.td_gen_browse				= "Browse";
		super.td_gen_pica				= "Pixel";
		super.td_gen_x					= "x";
		super.td_img_bs					= "(png, jpg, gif, tiff, bmp)";
		super.td_add_movie_head			= "Add video";
		super.td_addmovie_instructions	= "Info";
		super.td_addmovie_instructions_t= "You can embled a Video with Autograb by pasting the whole URL from a (hopefully) compatible video platform like youtube into the input field.<br><br>You can also upload a Video as long as you've converted it into a compatible format.<br><br>The scale is optional (default is the full width of the note).";
		super.td_addmovie_url			= "Video URL (Autograb)";
		super.td_addmovie_scale			= "Scale video";
		super.td_mov_bs					= "(flv, mp4, webm, ogg, ogv)";
		super.td_add_table_head			= "Add table";
		super.td_addtable_columns		= "Columns";
		super.td_addtable_width			= "Width (pixel)";
		super.td_addtable_height		= "Heigh (pixel)";
		super.td_addtable_count			= "Count";
		super.td_addtable_rows			= "Rows";
		super.td_addtable_size			= "Absolute size";
		super.td_addtable_instructions	= "Info";
		super.td_addtable_instructions_t= "You have to set the column and row count.<br>Furthermore you have to set the absolute size or the width and height of the columns and rows.";
		super.td_addtable_formatting	= "Formatting";
		super.td_addtable_headerleft	= "Header left";
		super.td_addtable_headertop		= "Header top";
		super.td_addtable_zebra			= "Delimit colors";
		super.td_add_attachment_head	= "Add Attachment";
		super.td_addatt_instructions	= "Info";
		super.td_addatt_instructions_t 	= "Here you can attach a file. Add the whole URL for an external ressource or just upload a File.<br>If possible you should enter a name for the file.";
		super.td_addatt_url				= "File URL";
		super.td_file_bs				= "(all filetypes)";
		super.td_addatt_name			= "Filename";
		super.td_notecolors_default		= "Template color scheme";
		super.td_settimer_title			= "Set timer";
		super.td_settimer_instructions	= "Info";
		super.td_settimer_instructions_t = "Set the display and/or the archiving date. The displaying date it's default value the moment when you save the note. At this date the note will be visible for everyone.<br><br>The archiving date doesn't exist by default. If a note will not be needet any more at the specific date you can set the archiving time. The note will be archived automatically at this moment.";
		super.td_settimer_displaydate	= "Display date";
		super.td_settimer_archivedate	= "Archiving date";
		super.td_settimer_dateformat	= "<i>tt.mm.yyyy</i>";
		super.td_settimer_timeformat	= "<i>hh:mm (24h)</i>";
		super.td_gen_comments			= "Comments";
		super.td_info_head				= "About Teamdesk";
		super.td_info_td				= "<b>Teamdesk</b>";
		super.td_info_td_version		= "<b>Version 0.93 'woody desk' - Pre-Beta</b><br>"
										+ "This version is unsafe and must not be used with confidential data";
		super.td_info_td_coded_by		= "<b>Programmed by:</b><br>"
										+ "<li>Lucy von Känel</li>";
		super.td_info_td_designed_by	= "<b>Designed by:</b><br>"
										+ "<li>Lucy von Känel</li>";
		super.td_info_td_onbehalf_of	= "<b>On behalf of:</b><br>"
										+ "<li>Federal Department of Defence, Civil Protection and Sport<br>->Armed Forces Command Support Organisation<br>->Application Support<br>->Lamoza Rodrigo</li>";
		super.td_archiv_header			= "Archiv";
		super.td_archiv_instructions	= "Info";
		super.td_archiv_instructions_t	= "This Archiv represents the actually invisible notes of this group. That includes notes which are not displayed yet as well as notes which were archived automatically or manually.<br>"
										+ "You can sort them ascending or descending by clicking  at the arrow symbols. You can't sort the ones with a circle symbol. To filter the results you have to edit the inputfields "
										+ "below the sort icons.<br><br>"
										+ "For digits you can use operators like <, <=, =, >, >= fallowed by a number, regular expressions (if you know them) or just the number as itself.<br>"
										+ "For strings you can use regular expressions (if you know them) or just the word as itself. This will result in a 'contains' search.<br><br>";
		super.td_logon_btn_newgroup		= "New Group";
	}
}
