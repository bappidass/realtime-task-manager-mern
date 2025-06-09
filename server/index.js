import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('new-task', (task) => {
    socket.broadcast.emit('task-added', task);
  });

  socket.on('toggle-task', (taskId) => {
    socket.broadcast.emit('task-toggled', taskId);
  });

  socket.on('delete-task', (taskId) => {
    socket.broadcast.emit('task-deleted', taskId);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
