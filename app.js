document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm"); // Form element
    const taskInput = document.getElementById("taskInput"); // Input field
    const taskList = document.getElementById("taskList"); // Task list container

    // Fetch and show tasks
    async function fetchTasks() {
        try {
            const response = await fetch("/api/tasks"); // Get tasks from API
            const tasks = await response.json();
            taskList.innerHTML = ""; // Clear list

            tasks.forEach(task => {
                const li = document.createElement("li"); // New list item
                li.innerHTML = `
                    ${task.name}
                    <button onclick="deleteTask(${task.id})">❌</button> <!-- Delete button -->
                `;
                taskList.appendChild(li); // Add task to list
            });
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    }

    // Add new task
    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const taskName = taskInput.value.trim(); // Get input value

        if (!taskName) return alert("Please enter a task!"); // Stop if empty

        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: taskName }),
            });

            if (response.ok) {
                taskInput.value = ""; // Clear input
                fetchTasks(); // Refresh task list
            } else {
                alert("Failed to add task.");
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    });

    // Delete task
    window.deleteTask = async (id) => {
        try {
            const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
            if (response.ok) {
                fetchTasks(); // Refresh task list
            } else {
                alert("Failed to delete task.");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    fetchTasks(); // Load tasks on page load
});
