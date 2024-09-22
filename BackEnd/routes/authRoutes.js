import express from 'express';
const authRouter = express.Router();
import { register, login, forgotPassword, resetPassword, verifyEmail, getCurrentUser, changePassword, logout, deleteAccount} from '../controllers/authController.js'; // import authController from '../controllers/authController';
import { validateRegistration, validateLogin, validatePasswordReset , validateChangePassword} from '../validators/userValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';

// Public routes
authRouter.post('/register', validateRegistration, register);
authRouter.post('/login', validateLogin, login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', validatePasswordReset, resetPassword);
authRouter.get('/verify-email/:token', verifyEmail);

// Protected routes
authRouter.get('/me', authMiddleware, getCurrentUser);
authRouter.put('/change-password', authMiddleware, validateChangePassword, changePassword);
authRouter.post('/logout', authMiddleware, logout);
authRouter.delete('/delete-account/:id', deleteAccount);


export default authRouter;