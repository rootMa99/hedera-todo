import React, { useState } from "react";
import { createTodo, getAllTodos, createTodoFile } from "./hedera";

function TodoApp() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [fileId, setFileId] = useState(null);

    const handleAddTask = async () => {
        if (!fileId) {
            alert("File ID not set. Create the ToDo file first.");
            return;
        }

        try {
            await createTodo(fileId, task);
            alert("Task added successfully");
        } catch (error) {
            console.error("Error adding task:", error);
            alert(`Error adding task: ${error.message}`);
        }
    };

    const handleGetAllTasks = async () => {
        if (!fileId) {
            alert("File ID not set. Create the ToDo file first.");
            return;
        }

        try {
            const allTasks = await getAllTodos(fileId);
            setTasks(allTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            alert(`Error fetching tasks: ${error.message}`);
        }
    };

    const handleCreateFile = async () => {
        try {
            const newFileId = await createTodoFile();
            setFileId(newFileId.toString());
            alert(`New file created with ID: ${newFileId}`);
        } catch (error) {
            console.error("Error creating file:", error);
            alert(`Error creating file: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Hedera ToDo App</h1>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="New Task"
            />
            <button onClick={handleAddTask}>Add Task</button>
            <button onClick={handleGetAllTasks}>Get All Tasks</button>
            <button onClick={handleCreateFile}>Create ToDo File</button>

            <h2>ToDo List</h2>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                ))}
            </ul>
        </div>
    );
}

export default TodoApp;
