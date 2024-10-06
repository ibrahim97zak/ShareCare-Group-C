import express from 'express';
const donationRoutes = express.Router();
import { register, confirmEmail, login,logout} from '../controllers/authController.js'; // import authController from '../controllers/authController';
import * as validators from '../validators/AuthValidation.js';
import validation from '../validators/validation.js';
import { asyncHandler } from "../utils/errorHandler.js"

// Public routes
donationRoutes.post('/register',validation(validators.signupSchema),asyncHandler(register));
donationRoutes.post('/login',validation(validators.loginSchema),asyncHandler(login));
donationRoutes.get('/confirm-email',validation(validators.confirmEmailSchema),confirmEmail);


// Protected routes
donationRoutes.post('/logout',logout);

export default donationRoutes;