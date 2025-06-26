import mongoose from "mongoose";

const postSchema=new mongoose.Schema(
    {
        userId:{
            type: String,
            required: true,
        },
        content:{
            type: String,
            required: true,
        },
        title:{
            type: String,
            required: true,
            unique: true,
        },
        image:{
            type: String,
            default: 'https://soliloquywp.com/wp-content/uploads/2016/08/How-to-Set-a-Default-Featured-Image-in-WordPress.png',
        },
        category:{
            type: String,
            default: 'uncategorized',
        },
        slug:{
            type: String,
            required: true,
            unique:true,
        },
    }, {timestamps:true}
);

const Post=mongoose.model('Post', postSchema);
export default Post;