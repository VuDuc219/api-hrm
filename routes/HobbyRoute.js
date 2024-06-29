import express from 'express';
import HobbyController  from '../controllers/HobbyController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

//gets
// router.get('/:keyWord', HobbyController.getAllHobbyByKeyWord)
router.get('/', HobbyController.getAllHobby)
router.post('/add-user',authMiddleware, HobbyController.testPostman);
router.get('/get-user', authMiddleware, HobbyController.getAllUser);
router.get('/get-user/:user_id', HobbyController.getUserByID);
router.patch('/update-user', HobbyController.updateUserBasicInfo);
router.patch('/update-password', HobbyController.updatePassword);
router.patch('/update-is-ban', HobbyController.updateIsBan);
router.post('/login', HobbyController.login);
// router.post('/get-user-', HobbyController.login);

export default router;