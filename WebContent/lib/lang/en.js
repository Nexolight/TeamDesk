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
var autoscroll_scrollstop			= "Autoscroll disabled";
var autoscroll_scrollstart			= "Autoscroll enabled";
var actionbar_write					= "Create note";
var actionbar_archiv				= "Open archive";
var actionbar_settings				= "Group settings";
var actionbar_info					= "Informations";
var actionbar_logout				= "Logout";
var error_limiterror				= "Limitation error";
var error_newnote_onlyone			= "You cannot open multiple editors at the same time!";
var error_unspecified 				= "Unknown error";
var error_wedontknow				= "Sorry, something went terrible wrong. Maybe the servers are down.";
var error_filepath_rec				= "The final link to the file is not avaiable.";
var note_emptytitle					= "Title";
var note_emptycontent				= "Notecontent";
var note_resize						= "Scale";
var note_discard					= "Discard";
var note_apply						= "Save";
var note_add_attachement			= "Add attachement";
var note_edit_bold					= "Bold font";
var note_edit_italic				= "Italic font";
var note_edit_underlined			= "Underlined font";
var note_edit_video					= "Add video";
var note_edit_image					= "Add image";
var note_edit_table					= "Add table";
var note_edit_timer					= "Set show and archiv date.";
var error_false_datatype			= "Not supported file format";
var error_use_image					= "You have to use an image. Accepted types are:<br><br>png, jpg, gif, tiff, bmp.";
var error_use_video					= "You have to upload the video with a supported format. Supported formats are Flash (flv) or HTML5 (mp4, webm, ogg, ogv)";
var error_false_video_resize		= "Please let the video resize fields empty or use only positive digits. One input is enough. This will resize the image in the same aspect ratio.";
var error_false_input				= "Not acceptable input";
var error_false_image_resize		= "Please let the image resize fields empty or use only positive digits. One input is enough. This will resize the image in the same aspect ratio.";
var error_noupload					= "Upload not possible";
var error_upload_not_possible		= "Dynamic uploads are not supported by your browser. Please use a HTML5 compatible browser.";
var error_autograb					= "Autograb error";
var error_autograb_unsupported		= "The website from which you wanted to grab the video is not supported.<br><br>Supported websites:<br><br>Youtube (18.08.2014)<br>MyVideo (18.08.2014)<br>Clipfish (18.08.2014)<br>Metacafe (18.08.2014)<br>";
var error_no_video_support			= "Your browser don't support this video. Javascript and HTML5 are requirements.";
var uploadinf_upload				= "Upload: ";
var upload_successful				= "Upload successful";
var error_false_table_values		= "Please let the value fields empty or use only positive digits.";
var error_no_colrow_value			= "Youe have to set the number of columns and rows.";
var error_no_table_size				= "The table size can not be calculated. You have to enter the column width and row height or the absolute size of the table.";
var attachment_type					= "Type";
var attachment_host					= "Host";
var attachment_host_internal		= "Internal";
var attachment_host_external		= "External";
var attachment_uploader				= "Added by";
var user_annonymous					= "Annonym";
var error_save						= "Save failed";
var error_while_save				= "An error occured while saving. Please save the note locally with Ctrl+a & Ctrl+c and restore it later with Ctrl+v.";
var error_invalid_datetime 			= "Date and time inputs are invalid. Please enter them like the format example near the input fields. You have to set date AND time. The archiving area is optional.";
var info_initial_load_notes			= "Loading notes. Please wait...";
var error_push						= "SSE Error";
var error_push_info					= "The EventSource modul isn't supported by your browser although we've implemented 3rd party software for this case. Sadly Teamdesk will not work!";
var error_javaserver_unreachable	= "The server is currently unreachable - Please try again later.";
var unknown_filesize				= "Unknown filesize";
var attachment_image				= "Attached images";
var attachment_media				= "Attached medias";
var attachment_doc					= "Attached documents";
var attachment_archiv				= "Attached archives";
var note_priority					= "Priority";
var edit_note						= "Edit note";
var archive_note					= "Archive note / delete (3 minutes after creation)";
var error_connection_lost			= "Connection abrupted - Try to relaod the content";
var expand_footer					= "Show more";
var note_editor						= "Editor: ";
var note_created					= "Erstellt: ";
var note_comments					= "Comments";
var note_commentinput_autor			= "Author (name)";
var note_commentinput_text			= "Comment";
var note_comment_author				= "Author: ";
var note_comment_at					= "At: ";
var note_comment_ip					= "IP: ";
var error_comment_incomplete		= "Your Input is incomplete or doesn't match the rules: ";
var note_comment_text_min_length	= 10; //Has to be a integer;
var note_comment_author_min_length	= 3; //Has to be a integer;
var error_gen_min					= "min ";
var error_gen_max					= "max ";
var error_gen_chars					= " Chars";
var note_comment_saved				= "Comment saved. It will appear shortly";
var note_comment_edit_until			= "Changeable: ";
var note_comment_updated			= "Comment changed. It will appear shortly.";
var note_comment_removed			= "Comment removed. It will disappear shortly.";
var note_comment_edit				= "Edit";
var note_comment_remove				= "Delete";
var note_comment_back				= "Cancel";
var error_server_access_denied		= "Server refused access";
var error_comment_edit				= "The server cannot save your changes on this comment. Possible reasons are:<br><br>An internal error<br>Your IP changed shortly after you have wroten your comment<br>The time to edit is expired<br>";
var error_comment_remove			= "The server cannot delete this comment. Possible reasons are:<br><br>An internal error<br>Your IP changed shortly after you have wroten your comment<br>The time to edit is expired<br>";
var error_handle_edit				= "Edit is impossible";
var error_handle_edit_eas			= "The note cannot be edited - The source note or the editor can't be localized";
var warning_cantperform_onedit		= "Action can't performed. The note is currently editing.";
var warning_cantperform_onedit_usr	= "Editing by: ";
var warning_cantperform_onedit_at	= "Editor opened at: ";
var error_cant_lock_note			= "Writelock error";
var error_cant_lock_note_i			= "Unable to lock the note for other users. You can proceed but keep in mind that someone else could override your changes";
var archiv_th_note_id				= "ID";
var archiv_th_note_level			= "Priority";
var archiv_th_note_title			= "Title";
var archiv_th_note_content			= "Content";
var archiv_th_note_showtime			= "Showtime";
var archiv_th_note_archivetime		= "Archivetime";
var archiv_th_note_archived			= "Manually archived";
var archiv_th_note_savetime			= "Create time";
var archiv_th_note_attachments		= "Attachments";
var warn_user_stopreload			= "Stop it! The page is AJAX based. A reload is not needed.";
var warn_popover_oversized_element	= "The element with this scale is to big for the note content!";
var archiv_th_note_actions			= "Actions";
var archiv_note_restore				= "Restore note";
var archiv_note_delete				= "Final delete note";
var groupadmin_newgroup_header		= "Create new group";
var groupadmin_editgroup_header		= "Change group settings";
var groupadmin_settings				= "1. Settings";
var groupadmin_prioritys			= "2. Prioritys";
var groupadmin_colors				= "3. Colors";
var groupadmin_create				= "4. Create";
var groupadmin_save					= "4. Save/Delete";
var groupadmin_lbl_groupname		= "Groupname *";
var groupadmin_lbl_password			= "Group password";
var groupadmin_lbl_description		= "Description";
var groupadmin_lbl_adminpassword	= "Admin password *";
var groupadmin_lbl_fieldresolution	= "Available surface *";
var groupadmin_lbl_maxsize			= "Maximum note size *";
var groupadmin_lbl_minsize			= "Minimum note size *";
var groupadmin_lbl_defaultsize		= "Default note size *";
var groupadmin_lbl_commentedittime	= "Maximum edit time of written comments *";
var groupadmin_lbl_lvlweight		= "Priority level *";
var groupadmin_lbl_lvldescription	= "Description *";
var groupadmin_lbl_lvlcolor			= "Font color *";
var groupadmin_lbl_lvlbgcolor		= "Background color *";
var groupadmin_lbl_lvlisblinking	= "Undeletable";
var groupadmin_lbl_colorsheme		= "Colorsheme name *";
var groupadmin_lbl_cs_font			= "Note font *";
var groupadmin_lbl_cs_bg			= "Note background *";
var groupadmin_lbl_cs_title			= "Title font *";
var groupadmin_lbl_cs_bg_title		= "Title background *";
var groupadmin_lbl_cs_link			= "URL font *";
var groupadmin_lbl_cs_borders		= "Borders *";
var groupadmin_lbl_cs_tbl_header	= "Table head background *";
var groupadmin_lbl_cs_tbl_z01		= "Odd table row background *";
var groupadmin_lbl_cs_tbl_z02		= "Even table row background *";
var groupadmin_lbl_cs_tbl_headerfont= "Table head font *";
var groupadmin_lbl_cs_tbl_z01font	= "Odd table row font *";
var groupadmin_lbl_cs_tbl_z02font	= "Even table row font *";
var groupadmin_btn_add				= "+";
var groupadmin_btn_remove			= "-";
var general_pica					= "Pixels";
var general_short_ms				= "ms";
var general_full_ms					= "Miliseconds";
var general_short_s					= "s";
var general_full_s					= "Seconds";
var general_short_m					= "m";
var general_full_m					= "Minutes";
var general_yes						= "Yes";
var general_no						= "No";
var general_type_number				= "(Number)";
var general_type_hexcolor			= "(#HEX)";
var groupadmin_lbl_actions			= "Add/Remove";
var groupadmin_lbl_addcolor			= "Add colorsheme (optional)";
var groupadmin_lbl_info				= "Info";
var groupadmin_txt_newgroup_info	= 	"With the button 'create' you can create a group with your made settings. You can change the settings later and at any time with your admin password after you've logged in to the new created group. " +
										"Below you have a summary of your made settings. Red marked settings are not correct and have to be corrected before you can create the group.";
var groupadmin_txt_editgroup_info	= 	"With the button 'save' you can save your made settings. <b>Please keep in mind that every other user will be logged out</b>. If it's necessary, size settings will be changed to fit into your new settings." +
										"Optically that could have an very negative impact! If you remove a colorsheme the template colors will be used again for the affected notes. If you remove a priority then the affected notes will get the closest " +
										"lower priority. If it is the priority with the deepest weight then the clostest upper priority will be used.<br><br>" +
										"Below you have a summary of all current settings. Red marked settings are invalid and have to be corrected before you can save them.";
var groupadmin_lbl_summary			= "Summary:";
var groupadmin_btn_create			= "Create";
var groupadmin_btn_save				= "Save";
var groupadmin_btn_cancel			= "Cancel";
var groupadmin_missingno			= "n";
var groupadmin_missingstring		= "Empty";
var groupadmin_mode_error			= "Programm error";
var groupadmin_mode_error_t			= "The groupadmin GUI can't load because of an internal programm error.";
var groupadmin_error_invalid_input	= "Invalid settings";
var groupadmin_error_invalid_input_t= "Your settings are invalid. Look at the summary to know which ones aren't (red marked)." +
										"<ul>" +
										"<li>Input fields with * must be filled out.</li>" +
										"<li>If there is no further expression after a input field, then a simple text is expected.</li>" +
										"<li>Fields like '[ ]x[ ] "+general_pica+"' requires 2 numbers as size specification (width/height).</li>" +
										"<li>Fields like '[ ] "+general_full_m+"' requires 1 number (time specification).</li>" +
										"<li>Fields like '[ ] "+general_type_number+"' requires 1 number.</li>" +
										"<li>Fields like '[ ] "+general_type_hexcolor+"' requires a hexadecimal (0-F) color specification in the format '#RRGGBB'.</li>" +
										"<li>Buttons which are labeled with '"+groupadmin_btn_add+"' or '"+groupadmin_btn_remove+"' are there to add/remove sections.'</li>" +
										"</ul><br>";
var groupadmin_error_doubleentry	= "Double entry";
var groupadmin_error_doubleentry_t	= "The database refuses to save the entry. Probably because your choosen groupname is already in use.";
var gen_dbrefuse					= "Server refuses entry";
var gen_dbrefuse_t					= "The Server refuses an entry. This can be caused by different reasons." +
										"Possible problems are missing or not accepted parameters, missing permissions or a unique entry which already exist.";
var gen_dbrefuse_remove				= "Server refuses removing";
var gen_dbrefuse_remove_t			= "The Server refuses to remove an entry. This can be caused by different reasons. " +
										"Possible problems are missing or not accepted parameters, dependent entrys or missing permissions.";
var askwindow_btnyes				= "Yes";
var askwindow_btnno					= "No";
var askwindow_btncancel				= "Cancel";
var askwindow_btnok					= "Ok";
var askwindow_password_needed		= "Password";
var askwindow_enter_gradminpw		= "Please enter the group admin password to change this group settings.";
var reloadtimer_timetowait			= "The Group settings has been changed. The site will be reloaded in [seconds] seconds.";
var askwindow_removegroup			= "Delete Group?";
var askwindow_removegroup_t			= "Are you sure that you want to delete this group? All data and settings will be irrevisible lost!";
var groupadmin_btn_removegroup		= "Remove group";
var info_group_deleted				= "The group you're currently using was deleted by the group administrator. You will be redirected to the login window.";

