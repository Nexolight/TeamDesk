/* 
Copyright (C) 2014-2015 Inc. All Rights Reserved.

Federal Departement of Defence, Civil Protection and Sport,
Armed Forces Command Support Organisation

and

Lucy von Känel - snow.dream.ch@gmail.com

---------------------------------------------------------------------
This file (code) is part of the project "TeamDesk"
as well as a subject of the Artistic Licence 2.0.

See LICENCE.txt or https://opensource.org/licenses/Artistic-2.0

the code comes "as is". There is no waranty about it's functionality,
merchantability and / or fitness for a particular purpose.
No matter if expressed or implied.
---------------------------------------------------------------------

Source Server         : localhost
Source Server Version : 50544
Source Host           : 127.0.0.1:3306
Source Database       : teamdesk

Target Server Type    : MYSQL
Target Server Version : 50544
File Encoding         : 65001

Date: 2015-09-17 15:56:27
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for td_t_attachments
-- ----------------------------
DROP TABLE IF EXISTS `td_t_attachments`;
CREATE TABLE `td_t_attachments` (
  `id_attachment` int(11) NOT NULL AUTO_INCREMENT,
  `link` varchar(255) NOT NULL,
  `info` varchar(255) NOT NULL,
  `log` varchar(255) NOT NULL,
  `fk_note` int(11) NOT NULL,
  PRIMARY KEY (`id_attachment`),
  KEY `note_attachments` (`fk_note`),
  CONSTRAINT `note_attachments` FOREIGN KEY (`fk_note`) REFERENCES `td_t_notes` (`id_note`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of td_t_attachments
-- ----------------------------

-- ----------------------------
-- Table structure for td_t_editors
-- ----------------------------
DROP TABLE IF EXISTS `td_t_editors`;
CREATE TABLE `td_t_editors` (
  `id_editor` int(11) NOT NULL AUTO_INCREMENT,
  `fk_note` int(11) NOT NULL,
  `editor_ip` varchar(255) NOT NULL,
  `edit_time` datetime NOT NULL,
  PRIMARY KEY (`id_editor`),
  KEY `note_editors` (`fk_note`),
  CONSTRAINT `note_editors` FOREIGN KEY (`fk_note`) REFERENCES `td_t_notes` (`id_note`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=293 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of td_t_editors
-- ----------------------------
INSERT INTO `td_t_editors` VALUES ('292', '133', '0:0:0:0:0:0:0:1', '2015-09-17 15:51:43');

-- ----------------------------
-- Table structure for td_t_groups
-- ----------------------------
DROP TABLE IF EXISTS `td_t_groups`;
CREATE TABLE `td_t_groups` (
  `id_group` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `description` mediumtext,
  `admin_password` varchar(255) NOT NULL,
  `field_resolution` varchar(9) NOT NULL,
  `max_size` varchar(9) NOT NULL,
  `min_size` varchar(9) NOT NULL,
  `default_size` varchar(9) NOT NULL,
  `max_commentedittime` bigint(20) NOT NULL DEFAULT '900000',
  PRIMARY KEY (`id_group`),
  UNIQUE KEY `t_groups_name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of td_t_groups
-- ----------------------------
INSERT INTO `td_t_groups` VALUES ('1', 'Beispielgruppe', '', 'Die Gruppe die zur Entwicklung genutzt wird\n\nAdmin PW: 1234\n\nKein Gruppenpasswort', '1234', '2500x1800', '600x600', '200x200', '300x400', '900000');

-- ----------------------------
-- Table structure for td_t_levels
-- ----------------------------
DROP TABLE IF EXISTS `td_t_levels`;
CREATE TABLE `td_t_levels` (
  `id_level` int(11) NOT NULL AUTO_INCREMENT,
  `weight` int(3) NOT NULL,
  `description` mediumtext NOT NULL,
  `font_color` varchar(7) NOT NULL,
  `background_color` varchar(7) NOT NULL,
  `fk_profile` int(11) NOT NULL,
  `isblinking` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id_level`),
  KEY `t_levels_fk_profile` (`fk_profile`) USING BTREE,
  CONSTRAINT `group_levels` FOREIGN KEY (`fk_profile`) REFERENCES `td_t_groups` (`id_group`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of td_t_levels
-- ----------------------------
INSERT INTO `td_t_levels` VALUES ('1', '1', 'Nur extrem wichtiges', '#FFFFFF', '#FF0000', '1', '');
INSERT INTO `td_t_levels` VALUES ('4', '2', 'Hat priotirät', '#000000', '#f2c12a', '1', '');
INSERT INTO `td_t_levels` VALUES ('5', '3', 'Nicht sooo wichtig', '#000000', '#82afd2', '1', '\0');

-- ----------------------------
-- Table structure for td_t_notecomments
-- ----------------------------
DROP TABLE IF EXISTS `td_t_notecomments`;
CREATE TABLE `td_t_notecomments` (
  `id_comment` int(11) NOT NULL AUTO_INCREMENT,
  `fk_note` int(11) NOT NULL,
  `comment` mediumtext NOT NULL,
  `writer_ip` varchar(15) NOT NULL,
  `savetime` datetime NOT NULL,
  `writer_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id_comment`),
  KEY `t_notecomments_fk_note` (`fk_note`),
  CONSTRAINT `note_notecomment` FOREIGN KEY (`fk_note`) REFERENCES `td_t_notes` (`id_note`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of td_t_notecomments
-- ----------------------------

-- ----------------------------
-- Table structure for td_t_notes
-- ----------------------------
DROP TABLE IF EXISTS `td_t_notes`;
CREATE TABLE `td_t_notes` (
  `id_note` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` mediumtext NOT NULL,
  `showtime` datetime NOT NULL,
  `archivetime` datetime DEFAULT NULL,
  `savetime` datetime NOT NULL,
  `lastview` datetime NOT NULL,
  `archived` bit(1) NOT NULL,
  `pos_x` int(4) NOT NULL,
  `pos_y` int(4) NOT NULL,
  `fk_level` int(11) NOT NULL,
  `size` varchar(9) NOT NULL,
  `fk_group` int(11) NOT NULL,
  `fk_colors` int(11) DEFAULT NULL,
  `locked_at` datetime DEFAULT NULL,
  `locked_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_note`),
  KEY `t_notes_title` (`title`),
  KEY `t_notes_fk_level` (`fk_level`),
  KEY `t_notes_fk_group` (`fk_group`),
  KEY `note_colors` (`fk_colors`),
  CONSTRAINT `note_colors` FOREIGN KEY (`fk_colors`) REFERENCES `td_t_selectablecolors` (`id_color`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `note_group` FOREIGN KEY (`fk_group`) REFERENCES `td_t_groups` (`id_group`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `note_level` FOREIGN KEY (`fk_level`) REFERENCES `td_t_levels` (`id_level`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of td_t_notes
-- ----------------------------
INSERT INTO `td_t_notes` VALUES ('133', 'Funktionen', '<div><b>Scroll Funktion</b></div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Aktivieren/Deaktivieren mit Klick auf freie Oberfläche</b></div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Sensibilitätsbereich ca. 150px von Bildschirmrand</b></div><div><br></div><div><b>Aktionsliste (Mouseover)</b></div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Blatt&nbsp;</b>-&gt; Neue Notizen erstellen</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Mülleimer&nbsp;</b>-&gt; Archiv&nbsp;</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Zahnrad&nbsp;</b>-&gt; Gruppenverwaltung</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Info&nbsp;</b>-&gt; Über TeamDesk</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Logout&nbsp;</b>-&gt; Ausloggen</div><div><br></div><div><b>Notizsymbole</b></div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Titelliste Blatt</b>&nbsp;-&gt; Editieren</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Titelliste Mülleimer</b>&nbsp;-&gt; Archivieren</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Fusszeile Dreieck</b>&nbsp;-&gt; Editoren zeigen/verstecken</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Rechte Seite</b>&nbsp;-&gt; Kommentare schreiben/lesen</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Linke Seite</b>&nbsp;-&gt; Falls vorhanden Anhänge betrachen (Zurück -&gt; erneut klicken)</div><div><br></div><div><b>Editormenü</b></div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Linke Seite +</b>&nbsp;-&gt; Anhang hinzufügen/hochladen</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Rechte Seite B</b>&nbsp;-&gt; Fette Schrift</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Rechte Seite I</b>&nbsp;-&gt; Kursive Schrift</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Rechte Seite u</b>&nbsp;-&gt; Unterstrichene Schrift</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Rechte Seite Bild</b>&nbsp;-&gt; Bild an Cursorposition einfügen/hochladen</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Rechte Seite Video</b>&nbsp;-&gt; Video an Cursorposition einfügen/hochladen</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Rechte Seite Tabelle&nbsp;</b>-&gt; Tabelle an Cursorposition einfügen</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Rechte Seite Wecker</b>&nbsp;-&gt; Anzeige oder Archivierungsdatum angeben</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Fusszeile Pfeil</b>&nbsp;-&gt; Skalieren</div><div>•<span class=\"Apple-tab-span\" style=\"white-space: pre;\">	</span><b>Fusszeile Dropdown</b>&nbsp;-&gt; Vorgegebenes Farbschema wählen</div><div><br></div><div><b>Notizen können verschoben werden (Drag&amp;Drop im Prioritätsfeld).</b></div><div>Gewisse Performance probleme existieren. Teamdesk läuft am besten in Chrome oder IE 11</div><div><br></div>', '2015-09-17 15:51:00', null, '2015-09-17 15:51:43', '2015-09-17 15:51:43', '\0', '307', '99', '5', '600x572', '1', null, null, null);

-- ----------------------------
-- Table structure for td_t_selectablecolors
-- ----------------------------
DROP TABLE IF EXISTS `td_t_selectablecolors`;
CREATE TABLE `td_t_selectablecolors` (
  `id_color` int(11) NOT NULL AUTO_INCREMENT,
  `fk_profile` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `content_font` varchar(7) NOT NULL,
  `content_background` varchar(7) NOT NULL,
  `title_font` varchar(7) NOT NULL,
  `title_background` varchar(7) NOT NULL,
  `link_font` varchar(7) NOT NULL,
  `borders` varchar(7) NOT NULL,
  `table_header_background` varchar(7) NOT NULL,
  `table_cell_01_background` varchar(7) NOT NULL,
  `table_cell_02_background` varchar(7) NOT NULL,
  `table_header_font` varchar(7) NOT NULL,
  `table_cell_01_font` varchar(7) NOT NULL,
  `table_cell_02_font` varchar(7) NOT NULL,
  PRIMARY KEY (`id_color`,`borders`),
  KEY `t_selectablecolors_fk_profile` (`fk_profile`) USING BTREE,
  KEY `id_color` (`id_color`),
  CONSTRAINT `profile_colors` FOREIGN KEY (`fk_profile`) REFERENCES `td_t_groups` (`id_group`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of td_t_selectablecolors
-- ----------------------------
INSERT INTO `td_t_selectablecolors` VALUES ('1', '1', 'Korkfarben', '#543c15', '#FFECCA', '#543C15', '#F3C97F', '#8D411C', '#260d01', '#DFAA4C', '#FFECCA', '#F3C97F', '#543C15', '#543C15', '#543C15');
INSERT INTO `td_t_selectablecolors` VALUES ('2', '1', 'Waldfarben', '#475218', '#D0FF92', '#3B2908', '#E7C67F', '#67542E', '#3B2908', '#475218', '#E7C67F', '#B9964B', '#E7C67F', '#3B2908', '#3B2908');
INSERT INTO `td_t_selectablecolors` VALUES ('3', '1', 'Businessfarben', '#000000', '#D3E0E9', '#FFFFFF', '#4B7FA7', '#4B7FA7', '#000000', '#575757', '#DADADA', '#A4A4A4', '#FFFFFF', '#000000', '#000000');
