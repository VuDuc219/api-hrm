import express from 'express';
const router = express.Router();
import { postController } from '../controllers/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/posts/')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.author + Date.now() + file.originalname);
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})


router.post('/', authMiddleware, upload.array("images", 10), postController.createPost)
    .get('/', authMiddleware, postController.getPosts)
    .delete('/:id', postController.deletePost)
router.get('/all-from/:userId/:isUserLogin', postController.getPostsByUserId)
    .patch('/:id', postController.editPost)
    .post('/favorite/:id', authMiddleware, postController.handleLike)
    .delete('/favorite/:id', authMiddleware, postController.handleDislike)
    .post('/de-favorite/:id', authMiddleware, postController.handleDislike)
    .get('/:postId', postController.getPostById)
    .post('/mode/:postId', authMiddleware, postController.changePostMode)
export default router