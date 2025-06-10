import React from 'react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex justify-between items-center p-2 border rounded-lg bg-white shadow-sm">
      <div
        onClick={() => onToggle(task._id)}
        className={`cursor-pointer select-none ${task.completed ? 'line-through text-blue-200' : ''}`}
      >
        {task.text}
      </div>
      <button
        onClick={() => onDelete(task._id)}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  );
};

export default TaskItem;
