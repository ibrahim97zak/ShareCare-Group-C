import express from 'express';
import { register, confirmEmail, login, logout, getCurrentUser } from '../controllers/authController.js'; 
import * as validators from '../validators/AuthValidation.js';
import validation from '../validators/validation.js';
import { asyncHandler } from "../utils/errorHandler.js";

const router = express.Router();

router.post('/register', validation(validators.signupSchema), asyncHandler(register));
router.post('/login', validation(validators.loginSchema), asyncHandler(login));
router.get('/confirm-email', validation(validators.confirmEmailSchema), confirmEmail);
router.post('/logout', logout);
router.get('/user', asyncHandler(getCurrentUser)); // New endpoint to get current user data

export default router;
