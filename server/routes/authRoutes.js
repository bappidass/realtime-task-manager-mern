import express from 'express';
import { registerUser, loginUser,verifyUser } from '../controllers/authController.js';
import { verifyRoutes } from '../middleware/verifyRoutes.js';

const router = express.Router();

router.get('/me', verifyRoutes, verifyUser); 
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
