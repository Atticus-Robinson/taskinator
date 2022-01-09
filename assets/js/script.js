var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector('#tasks-to-do');
var taskIdCounter = 0;
var pageConentEl = document.querySelector("#page-content");
var tasksInProgressE1 = document.querySelector("#tasks-in-progress");
var tasksCompletedE1 = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {

    //Prevent browser from resetting
    event.preventDefault();

    //Store info from form input into vars
    var taskNameInput = document.querySelector("input[name= 'task-name']").value;
    var taskTypeInput = document.querySelector("select[name= 'task-type']").value;

    //If either inputs are blank
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form");
        return false;
    }

    formE1.reset();

    //Returns true or false if task form already has task id
    var isEdit = formE1.hasAttribute("data-task-id");

    //If true, store task id, call edit funtion
    if (isEdit) {
        var taskId = formE1.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    //Else store form info into taskDataObj for use in new task creation
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
    }

    //Run task creation with data obj with stored form data
    createTaskE1(taskDataObj);
}

var createTaskE1 = function(taskDataObj) {

    var listItemE1 = document.createElement("li");
    listItemE1.className = "task-item";

    listItemE1.setAttribute("data-task-id", taskIdCounter);

    var taskInfoE1 = document.createElement("div");

    taskInfoE1.className = "task-info";

    taskInfoE1.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class ='task-type'>" + taskDataObj.type + "</span>";

    listItemE1.appendChild(taskInfoE1);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    saveTasks();

    var taskActionsE1 = createTaskActions(taskIdCounter);
    listItemE1.appendChild(taskActionsE1);

    tasksToDoE1.appendChild(listItemE1);

    taskIdCounter++;

}

var createTaskActions = function(taskId) {
    var actionContainerE1 = document.createElement("div");
    actionContainerE1.className = "task-actions";

    var editButtonE1 = document.createElement("button");
    editButtonE1.textContent = "Edit";
    editButtonE1.className = "btn edit-btn";
    editButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(editButtonE1);

    var deleteButtonE1 = document.createElement("button");
    deleteButtonE1.textContent = "Delete";
    deleteButtonE1.className = "btn delete-btn";
    deleteButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(deleteButtonE1);

    var statusSelectE1 = document.createElement("select");
    statusSelectE1.className = "select-status";
    statusSelectE1.setAttribute("name", "status-change");
    statusSelectE1.setAttribute("data-task-id", taskId);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionE1 = document.createElement("option");
        statusOptionE1.textContent = statusChoices[i];
        statusOptionE1.setAttribute("value", statusChoices[i]);

        statusSelectE1.appendChild(statusOptionE1);
    }

    actionContainerE1.appendChild(statusSelectE1);

    return actionContainerE1;
}

var taskButtonHandler = function(event) {
    var targetE1 = event.target;
 
    if (targetE1.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }

    else if (targetE1.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
}

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //Create a new array to hold updated list of tasks
    var updatedTaskArr = [];

    //Loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //If tasks[i] doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    tasks = updatedTaskArr;

    saveTasks();
}

var editTask = function(taskId) {    
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent = "Save Task";

    formE1.setAttribute("data-task-id", taskId);
}

var completeEditTask = function(taskName, taskType, taskId) {
    //Find list item matching taskId
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //Set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //Loop though tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    saveTasks();
    alert("Task Updated");

    //Reset form data; task id and button change
    formE1.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var tasksStatusChangeHandler = function(event) {
    //Get the item's task id
    var taskId = event.target.getAttribute("data-task-id");

    //Get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    //Find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoE1.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressE1.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedE1.appendChild(taskSelected);
    }

    //Update task's status in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
}

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");
    console.log(savedTasks);

    if (!savedTasks) {
        return false;
    }

    tasks = JSON.parse(tasks);
}

formE1.addEventListener("submit", taskFormHandler);
pageConentEl.addEventListener("click", taskButtonHandler);
pageConentEl.addEventListener("change", tasksStatusChangeHandler);

loadTasks();