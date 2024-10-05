import React, { useState } from 'react';
import { createTodo, getAllTodos } from './hedera';

const TodoApp = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!task) return; // Prevent adding empty tasks
    try {
      await createTodo(task);
      setTask(''); // Clear input field
      await handleGetAllTasks(); // Refresh the todo list
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleGetAllTasks = async () => {
    try {
      const allTodos = await getAllTodos();
      setTodos(allTodos);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div>
      <h1>ToDo App</h1>
      <form onSubmit={handleAddTask}>
        <input 
          type="text" 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          placeholder="Add a new task" 
        />
        <button type="submit">Add Task</button>
      </form>
      <h2>Your Tasks</h2>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
      <button onClick={handleGetAllTasks}>Get All Tasks</button>
    </div>
  );
};

export default TodoApp;
