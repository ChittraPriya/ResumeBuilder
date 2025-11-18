import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { userRouter } from './routes/UserRoutes.js';
import resumeRouter from './routes/ResumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';


const app = express();
const PORT = process.env.PORT || 3000;

//DataBase Connection
await connectDB();

//Middleware
app.use(express.json())
app.use(cors());


//Route
app.get('/', (req,res)=> res.send("Server is Live..."))
app.use('/api/users',userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})