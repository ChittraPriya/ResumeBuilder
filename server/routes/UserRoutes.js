import express from 'express';
import { registerUser } from '../controllers/UserController.js';
import { loginUser } from '../controllers/UserController.js';
import { getUserById } from '../controllers/UserController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getUserResumes } from '../controllers/UserController.js';


export const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes);



