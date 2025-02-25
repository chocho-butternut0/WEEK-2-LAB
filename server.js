const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Array to store tasks and initial taskId
let tasks = [];
let taskId = 1;

// API endpoint to get all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// API endpoint to create a new task
app.post('/api/tasks', (req, res) => {
    console.log("Received data:", req.body);
    const { name } = req.body;  

    if (!name) return res.status(400).json({ error: "Task name is required" });

    const newTask = { id: taskId++, name, completed: false }; 
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// API endpoint to update a task's completion status
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const task = tasks.find(task => task.id === parseInt(id));

    if (task) {
        task.completed = completed;
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// API endpoint to delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(task => task.id !== parseInt(id));
    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
