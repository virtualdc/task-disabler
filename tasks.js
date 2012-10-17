// Some settings
var rootPath = "test";
var tasksFileName = "DisabledTasks.txt";


// Connect to the TaskScheduler
var scheduler = WScript.CreateObject("Schedule.Service");
scheduler.Connect();


// Get all tasks in folder
function TasksInFolder(folder) {
    var res = [];
    // Enumerate tasks in the current folder
    var tasks = folder.GetTasks(0);
    for (var i=1; i<=tasks.Count; i++) {
        res.push(tasks.Item(i));
    }

    // Dive into subfolders
    var folders = folder.GetFolders(0);
    for (var i=1; i<=folders.Count; i++) {
        res = res.concat(TasksInFolder(folders.Item(i)));
    }

    return res;
}


// Disable all tasks and store list of them to the file
function DisableAllTasks() {
    // Create an output file
    var fs = WScript.CreateObject("Scripting.fileSystemObject")
    var outFile = fs.CreateTextFile(tasksFileName, false);

    // Save all enabled tasks to the output file
    var cnt = 0;
    var tasks = TasksInFolder(scheduler.GetFolder(rootPath));
    for (var i in tasks) {
        var task = tasks[i];
        if (task.Enabled) {
            outFile.WriteLine(task.Path);
            task.Enabled = false;
            cnt++;
        }
    }

    outFile.close();

    WScript.Echo(cnt + " tasks disabled.");
}


// Read tasks from the file and enable them
function EnableAllTasks() {
    // Create an output file
    var fs = WScript.CreateObject("Scripting.fileSystemObject");
    var inFile = fs.OpenTextFile(tasksFileName);

    // Get access to the root folder
    var rootFolder = scheduler.GetFolder("");

    // Read lines from file and enable tasks
    var cnt = 0;
    while (!inFile.AtEndOfStream) {
        var taskName = inFile.ReadLine();
        var task = rootFolder.GetTask(taskName);
        task.Enabled = true;
        cnt++;
    }

    inFile.close();
    fs.GetFile(tasksFileName).Delete();

    WScript.Echo(cnt + " tasks enabled.");
}


// Command line processing
if (WScript.Arguments.Length == 1) {
    var command = WScript.Arguments.Item(0);
    if (command == "/disable") {
        DisableAllTasks();
        WScript.Quit(0);
    }
    if (command == "/enable") {
        EnableAllTasks();
        WScript.Quit(0);
    }
}
WScript.Echo("tasks.js (/enable | /disable)\n" +
             "disable - disable all tasks and store them to the file\n" +
             "enable  - read task list from the file and enable them");

