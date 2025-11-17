import express from 'express'
import { protect } from '../middleware/authMiddleware.js';
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from '../controllers/ResumeController.js';
import upload from '../config/multer.js';
import { getAllResumes } from '../controllers/ResumeController.js';

const resumeRouter = express.Router();


resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', protect, upload.single('image'), updateResume);
resumeRouter.get('/', protect, getAllResumes);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', protect, getPublicResumeById);

export default resumeRouter