import express from 'express';
const router = express.Router();
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { VideoController } from '../controllers/index.js';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/videos/')
    },
    filename: function (req, file, cb) {
        cb(null, req.userId + Date.now() + file.originalname);
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    }
})


router.post('/', authMiddleware, upload.single("video"), VideoController.uploadStory)
    .delete('/:storyId', authMiddleware, VideoController.deleteStory)
    .get('/', authMiddleware, VideoController.getStory)
    .post('/like', authMiddleware, VideoController.likeVideo)
    .post('/video', authMiddleware, VideoController.viewVideo)
    .get('/viewed/:id', authMiddleware, VideoController.getViewer)
    .get('/all-from/:userId', VideoController.getAllStoryOfUser)
export default router