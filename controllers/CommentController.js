import CommentService from "../services/CommentService.js";
import UserService from "../services/UserService.js";

// Create a new comment
async function createComment(req,res) {
    try {
        const token = req.headers.token.split(' ')[1];
        const { postId, content, parentComment, replyTo} = req.body
        const user = await UserService.getUserInfoByAccessToken(token);

        if(!user){
            return res.status(400).json({ error: 'userId is required' });
        }
        
        const userId = user.data._id;
        const newComment = await CommentService.createComment(postId, userId, content, parentComment, replyTo);

        return res.status(200).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
    }
}

// Get comments for a specific post
async function getCommentsForPost(req,res) {
    try {
        const postId= req.params.postId;
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;
        const comments = await CommentService.getCommentsForPost(postId, limit, offset);

        return res.status(200).json({
            message: "get comments success",
            data: comments
        })
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Update a comment's content
async function updateComment(req,res) {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content: newContent },
            { new: true }
        );
        console.log('Comment updated successfully:', updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
    }
}

// Delete a comment
async function deleteComment(req,res) {
    try {
        await Comment.findByIdAndDelete(commentId);
        console.log('Comment deleted successfully');
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
}

async function getNumberOfRepliedComment(req,res) {
    try{
        const commentId = req.params.commentId;
        const numberOfRepliedComment = await CommentService.getNumberOfRepliedComment(commentId);
        return res.status(200).json(numberOfRepliedComment);
    } catch(error) {
        console.error('Error get number of replied comments:', error);
    }
}

async function getRepliedComments(req, res) {
    try{
        const commentId = req.params.commentId;
        const repliedComments = await CommentService.getRepliedComments(commentId);
        return res.status(200).json(repliedComments);
    } catch(error) {
        console.error('Error get replied comments:', error);
    }
}

export default{
    createComment,
    updateComment,
    deleteComment,
    getCommentsForPost,
    getNumberOfRepliedComment,
    getRepliedComments
}