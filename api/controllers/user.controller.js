import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.json({ message: "This message is from routes" });
};

export const updateUser= async(req, res, next)=>{
    if(req.user.id!== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    if(req.body.password){
        if(req.body.password.length<6){
            return next(errorHandler(400, "Password must be atleast 6 character"));
        }
        req.body.password=bcryptjs.hashSync(req.body.password, 10);
    }
    if(req.body.username){
        if(req.body.username.length<7 || req.body.username.length>20){
            return next(errorHandler(400, "Useername must be between 7 to 20 characters."));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, "Username cannot contains spaces"));
        }
        if(req.body.username!== req.body.username.toLowerCase()){
            return next(errorHandler(400, "Username must only contain lower case character."));    
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, "Usrname can only contain numbers and letter"));
        }
    }
    try{
        const updatedUser= await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        }, { new: true});
        const {password, ...rest} =updatedUser._doc;
        res.status(200).json(rest);
    }
    catch(error){
        next(error);
    }
};
export const deleteUser=async(req, res, next)=>{
    if( !req.user.isAdmin && req.user._id !== req.params.userId){
        return next(errorHandler(403, "You are not allowed to delete this User."));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}

export const signout=(req, res, next)=>{
    try {
        res.clearCookie('access_token'). status(200).json('User has been signed out.');
    } catch (error) {
        next(error);
    }
};

export const getUsers=async(req, res, next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to access this page.'))
    }
    try {
        const startIndex=parseInt(req.query.startIndex)||0;
        const limit=parseInt(req.query.limit) ||9;
        const sortDirection=req.query.sort === 'asc' ?1 :-1;

        const users =await User.find()
        .sort({ createdAt: sortDirection})
        .skip(startIndex)
        .limit(limit);

        const userWithoutPassword= users.map((user)=>{
            const {password, ...rest}=user._doc;
            return rest;
        });
        
        const totalUsers=await User.countDocuments();

        const now=new Date();

        const oneMonthAgo= new Date(    
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate(),
        );
        const lastMonthUsers=await User.countDocuments({
            createdAt: { $gte: oneMonthAgo},
        });

        res.status(200).json({
            users: userWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });

    } catch (error) {
        next(error);
    }
}


export const getUser=async(req,res,next)=>{
    try {
        const user=await User.findById(req.params.userId);
        if(!user){
            return next(errorHandler(404, 'User not found'));
        }
        const{password, ...rest}=user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}