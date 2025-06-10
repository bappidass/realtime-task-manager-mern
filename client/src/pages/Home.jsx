import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle, Circle, Trash2, Clock, Target, TrendingUp } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import { fetchTasks, createTask, toggleTask, deleteTask } from '../services/taskServies';
import { socket } from '../utils/socket';
import { useAuth } from '../context/AuthContext';


const addSound = new Audio('/sounds/mixkit-correct-answer-tone-2870.wav');

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
   const { logout } = useAuth();
  const [filter, setFilter] = useState('all'); // all, active, completed

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

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Task Manager
                </h1>
                <p className="text-sm text-gray-500">Stay organized, stay productive</p>
              </div>
            </div>
              <button onClick={logout}>Logout</button>
            {/* Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{totalCount}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{progressPercentage}%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-500">{completedCount} of {totalCount} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Add Task Form */}
        <div className="mb-8">
          <form onSubmit={handleAddTask} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="w-full pl-4 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                    placeholder="What needs to be done?"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </button>
            </div>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 inline-flex">
            {[
              { key: 'all', label: 'All Tasks', icon: Target },
              { key: 'active', label: 'Active', icon: Clock },
              { key: 'completed', label: 'Completed', icon: CheckCircle }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === key
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Target className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {filter === 'all' ? 'No tasks yet' : 
                 filter === 'active' ? 'No active tasks' : 
                 'No completed tasks'}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' ? 'Add your first task to get started!' :
                 filter === 'active' ? 'All tasks are completed!' :
                 'Complete some tasks to see them here.'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task._id}
                className="animate-in slide-in-from-top duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskItem
                  task={task}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer Stats for Mobile */}
        <div className="md:hidden mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600">{totalCount}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{progressPercentage}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;