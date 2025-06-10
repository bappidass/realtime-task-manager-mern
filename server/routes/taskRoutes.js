import express from 'express';
import {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
} from '../controllers/taskController.js';
import { verifyRoutes } from '../middleware/verifyRoutes.js';

const router = express.Router();

router.get('/', verifyRoutes, getTasks);
router.post('/', verifyRoutes,  addTask);
router.patch('/:id/toggle', verifyRoutes , toggleTask);
router.delete('/:id',verifyRoutes, deleteTask);

export default router;
