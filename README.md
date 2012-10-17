#Introduction
This simple script useful if you have quite a few tasks in the Windows Task Scheduler and
sometimes want to temporary disable them (for example for system maintenance or upgrades).

#How to use
1) Put Task Scheduler's folder, that you want to control, into the rootPath variable;
2) Run "tasks.js /disable" to disable all tasks;
3) Reboot or play with your system in other ways;
3) Run "tasks.js /enable" to reenable disabled tasks.

#System requirements
Windows Server 2008 or higher.
