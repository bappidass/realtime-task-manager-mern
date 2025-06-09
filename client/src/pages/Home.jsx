import React, { useEffect, useState } from 'react';
import TaskItem from '../components/TaskItem';
import { fetchTasks, createTask, toggleTask, deleteTask } from '../services/taskServies';
import { socket } from '../utils/socket';
const addSound = new Audio('/sounds/mixkit-correct-answer-tone-2870.wav');


const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

useEffect(() => {
  socket.on('task-added', (task) => {
    setTasks((prev) => [task, ...prev]);
    addSound.play();
  });

  socket.on('task-toggled', (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    addSound.play();
  });

  socket.on('task-deleted', (taskId) => {
    setTasks((prev) => prev.filter((task) => task._id !== taskId));
    addSound.play();
  });

  return () => {
    socket.off('task-added');
    socket.off('task-toggled');
    socket.off('task-deleted');
  };
}, []);


  const loadTasks = async () => {
    const res = await fetchTasks();
    setTasks(res.data);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const res = await createTask(newTask);
    setTasks((prev) => [res.data, ...prev]);
    socket.emit('new-task', res.data);
    setNewTask('');
   
  };

  const handleToggle = async (id) => {
    await toggleTask(id);
    setTasks((prev) =>
      prev.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task
      )
    );
    socket.emit('toggle-task', id);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task._id !== id));
    socket.emit('delete-task', id);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4">📝 Real-Time Task Manager</h1>
      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow border p-2 rounded-md"
          placeholder="Add a new task..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-md">
          Add
        </button>
      </form>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
