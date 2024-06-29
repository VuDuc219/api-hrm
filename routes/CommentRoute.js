import express from 'express';
const router = express.Router();
import { authMiddleware } from '../middleware/authMiddleware.js';
import CommentController from '../controllers/CommentController.js';

//gets
router.get('/all-from/:postId', CommentController.getCommentsForPost);
router.get('/count-reply/:commentId', CommentController.getNumberOfRepliedComment);
router.get('/all-reply-from/:commentId', CommentController.getRepliedComments);

//posts
router.post('/post-comment',authMiddleware, CommentController.createComment);

export default router;