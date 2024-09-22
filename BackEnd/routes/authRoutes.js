import express from 'express';
const authRouter = express.Router();
import { register, login, forgotPassword, resetPassword, verifyEmail, getCurrentUser, changePassword, logout, deleteAccount} from '../controllers/authController.js'; // import authController from '../controllers/authController';
import { validateRegistration, validateLogin, validatePasswordReset } from '../validators/userValidator.js';
import auth from '../middlewares/authMiddleware.js';

// Public routes
authRouter.post('/register', validateRegistration, register);
authRouter.post('/login', validateLogin, login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', validatePasswordReset, resetPassword);
authRouter.get('/verify-email/:token', verifyEmail);

// Protected routes
authRouter.get('/me', auth, getCurrentUser);
authRouter.put('/change-password', auth, validatePasswordReset, changePassword);
authRouter.post('/logout', auth, logout);
authRouter.delete('/delete-account', auth, deleteAccount);


export default authRouter;