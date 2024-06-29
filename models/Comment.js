import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    content: {
        type: String,
        required: true
    },
    parentComment: {type: Schema.Types.ObjectId, ref: 'Comments'},
    replyTo: { type: Schema.Types.ObjectId, ref: 'Users'},
    liked: [{ type: Schema.Types.ObjectId, ref: 'Users', required: true }]
}, {
    timestamps: true,
});

const Comment = mongoose.model('Comments', commentSchema);
export default Comment;