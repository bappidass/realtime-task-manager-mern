import Task from '../models/Task.js';


export const getTasks = async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
};

export const addTask = async (req, res) => {
  const { text } = req.body;
  const task = new Task({ text });
  await task.save();
  res.status(201).json(task);
};


export const toggleTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
