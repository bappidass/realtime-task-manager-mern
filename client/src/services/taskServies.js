
import {API}  from '../api/axios'

export const fetchTasks = () => API.get('/tasks');
export const createTask = (text) => API.post('/tasks', { text });
export const toggleTask = (id) => API.patch(`/tasks/${id}/toggle`);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
