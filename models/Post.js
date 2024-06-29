import mongoose, { Schema } from "mongoose";
import Comment from "./Comment.js";

const postSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    content: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'Users', required: true }],
    images: [{
        type: String,
        required: true
    }],
    comments: [Comment.schema],
    isHide: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Post = mongoose.model('Posts', postSchema);
export default Post;