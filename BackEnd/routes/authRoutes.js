import express from 'express';
import { register, login, confirmEmail, logout } from '../controllers/authController.js';
import * as validators from '../validators/AuthValidation.js';
import validation from '../validators/validation.js';
import { asyncHandler } from "../utils/errorHandler.js"

const router = express.Router();

router.post('/register',validation(validators.signupSchema),asyncHandler(register) );
router.post('/login',validation(validators.loginSchema),asyncHandler(login));
router.get('/confirm-email',validation(validators.confirmEmailSchema),confirmEmail);
router.post('/logout',logout);

export default router;