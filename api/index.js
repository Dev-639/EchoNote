import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postRoutes from './routes/post.route.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js'; 
import commentRoutes from './routes/comment.route.js';
import path from 'path';

dotenv.config();


const app=express();
app.use(express.json());
app.use(cookieParser());


mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.log(err);
})

const __dirname=path.resolve(); 

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
});

app.use((err, req, res, next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
});

app.listen(3000, ()=>{
    console.log("Server is Running on port 3000");
})