function switchTab(tab) {
    var workInProgressTab = document.getElementById("workInProgressTab");
    var completedTab = document.getElementById("completedTab");
    var workInProgressList = document.getElementById("workInProgressList");
    var completedList = document.getElementById("completedList");
    var clearCompletedBtn = document.getElementById("clearCompletedBtn"); // Get the clear button

    if (tab === "workInProgress") {
        workInProgressList.style.display = "block";
        completedList.style.display = "none";
        workInProgressTab.classList.add("active");
        completedTab.classList.remove("active");
        clearCompletedBtn.style.display = "none"; // Hide the clear button
    } else {
        workInProgressList.style.display = "none";
        completedList.style.display = "block";
        workInProgressTab.classList.remove("active");
        completedTab.classList.add("active");
        clearCompletedBtn.style.display = "block"; // Show the clear button
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var addTaskBtn = document.getElementById("addTaskBtn");
    var taskInput = document.getElementById("taskInput");
    var workInProgressList = document.getElementById("workInProgressList");
    var completedList = document.getElementById("completedList");
    var clearCompletedBtn = document.getElementById("clearCompletedBtn");
    var taskList = document.getElementById("taskList");

    addTaskBtn.addEventListener("click", addTask);
    clearCompletedBtn.addEventListener("click", clearCompletedTasks);
    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    // Load tasks from local storage
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function(task) {
        addTaskToList(task.task, task.completed);
    });

    function addTaskToList(taskText, completed) {
        var li = document.createElement("li");
        var taskTextSpan = document.createElement("span");
        taskTextSpan.textContent = taskText;
        taskTextSpan.classList.add("task-text");
        li.appendChild(taskTextSpan);

        if (completed) {
            completedList.appendChild(li);
        } else {
            workInProgressList.appendChild(li);
        }

        li.addEventListener("click", function(event) {
            taskTextSpan.contentEditable = true;
            taskTextSpan.focus();
        });

        taskTextSpan.addEventListener("blur", function() {
            if (taskTextSpan.textContent.trim() === "") {
                var deleteTask = confirm("You left this field empty. Would you like to delete this task?");
                if (deleteTask) {
                    li.remove();
                    updateLocalStorage();
                } else {
                    taskTextSpan.contentEditable = true;
                    taskTextSpan.focus();
                }
            } else {
                updateLocalStorage();
            }
        });

        var completeButton = document.createElement("button");
        completeButton.innerHTML = "&#10004;"; // Tick icon
        completeButton.classList.add("complete-task-btn");
        completeButton.addEventListener("click", function(event) {
            event.stopPropagation(); // Prevent task row click event when clicking complete button
            if (completed) {
                li.remove(); // Remove the task from the DOM
            } else {
                completedList.appendChild(li); // Move the task to the completed list
            }
            updateLocalStorage(); // Update local storage
        });
        li.appendChild(completeButton);

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "&#8722;"; // Minus icon
        deleteButton.classList.add("delete-task-btn");
        deleteButton.addEventListener("click", function(event) {
            event.stopPropagation(); // Prevent task row click event when clicking delete button
            li.remove(); // Remove the task from the DOM
            updateLocalStorage(); // Update local storage
        });
        li.appendChild(deleteButton);
    }

    function addTask() {
        var task = taskInput.value.trim();
        if (task === "") return;

        addTaskToList(task, false); // New tasks are not completed by default
        updateLocalStorage();

        taskInput.value = "";
    }

    function updateLocalStorage() {
        var tasks = [];
        var taskElements = document.querySelectorAll("#workInProgressList .task-text, #completedList .task-text");
        taskElements.forEach(function(taskElement) {
            tasks.push({ task: taskElement.textContent, completed: taskElement.parentNode.parentNode.id === "completedList" });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function clearCompletedTasks() {
        completedList.innerHTML = ""; // Clear completed tasks list
        updateLocalStorage(); // Update local storage
    }

    // Initial tab setup
    switchTab("workInProgress");
});
