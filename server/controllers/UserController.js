
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resume } from "../models/Resume.js";

//generate token function
const generateToken = (userId) => {
    const token = jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}

//Controller for User Registration
//POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        //check for missing fields
        if(!name || !email || !password){
            return res.status(400).json({message: 'Missing Required Fields'})
        }

        //check if users already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User Already Exists'})
        }

        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        //Create New User
        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        //return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined; //remove password from the response

        return res.status(201).json({message: "User Created Successfully", token, user: newUser})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//Contoller for User Login
//POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid Email or Password'})
        }

        //check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        //return success message
        const token = generateToken (user._id);
        user.password = undefined;

        return res.status(201).json({message: "Login Successfully", token, user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//Controller for getting user by Id
//GET: /apo/users/data

export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        //check if user exists
        const user = await User.findOne({userId})
        if(!user){
            return res.status(404).json({message: 'User Not Found'})
        }

        //return user
        user.password = undefined;
        return res.status(200).json({user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


//Contoller for getting User Resume
//GET: /api/users/resumes

export const getUserResumes = async(req,res) => {
    try {
        const userId = req.userId;

        //Return User Resume
        const resumes = await Resume.findOne({userId})
        return res.status(200).json({resumes})
    } catch (error) {
         return res.status(400).json({message: error.message})
    }
}