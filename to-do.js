// Local Storage Management Module
class StorageManager {
    // Save tasks to local storage
    static saveTasks(tasks) {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

    // Retrieve tasks from local storage
    static getTasks() {
        const tasks = localStorage.getItem('todoTasks');
        return tasks ? JSON.parse(tasks) : [];
    }
}

// Main Todo App Logic
class TodoApp {
    constructor() {
        // DOM Element References
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.todoList = document.getElementById('todoList');
        this.taskCountSpan = document.getElementById('taskCount');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.filterButtons = document.querySelectorAll('.filter-btn');

        // Tasks Array
        this.tasks = StorageManager.getTasks();

        // Event Listeners
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompletedTasks());

        // Filter Event Listeners
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all buttons
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderTasks(btn.dataset.filter);
            });
        });

        // Initial Render
        this.renderTasks();
    }

    // Adds a new task to the list
    addTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText) {
            const newTask = { text: taskText, completed: false };
            this.tasks.push(newTask);
            StorageManager.saveTasks(this.tasks); // Save to local storage
            this.taskInput.value = ''; // Clear input
            this.renderTasks(); // Re-render tasks
        }
    }

    // Renders the tasks based on the specified filter
    renderTasks(filter = 'all') {
        this.todoList.innerHTML = ''; // Clear the current list

        // Filter tasks based on the active filter
        const filteredTasks = this.tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
        });

        // Render each task
        filteredTasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.className = `todo-list-item ${task.completed ? 'completed' : ''}`;
            listItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="todoApp.toggleComplete(${index})">
            <span class="todo-text">${task.text}</span>
            <button class="delete-task-btn" onclick="todoApp.deleteTask(${index})">Delete</button>
        `;
        
            this.todoList.appendChild(listItem);
        });

        // Update task count
        this.taskCountSpan.textContent = `${filteredTasks.length} tasks`;
    }

    // Toggles the completion status of a task
    toggleComplete(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        StorageManager.saveTasks(this.tasks); // Save updated tasks
        this.renderTasks(); // Re-render tasks
    }

    // Deletes a task from the list
    deleteTask(index) {
        this.tasks.splice(index, 1); // Remove task from array
        StorageManager.saveTasks(this.tasks); // Save updated tasks
        this.renderTasks(); // Re-render tasks
    }

    // Clears all completed tasks from the list
    clearCompletedTasks() {
        this.tasks = this.tasks.filter(task => !task.completed); // Filter out completed tasks
        StorageManager.saveTasks(this.tasks); // Save updated tasks
        this.renderTasks(); // Re-render tasks
    }
}

// Initialize App
const todoApp = new TodoApp();
