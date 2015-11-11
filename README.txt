################################################################################
# What is TeamDesk?                                                            #
################################################################################

About functionality
-------------------
Teamdesk is the digital representation of a pinnwall with some extras.
The idea behin is that every person on the same (per definition local)
network can access the pinwalll to create, edot, remove, archive, or
comment notes. The changes are visible in almost real time 
(Push technology). Furthermore it TeamDesk allows the user to post
directly embeded multimedia stuff, like videos and images, as well as 
attachments (any kind of files as download). This is possible via link
as well as via upload.

Each note has different priorities which will overlap each other
depending on their setting. They may have some more specific behavour
(editable in the admin panel). The notes intend to look like a mix
of the classic colorful post-it notes and additional functionality.
The colors are editable by the admin


About targeted End-Users
------------------------
TeamDesk was made for the purpose to be used in office or class rooms,
as well as every place where an amount of 5-30 people come thogether.
Different groups are possible when intended to be used for multiple
groups in one slightly bigger environment. It can be used to provide
short helpful information as well as just for fun. Well at least can do
all what a pinwall can do - just a little bit more.


About Securtiy & Access
-----------------------
Please keep this in mind. TeamDesk was never meant to be secure. It is
a "share all you post" (with almost no limitation) web application.


About the Project
-----------------
Teamdesk was initiated at the beginning of January 2014 and was 
actively developed until August 2015. A first level support employee called
Lamoza Rodrigo gave me (At this time a software apprentice) this task. 
As I've been developing the application more and more ideas came to my mind. 
I asked them to continue the work a little bit longer as initially planed 
and they agreed very quick. 

I (Lucy von Känel) was the only developer until this date and I'm still
the only one. This was my first really big project and one of those
were I've learned a lot. Don't blame me when you don't like the
sourcecode. At the time I've started this project I had absolutely no 
knowledge about Javascript, and Java EE environments. You may notice that
- you would make it partial different as well as I would do it today.


About licencing stuff (from my personal view)
--------------------------------------------
This is it's own story. Scroll down if you're not interested in.
I was not sure which licence I should choose. My intention was to make it 
usuable for free for everyone (including the sourcecode) but I haven't wanted
that someone takes the whole sourcecode and makes some derivates out of it. 
I still wouldn't be happy about that even if you're allowed to do so.
However finnaly I dediced to use the Artistic Licence 2.0. for some reasons.
Well I should say "we" since I made this project at work for the 
Federal Departement of Defence (Switzerland). Luckily they allowed me to
choose a licence and publish this project uder some conditions.


################################################################################
# Installation                                                                 #
################################################################################
I don't got that much time at the moment so I will make it as short as 
possible.

Requirements:
You need a MySQL server, Something like Tomcat (I never tried it with JBoss
or Glassfish), and Java. I would recommend you to use a Linux host. Windows
hosts may have some problems with character encoding.

1.0 
You will find a .sql dump in the /Projectfiles/builds folder

1.1 
Create a mysql database somewhere you want and insert the dump

2.0 
In the same folder you will also find a .war file. This is an almost
working export from eclipse (You need to change a config file)

2.1
The config file which you need to change can be found inside the .war dump.
a.e. Teamdesk_093_build_117.war/WEB-INF/classes/connection.txt
There you have to enter your database settings. Just save the file inside
the .war archiv (7Zip will do the job - you can open it directly)

3.0
Finally place the .war file in the webapps folder of your tomcat installation
and start the server. (May be different with JBoss or Glassfish)

3.1 accecc via <your_hostname/ip>:<port>/<Name_of_the_war_without_extension>
a.e. "server.mydomain:8080/Teamdesk_093_build_117"
(May be different with JBoss or Glassfish)

4.0 I hope you got it :) otherwise you can try to contact me. Depending
on how many time I have left I will answer.


################################################################################
# Licence & Copyright                                                          #
################################################################################

Copyright (C) 2014-2015 Inc. All Rights Reserved.

Federal Departement of Defence, Civil Protection and Sport,
Armed Forces Command Support Organisation

 and 

Lucy von Känel - snow.dream.ch@gmail.com

---------------------------------------------------------------------
This Project (TeamDesk) is subject of the Artistic Licence 2.0.

See LICENCE.txt or https://opensource.org/licenses/Artistic-2.0

The code comes "as is". There is no waranty about it's functionality,
merchantability and / or fitness for a particular purpose. 
No matter if expressed or implied.

---------------------------------------------------------------------
  The licence may differ when explicitly stated in the dependent file
(3th party libraries)