import express from 'express';
import { notificationController } from '../controllers/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/:id', authMiddleware, notificationController.getAllNotifications);
router.post('/add-notification', authMiddleware, notificationController.insertNotification);
router.post('/update-notification-status/:id', authMiddleware, notificationController.updateNotificationStatus);

export default router;