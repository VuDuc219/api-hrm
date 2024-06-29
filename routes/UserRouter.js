// const express = require('express')
// const router = express.Router()
// const UserController = require("../controllers/UserController")
import express from 'express';
const router = express.Router();
import UserController from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';
import UserService from '../services/UserService.js';

// Configure multer storage and file filter
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/users/'); // Specify the destination folder
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname); // Specify the file name
    }
  });
  
const fileFilter = (req, file, cb) => {
// Accept only image files
if (file.mimetype.startsWith('image/')) {
    cb(null, true);
} else {
    cb(new Error('Please upload only images'), false);
}
};

// Create an upload instance
const upload = multer({storage, fileFilter});

router.post('/register',UserController.createUser);
router.post('/login', UserController.login);
router.get('/user-info',authMiddleware, UserController.getUserInfoByAccessToken);
router.get('/analytic/:userId', UserController.getUserAnalysticNumber);
router.patch('/user-basic-update', authMiddleware, upload.single('image'), UserController.updateUserBasicInfo);
router.get('/public-user-info/:userId', UserController.getUserInfoById)
router.get('/getMatchedUsers', authMiddleware, UserController.getMatchedUsers)
router.post('/send-match-request', authMiddleware, UserController.sendMatchRequest);
router.get('/user-search/:keyword', UserController.searchUsers);
router.get('/request-matches/:id', authMiddleware, UserController.getAllRequestMatches)
router.post('/request-matches', authMiddleware, UserController.accRequestMatch)
router.post('/delete-request-matches', authMiddleware, UserController.deleteRequestMatch)
router.get('/get-friends-list/:userId', authMiddleware, UserController.getAllFriends)
router.get('/admin-get-all-user', UserController.getAllUserAdmin)
router.post('/admin-ban-user', UserController.updateIsBan)
router.post('/reset-password', UserController.insertUuid)
router.post('/update-password', UserController.updatePassword)
router.post('/send-match-request', authMiddleware, UserController.sendMatchRequest)

//lite api for prm
router.get('/findFriendo/:userId/:keyWord', UserController.findFriendBykeyWord)

export default router