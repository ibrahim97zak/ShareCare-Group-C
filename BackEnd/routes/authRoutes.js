import express from 'express';
import { register, login, confirmEmail, logout } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login',login);
router.get('/confirm-email',confirmEmail);
router.post('/logout',authMiddleware,logout);

export default router;