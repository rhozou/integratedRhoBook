There are three Makefile-type files in this directory:

 - Makefile is a top-level Makefile that can be used as-is to build
   your system (operating system) kernel test file as well as your
   user-level test programs.

 - Makefile.sys is a *TEMPLATE* for a Makefile that can be used to
   build your system (operating system) kernel test file.
 
 - Makefile.user is a *TEMPLATE* for a Makefile that can be used to
   build your user-level test programs.

Please copy these three files to your own directory in order to use them.

Also, please read the comments at the top of each of these three files
for more information on how to use them.  In particular, you *MUST*
modify your copy of each of Makefile.sys and Makefile.user, as 
described in the comments at the top of each file.


In addition to these three Makefile-type files, this directory also
contains the source code to one simple example user-level test program.
This program, in the source file pingpong.c, sends a sequence of
"ping-pong" messages back and forth between two RedNet processes.
Please see comments at the top of the source file, and the source code
itself, for more information.
