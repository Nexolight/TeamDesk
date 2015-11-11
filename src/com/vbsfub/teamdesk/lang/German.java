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

public class German extends Language{
	public German(){
		
		super.td_title					= "Teamdesk";
		super.td_keywords				= "Digital, Pinnwand, Teamdesk, Aufgaben, Gruppe";
		super.td_description			= "Teamdesk ist eine digitale Pinnwand, welche vorallem für Service Desks und Aufgabengruppen erstellt wurde.";
		super.td_author					= "Lucy von Känel im Auftrag des schweizerischen Verteidigungsdepartementes VBS FUB";
		super.td_header_text			= "VBS FUB - TeamDesk v0.93 Pre-Beta";
		super.td_error_security			= "Sicherheitsproblem";
		super.td_errorinf_groupauth		= "Bei der Authentifizierung an der gewählten Gruppe ist etwas schief gelaufen.";
		super.td_button_back			= "Zurück";
		super.td_logon_title			= "Bitte Gruppe wählen";
		super.td_logon_instruction		= "Teamdesk bietet verschiedene Gruppen. Wählen sie diejenige die sie betreten möchten. Evtl. ist ein Passwort erforderlich.";
		super.td_logon_nextbtn			= "Beitreten";
		super.td_logon_password			= "Passwort:";
		super.td_actionslide			= "Aktionen";
		super.td_n_priority				= "Priorität";
		super.td_add_image_head			= "Bild hinzufügen";
		super.td_addimg_instructions	= "Info";
		super.td_addimg_instructions_t	= "Du kannst ein externes Bild einbinden indem du die URL in das entsprechende Feld einfügst.<br><br>Du kannst auch ein Bild hochladen solange es im richtigen Format ist.<br><br>Die Skalierung ist optional (standartmässig volle breite der Notiz).";
		super.td_gen_link				= "Link";
		super.td_gen_upload				= "Hochladen";
		super.td_addimg_scale			= "Bild skalieren (optional)";
		super.td_gen_add				= "Hinzufügen";
		super.td_gen_set				= "Speichern";
		super.td_gen_cancel				= "Verwerfen";
		super.td_gen_browse				= "Suchen";
		super.td_gen_pica				= "Pixel";
		super.td_gen_x					= "x";
		super.td_img_bs					= "(png, jpg, gif, tiff, bmp)";
		super.td_add_movie_head			= "Video hinzufügen";
		super.td_addmovie_instructions	= "Info";
		super.td_addmovie_instructions_t= "Du kannst ein Video mit Autograb einbetten indem du die ganze URL von einer (hoffentlich) kompatiblen videoplatform wie youtube in das entsprechende Feld einfügst.<br><br>Du kannst auch ein Video hochladen solange du es zuvor in ein kompatibles Format konvertierst.<br><br>Die Skalierung ist optional (standartmässig volle breite der Notiz).";
		super.td_addmovie_url			= "Video URL (Autograb)";
		super.td_addmovie_scale			= "Video skalieren";
		super.td_mov_bs					= "(flv, mp4, webm, ogg, ogv)";
		super.td_add_table_head			= "Tabelle hinzufügen";
		super.td_addtable_columns		= "Spalten";
		super.td_addtable_width			= "Breite (Pixel)";
		super.td_addtable_height		= "Höhe (Pixel)";
		super.td_addtable_count			= "Anzahl";
		super.td_addtable_rows			= "Zeilen";
		super.td_addtable_size			= "Absolute Grösse";
		super.td_addtable_instructions	= "Info";
		super.td_addtable_instructions_t= "Spalten und Zeilenzahl müssen angegeben werden.<br>Zudem muss entweder die Absolute Grösse oder die Breite und Höhe von Spalten und Zellen angegeben werden.";
		super.td_addtable_formatting	= "Formatierung";
		super.td_addtable_headerleft	= "Header links";
		super.td_addtable_headertop		= "Header oben";
		super.td_addtable_zebra			= "Farben abgrenzen";
		super.td_add_attachment_head	= "Anhang hinzufügen";
		super.td_addatt_instructions	= "Info";
		super.td_addatt_instructions_t 	= "Hier kannst du eine Datei anhängen. Füge die ganze URL für eine externe Quelle hinzu oder lade die Datei hoch.<br>Gib der Datei wenn möglich einen Namen.";
		super.td_addatt_url				= "Datei URL";
		super.td_file_bs				= "(alle Dateitypen)";
		super.td_addatt_name			= "Dateiname";
		super.td_notecolors_default		= "Template Farbschema";
		super.td_settimer_title			= "Timer hinzufügen";
		super.td_settimer_instructions	= "Info";
		super.td_settimer_instructions_t = "Gib das Anzeigedatum und/oder das Archivierungsdatum an. Das Anzeigedatum ist standartmässig der Zeitpunkt, an dem die Notiz gespeichert wird. Ab diesem Zeitpunkt ist die Notiz für andere Sichtbar.<br><br>Das Archivierungsdatum existiert standartmässig nicht. Wird eine Notiz aber nur bis zu einem bestimmten Zeitpunkt benötigt, kann dieses gesetzt werden. Die Notiz wird dann zu dieser Zeit automatisch archiviert.";
		super.td_settimer_displaydate	= "Anzeigedatum";
		super.td_settimer_archivedate	= "Archivierungsdatum";
		super.td_settimer_dateformat	= "<i>tt.mm.yyyy</i>";
		super.td_settimer_timeformat	= "<i>hh:mm (24h)</i>";
		super.td_gen_comments			= "Kommentare";
		super.td_info_head				= "Über Teamdesk";
		super.td_info_td				= "<b>Teamdesk</b>";
		super.td_info_td_version		= "<b>Version 0.93 'woody desk' - Pre-Beta</b><br>"
										+ "Diese Version ist unsicher und darf nicht für vertrauliche Informationen verwendet werden!";
		super.td_info_td_coded_by		= "<b>Programmiert von:</b><br>"
										+ "<li>Lucy von Känel</li>";
		super.td_info_td_designed_by	= "<b>Designt von:</b><br>"
										+ "<li>Lucy von Känel</li>";
		super.td_info_td_onbehalf_of	= "<b>Im Auftrag von:</b><br>"
										+ "<li>Eidgenössisches Departement für Verteidigung, Bevölkerungsschutz und Sport<br>->Führungsunterstützungsbasis<br>->Anwendungssupport<br>->Lamoza Rodrigo</li>";
		super.td_archiv_header			= "Archiv";
		super.td_archiv_instructions	= "Info";
		super.td_archiv_instructions_t	= "Dieses Archiv repräsentiert die aktuell unsichtbaren Notizen dieser Gruppe. Das beinhaltet Notizen die noch nicht angezeigt werden, genauso wie die die automatisch oder manuell archiviert wurden.<br>"
										+ "Du kannst sie aufsteigend oder absteigend sortieren, indem du auf die jeweiligen Pfeilsymbole klickst. Die Spalten mit Kreissymbol können nicht sortiert werden. Um die Resultate zu filtern, musst du die Eingabefelder "
										+ "unterhalb der sortier Icons editieren.<br><br>"
										+ "Für Zahlen kannst du <, <=, =, >, >= gefolgt von einer Zahl, reguläre Ausdrücke (RegEx, falls bekannt) oder nur die Zahl selber benutzen.<br>"
										+ "Für Wortketten kannst du reguläre Ausdrücke (RegEx, falls bekannt) oder nur die Wörter selber verwenden. Letzeres kommt einer 'enthällt' Suche gleich.<br><br>";
		super.td_logon_btn_newgroup		= "Neue Gruppe";
	}
}
