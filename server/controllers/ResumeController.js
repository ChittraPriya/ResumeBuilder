import mongoose from 'mongoose';
import imagekit from '../config/imageKit.js';
import { Resume } from "../models/Resume.js";
import fs from 'fs';



//controller for creating new Resume
//POST: /api/resumes/create

export const createResume = async(req,res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        //create new resume
        const newResume = await Resume.create({userId, title})
        
        //return success message
         return res.status(201).json({message: 'Resume Created Successfully', resume: newResume})

    } catch (error) {
         return res.status(400).json({message: error.message})
    }
}

//controller for getting resume
//GET: /

export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.status(200).json({ resumes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



//controller for deleting resume
//DELETE: /api/resume/delete

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID format' });
    }

    const deletedResume = await Resume.findOneAndDelete({ userId, _id: resumeId });

    if (!deletedResume) {
      return res.status(404).json({ message: 'Resume not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return res.status(500).json({ message: 'Server error deleting resume' });
  }
};

//get user resume by Id
//GET: /api/resumes/get
export const getResumeById = async(req,res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        const resume = await Resume.findOne({userId, _id: resumeId}) 

        if(!resume){
            return res.status(404).json({message: 'Resume not Found'})
        }
        resume._v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;
        
        return res.status(200).json({resume})

    } catch (error) {
         return res.status(400).json({message: error.message})
    }
}

//get resume by id public
//GET: /api/resume/public

export const getPublicResumeById = async (req, res) =>{
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({public: true, _id: resumeId})

        if(!resume){
            return res.status(404).json({message: 'Resume not Found'})
        }

        return res.status(200).json({resume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//controller for updating a resume
//PUT: /api/resumes/update
export const updateResume = async(req,res) => {
    try {
        const userId = req.userId;
        const {resumeId, resumeData, removeBackground} = req.body;
        const image = req.file;

        let resumeDataCopy;
        if(typeof resumeData === 'string'){
            resumeDataCopy = await JSON.parse(resumeData)
        } else{
            resumeDataCopy = structuredClone(resumeData)
        }

        if(image){
            const imageBufferData = fs.createReadStream(image.path)

            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
                }
            });
            resumeDataCopy.personal_info.image = response.url
        }

        const resume = await Resume.findByIdAndUpdate ({_id: resumeId, userId}, resumeDataCopy, {new: true});

        return res.status(200).json({message: 'Saved Successfully', resume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}