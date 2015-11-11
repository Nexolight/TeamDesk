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
var autoscroll_scrollstop			= "Autoscroll aus";
var autoscroll_scrollstart			= "Autoscroll ein";
var actionbar_write					= "Notiz erstellen";
var actionbar_archiv				= "Archiv öffnen";
var actionbar_settings				= "Gruppeneinstellungen";
var actionbar_info					= "Informationen";
var actionbar_logout				= "Ausloggen";
var error_limiterror				= "Limitierungsfehler";
var error_newnote_onlyone			= "Du kannst nicht mehrere Editoren gleichzeitig öffnen!";
var error_unspecified 				= "Unbekannter fehler";
var error_wedontknow				= "Es tut uns leid, aber etwas ist schrecklich schief gelaufen. Evtl. sind die Server offline";
var error_filepath_rec				= "Der finale Link zur Datei wurde nicht erkannt.";
var note_emptytitle					= "Titel";
var note_emptycontent				= "Notizinhalt";
var note_resize						= "Skalieren";
var note_discard					= "Verwerfen";
var note_apply						= "Speichern";
var note_add_attachement			= "Anhang hinzufügen";
var note_edit_bold					= "Fette Schrift";
var note_edit_italic				= "Kursive Schrift";
var note_edit_underlined			= "Unterstrichene Schrift";
var note_edit_video					= "Video einfügen";
var note_edit_image					= "Bild einfügen";
var note_edit_table					= "Tabelle einfügen";
var note_edit_timer					= "Anzeige und Archivierungsdatum angeben.";
var error_false_datatype			= "Nicht unterstütztes Format";
var error_use_image					= "Du musst ein Bild angeben. Akzeptierte Dateitypen sind:<br><br>png, jpg, gif, tiff, bmp.";
var error_use_video					= "Du musst das Video in einem unterstützten Format hochladen. Unterstütze Formate sind Flash (flv) oder HTML5 (mp4, webm, ogg, ogv).<br>";
var error_false_video_resize		= "Bitte lass die Felder zur Skalierung der Videos entweder frei oder fülle diese nur mit positiven Ganzzahlen. Es genügt auch eine Angabe, das bild wird dann im gleichen Seitenverhältniss skalliert.";
var error_false_input				= "Falsche Angaben";
var error_false_image_resize		= "Bitte lass die Felder zur Skalierung der Bilder entweder frei oder fülle diese nur mit positiven Ganzzahlen. Es genügt auch eine Angabe, das bild wird dann im gleichen Seitenverhältniss skalliert.";
var error_noupload					= "Upload nicht möglich";
var error_upload_not_possible		= "Dynamische uploads werden von deinem Browser nicht unterstützt. Bitte verwende einen HTML5 Kompatiblen Browser.";
var error_autograb					= "Autograb Fehler";
var error_autograb_unsupported		= "Autograb kann von der angegebenen Webseite keine Videos einbinden.<br><br>Unterstützte Webseiten:<br><br>Youtube (18.08.2014)<br>MyVideo (18.08.2014)<br>Clipfish (18.08.2014)<br>Metacafe (18.08.2014)<br>";
var error_no_video_support			= "Dein Browser unterstützt dieses Video nicht. Javascript und HTML5 sind voraussetzungen.";
var uploadinf_upload				= "Hochladen: ";
var upload_successful				= "Upload abgeschlossen";
var error_false_table_values		= "Bitte lass die Felder für Zahlen entweder frei oder benutze nur ganzzahlige Werte.";
var error_no_colrow_value 			= "Du musst die anzahl Zeilen und Spalten angeben.";
var error_no_table_size				= "Die Tabellengrösse konnte nicht berechnet werden. Du musst die Spaltenbreite und Zeilenhöhe oder die absolute Grösse der Tabelle angeben.";
var attachment_type					= "Typ";
var attachment_host					= "Host";
var attachment_host_internal		= "Intern";
var attachment_host_external		= "Extern";
var attachment_uploader				= "Hinzugefügt von";
var user_annonymous					= "Annonym";
var error_save						= "Speichern fehlgeschlagen";
var error_while_save				= "Wärend dem Speichern ist ein Fehler aufgetreten. Sichern sie die Notiz lokal mit Ctrl+A & Ctrl+C und fügen Sie sie später mit Ctrl+V wieder ein.";
var error_invalid_datetime 			= "Die Datums und Zeitangaben sind nicht zulässig. Bitte halte dich an die Formatierung neben den Eingabefeldern. Es müssen jeweils Datum und Zeit angegeben werden. Angaben zur Archivierung sind optional.";
var info_initial_load_notes			= "Lade Notizen. Bitte warten...";
var error_push						= "SSE Fehler";
var error_push_info					= "Das EventSource Modul wird von deinem Browser trotz 3rd party software nicht unterstützt. Teamdesk wird so nicht funktionieren!";
var error_javaserver_unreachable	= "Der Server ist nichtmehr erreichbar - Versuche es später nochmal.";
var unknown_filesize				= "Unbekannte Dateigrösse";
var attachment_image				= "Angehängte Bilder";
var attachment_media				= "Angehängte Medien";
var attachment_doc					= "Angehängte Dokumente";
var attachment_archiv				= "Angehängte Archive und sonstiges";
var note_priority					= "Priorität";
var edit_note						= "Notiz bearbeiten";
var archive_note					= "Notiz Archivieren / Löschen (3 Minuten nach Erstellung)";
var error_connection_lost			= "Verbindung unterbrochen - Versuche Inhalt neu zu laden";
var expand_footer					= "Weitere anzeigen";
var note_editor						= "Editor: ";
var note_created					= "Erstellt: ";
var note_comments					= "Kommentare";
var note_commentinput_autor			= "Autor (Name)";
var note_commentinput_text			= "Kommentar";
var note_comment_author				= "Autor: ";
var note_comment_at					= "Am: ";
var note_comment_ip					= "IP: ";
var error_comment_incomplete		= "Die Angaben sind unvollständig oder entsprechen nicht den richtlinien: ";
var note_comment_text_min_length	= 10; //Has to be a integer;
var note_comment_author_min_length	= 3; //Has to be a integer;
var error_gen_min					= "min ";
var error_gen_max					= "max ";
var error_gen_chars					= " Zeichen";
var note_comment_saved				= "Kommentar gespeichert. Er wird in kürze erscheinen.";
var note_comment_edit_until			= "Veränderbar: ";
var note_comment_updated			= "Kommentar geändert. Änderungen wird in kürze erscheinen.";
var note_comment_removed			= "Kommentar gelöscht. Änderungen wird in kürze erscheinen.";
var note_comment_edit				= "Editieren";
var note_comment_remove				= "Löschen";
var note_comment_back				= "Abbrechen";
var error_server_access_denied		= "Server verweigert zugriff";
var error_comment_edit				= "Der Server kann die änderungen am kommentar nicht speichern. Mögliche Gründe sind:<br><br>Ein interner Fehler<br>Deine IP hat sich kurz nach verfassen des Kommentars geändert<br>Die Zeit zum editieren ist abgelaufen<br>";
var error_comment_remove			= "Der Server kann den Kommentar nicht löschen. Mögliche Gründe sind:<br><br>Ein interner Fehler<br>Deine IP hat sich kurz nach verfassen des Kommentars geändert<br>Die Zeit zum editieren ist abgelaufen<br>";
var error_handle_edit				= "Editieren unmöglich";
var error_handle_edit_eas			= "Die Notiz kann nicht editiert werden, da entweder die Quelle oder der Editor nicht lokalisiert werden konnten";
var warning_cantperform_onedit		= "Aktion kann nicht ausgeführt werden. Die Notiz wird gerade bearbeitet.";
var warning_cantperform_onedit_usr	= "Wird editiert von: ";
var warning_cantperform_onedit_at	= "Editor geöffnet am: ";
var error_cant_lock_note			= "Schreibschutzfehler";
var error_cant_lock_note_i			= "Die Notiz konnte für andere User nicht gesperrt werden. Du kannst zwar fortfahren, musst aber bedenken, dass ein anderer deine Änderungen überschreiben könnte.";
var archiv_th_note_id				= "ID";
var archiv_th_note_level			= "Priorität";
var archiv_th_note_title			= "Titel";
var archiv_th_note_content			= "Inhalt";
var archiv_th_note_showtime			= "Anzeigedatum";
var archiv_th_note_archivetime		= "Archivierungsdatum";
var archiv_th_note_archived			= "Manuell archiviert";
var archiv_th_note_savetime			= "Erstelldatum";
var archiv_th_note_attachments		= "Anhänge";
var warn_user_stopreload			= "Hör auf damit! Die Seite basiert auf AJAX Technologie. Neu laden ist nicht notwendig.";
var warn_popover_oversized_element	= "Das Element hat mit dieser Skalierung keinen Platz auf der Notiz!";
var archiv_th_note_actions			= "Aktionen";
var archiv_note_restore				= "Notiz wiederherstellen";
var archiv_note_delete				= "Notiz endgültig löschen";
var groupadmin_newgroup_header		= "Neue Gruppe erstellen";
var groupadmin_editgroup_header		= "Gruppeneinstellungen ändern";
var groupadmin_settings				= "1. Einstellungen";
var groupadmin_prioritys			= "2. Prioritäten";
var groupadmin_colors				= "3. Farben";
var groupadmin_create				= "4. Erstellen";
var groupadmin_save					= "4. Speichern/Löschen";
var groupadmin_lbl_groupname		= "Gruppenname *";
var groupadmin_lbl_password			= "Gruppenpasswort";
var groupadmin_lbl_description		= "Beschreibung";
var groupadmin_lbl_adminpassword	= "Admin passwort *";
var groupadmin_lbl_fieldresolution	= "Verfügbare Fläche *";
var groupadmin_lbl_maxsize			= "Maximale Notizgrösse *";
var groupadmin_lbl_minsize			= "Minimale Notizgrösse *";
var groupadmin_lbl_defaultsize		= "Standart Notizgrösse *";
var groupadmin_lbl_commentedittime	= "Maximale Editierzeit von verfassten Kommentaren *";
var groupadmin_lbl_lvlweight		= "Prioritätsstufe *";
var groupadmin_lbl_lvldescription	= "Beschreibung *";
var groupadmin_lbl_lvlcolor			= "Schriftfarbe *";
var groupadmin_lbl_lvlbgcolor		= "Hintergrundfarbe *";
var groupadmin_lbl_lvlisblinking	= "Unlöschbar";
var groupadmin_lbl_colorsheme		= "Farbschema name *";
var groupadmin_lbl_cs_font			= "Notizschrift *";
var groupadmin_lbl_cs_bg			= "Notizhintergrund *";
var groupadmin_lbl_cs_title			= "Titelschrift *";
var groupadmin_lbl_cs_bg_title		= "Tittelhintergrund *";
var groupadmin_lbl_cs_link			= "URL Schrift *";
var groupadmin_lbl_cs_borders		= "Ränder *";
var groupadmin_lbl_cs_tbl_header	= "Tabellenkopfhintergrund *";
var groupadmin_lbl_cs_tbl_z01		= "Ungerader Tabellenzeilenhintergrund *";
var groupadmin_lbl_cs_tbl_z02		= "Gerader Tabellenzeilenhintergrund *";
var groupadmin_lbl_cs_tbl_headerfont= "Tabellenkopfschrift *";
var groupadmin_lbl_cs_tbl_z01font	= "Ungerade Tabellenzeilenschrift *";
var groupadmin_lbl_cs_tbl_z02font	= "Gerade Tabellenzeilenschrift *";
var groupadmin_btn_add				= "+";
var groupadmin_btn_remove			= "-";
var general_pica					= "Pixel";
var general_short_ms				= "ms";
var general_full_ms					= "Milisekunden";
var general_short_s					= "s";
var general_full_s					= "Sekunden";
var general_short_m					= "m";
var general_full_m					= "Minuten";
var general_yes						= "Ja";
var general_no						= "Nein";
var general_type_number				= "(Zahl)";
var general_type_hexcolor			= "(#HEX)";
var groupadmin_lbl_actions			= "Entfernen/Hinzufügen";
var groupadmin_lbl_addcolor			= "Farbschema hinzufügen (optional)";
var groupadmin_lbl_info				= "Info";
var groupadmin_txt_newgroup_info	= 	"Mit dem Button erstellen wird eine neue Gruppe mit deinen vorgenommenen Einstellungen erstellt. Du kannst die Einstellungen später jederzeit mit deinem Admin Passwort ändern, nachdem du dich in die " +
										"Gruppe eingeloggt hast. Untenstehend hast du eine Übersicht zu deinen Einstellungen. Rot markierte Einstellungen sind nicht korrekt und müssen vor dem Erstellen korrigiert werden.";
var groupadmin_txt_editgroup_info	= 	"Mit dem Button speichern werden die Änderungen an der Gruppe übernommen. <b>Bitte beachte dabei das alle angemeldeten Benutzer ausgeloggt werden</b>. Grössenangaben werden falls nötig geändert um den aktuellen Einstellungen zu " +
										"entsprechen. Das kann optisch sehr negative Effekte haben! Wird ein Farbschema gänzlich entfernt, so werden für die Notizen wieder die Templatefarben verwendet. Wird eine Priorität entfernt, werden die Notizen derjenigen " +
										"mit dem nächst tieferen Gewicht zugeordnet. Handelt es sich um die tiefste Priorität werden die betroffenen Notizen der nächst höheren zugeordnet.<br><br>" +
										"Untenstehend hast du eine Übersicht zu den Einstellungen. Rot markierte Einträge werden so nicht akzeptiert und müssen korrigiert werden.";
var groupadmin_lbl_summary			= "Zusammenfassung:";
var groupadmin_btn_create			= "Erstellen";
var groupadmin_btn_save				= "Speichern";
var groupadmin_btn_cancel			= "Abbrechen";
var groupadmin_missingno			= "n";
var groupadmin_missingstring		= "Leer";
var groupadmin_mode_error			= "Programmfehler";
var groupadmin_mode_error_t			= "Das Gruppenadministrations GUI konnte wegen eines internen Fehlers nicht erstellt werden.";
var groupadmin_error_invalid_input	= "Einstellungen ungültig";
var groupadmin_error_invalid_input_t= "Deine Einstellungen sind nicht korrekt. Schau in der zusammenfassung nach, um welche es sich handelt (rot markiert)." +
										"<ul>" +
										"<li>Eingabefelder mit * sind pflichfelder.</li>" +
										"<li>Sind keine weiteren Bezeichnungen neben den Eingabefeldern vorhanden, dann wird simpler Text erwartet.</li>" +
										"<li>Felder wie '[ ]x[ ] "+general_pica+"' verlangen 2 Zahlen als Grössenangabe (breite/höhe).</li>" +
										"<li>Felder wie '[ ] "+general_full_m+"' verlangen 1 Zahl (Zeitangabe).</li>" +
										"<li>Felder wie '[ ] "+general_type_number+"' verlangen 1 Zahl.</li>" +
										"<li>Felder wie '[ ] "+general_type_hexcolor+"' verlangen eine Farbangabe im hexadezimalen (0-F) Format '#RRGGBB'.</li>" +
										"<li>Buttons die mit '"+groupadmin_btn_add+"' oder '"+groupadmin_btn_remove+"' angeschrieben sind, sind zum hinzufügen/entfernen eines Abschnitts da.'</li>" +
										"</ul><br>";
var groupadmin_error_doubleentry	= "Doppelter eintrag";
var groupadmin_error_doubleentry_t	= "Die Datenbank verweigert das Speichern der Gruppe. Vermutlich existiert der Gruppenname bereits.";
var gen_dbrefuse					= "Server akzeptiert Eintrag nicht";
var gen_dbrefuse_t					= "Der Server verweigert einen EIntrag. Das kann diverse Gründe haben. " +
										"Möglich Probleme sind falsche bzw. fehlende parameter, fehlende Berechtigungen oder einmalige Datensätze die bereits existieren.";
var gen_dbrefuse_remove				= "Server verweigert Löschung";
var gen_dbrefuse_remove_t			= "Der Server verweigert die Löschung eines Eintrags. Das kann diverse Gründe haben. " +
										"Mögliche Probleme sind falsche oder fehlende parameter, abhängige Datensätze oder fehlende Berechtigungen.";
var askwindow_btnyes				= "Ja";
var askwindow_btnno					= "Nein";
var askwindow_btncancel				= "Abbrechen";
var askwindow_btnok					= "Ok";
var askwindow_password_needed		= "Passwort";
var askwindow_enter_gradminpw		= "Bitte gib das Gruppenadministrationspasswort ein um Änderungen an der aktuellen Gruppe vorzunehmen.";
var reloadtimer_timetowait			= "Die Gruppeneinstellungen wurden geändert. Seite wird in [seconds] Sekunden neu geladen.";
var askwindow_removegroup			= "Gruppe löschen?";
var askwindow_removegroup_t			= "Bist du sicher das du diese Gruppe löschen willst? Alle Daten und Einstellungen werden irrevisible verloren gehen!";
var groupadmin_btn_removegroup		= "Gruppe löschen";
var info_group_deleted				= "Die Gruppe in der du dich befindest wurde vom Administrator gelöscht. Du wirst zum Loginfenster weitergeleitet.";