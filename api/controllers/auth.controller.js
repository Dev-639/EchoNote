import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password }=req.body;
    if(!username || !email || !password || email==='' || username==='' || password===''){
        return next(errorHandler(400, 'All feilds are Required.'));
    }
    
    const hashedPassword= bcryptjs.hashSync(password, 10);

    const newUser=new User({
        username,
        email,
        password: hashedPassword,

    })
    try {
        await newUser.save();
        res.json('signup successful');
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return next(errorHandler(400, `${field} "${value}" already exists.`));
        }
            return next(errorHandler(500, 'Something went wrong, please try again.'));

    }
};

export const signin=async(req, res, next)=>{
    const {email, password}=req.body;
    if(!email ||!password || email==='' || password===''){
        return next(errorHandler(400, 'All Fields Required.'));
    }
    try {
        const validUser=await(User.findOne({email}));
        if(!validUser){
            return next(errorHandler(404, 'User does not exist.'))
        }
        const validPassword=bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(404, 'Incorrect Password'));
        }
        const token=jwt.sign({ id : validUser._id, isAdmin: validUser.isAdmin}, process.env.JWT_SECRET);
        
        const {password:pass,...rest}=validUser._doc;

        res.status(200).cookie('access_token', token, { 
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            }).json({
            success: true,
            user: rest,
        });
    } catch (error) {
        return next(error);
    }
};

export const google=async(req, res, next)=>{
    const {email, name, googlePhotoUrl}=req.body;
    try {
        const user=await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
            const{ password, ...rest}= user._doc;
            res.status(200).cookie('access_token', token, {
                httpsOnly: true,
            }).json(rest);
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) +Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser=new User({
                username: name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token=jwt.sign({id:newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET);
            const {password, ...rest}=newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
            }).json({
                success: true,
                user: rest,
            });
        }

    } catch (error) {
        next(error);
    }
}