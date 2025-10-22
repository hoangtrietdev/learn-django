import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = 'http://localhost:8000/api/tasks/';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");

  useEffect(() => {
    axios.get<Task[]>(API_URL)
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post<Task>(API_URL, { title: newTaskTitle })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTaskTitle("");
      })
      .catch(error => console.error(error));
  };

  const handleToggleComplete = (task: Task) => {
    axios.put<Task>(`${API_URL}${task.id}/`, { ...task, completed: !task.completed })
      .then(response => {
        setTasks(tasks.map(t => t.id === task.id ? response.data : t));
      })
      .catch(error => console.error(error));
  };

  const handleDeleteTask = (id: number) => {
    axios.delete(`${API_URL}${id}/`)
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id));
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-white text-center mb-6">To-Do List</h1>
        <form onSubmit={handleAddTask} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-center items-center w-full pt-6">
            <button
              type="submit"
              className="w-32 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
        <ul className="space-y-3">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center bg-gray-700 rounded-lg p-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
                className="mr-3 w-5 h-5 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
              />
              <span className={`flex-1 text-white ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </span>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="ml-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
