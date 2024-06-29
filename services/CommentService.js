import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Create a new comment
async function createComment(postId, userId, content, parentComment, replyTo) {
    try {
        const newComment = new Comment({
            postId,
            userId,
            content,
            parentComment,
            replyTo
        });

        await newComment.save();

        const post = await Post.findById(postId);
        post.comments.push(newComment);
        await post.save();

        //console.log('Comment created successfully:', newComment);
        return newComment;
    } catch (error) {
        console.error('Error creating comment:', error);
    }
}

// Get comments for a specific post
async function getCommentsForPost(postId, limit, offset) {
    try {
        const comments = await Comment.find({ postId, parentComment: { $exists: false } })
            .sort([['createdAt', -1]])
            .skip(Number(offset))
            .limit(Number(limit))
            .populate('userId', 'username avatar')
            .exec();
        return comments;
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Update a comment's content
async function updateComment(commentId, newContent) {
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
async function deleteComment(commentId) {
    try {
        await Comment.findByIdAndDelete(commentId);
        console.log('Comment deleted successfully');
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
}

async function getNumberOfRepliedComment(commentId) {
    try {
        const count = await Comment.countDocuments({ parentComment: commentId });
        return count;
    } catch (error) {
        console.error('Error get number of replied comments:', error);
    }
}

async function getRepliedComments(commentId) {
    try {
        const comments = await Comment.find({ parentComment: commentId })
            .sort([['createdAt', 1]])
            .populate('userId', 'username avatar')
            .populate('replyTo', 'username avatar')
            .exec();
        console.log('Comments with parentComment:', comments);
        return comments;
    } catch (error) {
        console.error('Error get replied comments:', error);
    }
}

export default {
    createComment,
    updateComment,
    deleteComment,
    getCommentsForPost,
    getNumberOfRepliedComment,
    getRepliedComments
}