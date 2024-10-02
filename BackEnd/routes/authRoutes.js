import express from 'express';
const authRouter = express.Router();
import { register, confirmEmail, login, resetPassword, getProfile, changePassword, logout} from '../controllers/authController.js'; // import authController from '../controllers/authController';
import { validateRegistration, validateLogin, validatePasswordReset , validateChangePassword} from '../validators/userValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';

// Public routes
authRouter.post('/register', validateRegistration, register);
authRouter.post('/login', validateLogin, login);
authRouter.get('/confirm-email', authMiddleware, confirmEmail);
authRouter.post('/reset-password/:token', validatePasswordReset, resetPassword);


// Protected routes
authRouter.get('/me', authMiddleware, getProfile);
authRouter.put('/change-password', authMiddleware, validateChangePassword, changePassword);
authRouter.post('/logout', authMiddleware, logout);


export default authRouter;