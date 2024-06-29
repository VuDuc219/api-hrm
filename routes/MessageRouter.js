// const express = require('express');
// const MessageController = require('../controllers/messageController');
// const { authMiddleware } = require('../middleware/authMiddleware');

import express from 'express';
import MessageController from '../controllers/messageController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/create-message', MessageController.createMessage);
router.get('/get-messages/:conversationId', MessageController.getMessages);

export default router;