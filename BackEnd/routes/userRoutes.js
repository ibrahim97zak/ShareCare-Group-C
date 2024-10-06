import express from 'express';
import * as userController from '../controllers/userController.js';
import * as userValidation from '../middlewares/validationMiddleware.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { handleValidationErrors } from '../utils/errorHandler.js';

const userRoutes = express.Router();

userRoutes.post('/', authenticate, handleValidationErrors, userValidation.validateCreateUser, userController.createUser);

userRoutes.get('/', authenticate, handleValidationErrors, userController.getUsers);

userRoutes.get('/:id', authenticate, handleValidationErrors, userValidation.validateUpdateUser, userController.getUserById);

userRoutes.put('/:id', authenticate, handleValidationErrors, userValidation.validateUpdateUser, userController.updateUser);

userRoutes.delete('/:id', authenticate, handleValidationErrors, authorize('Admin'), userValidation.validateUpdateUser, userController.deleteUser);

export default userRoutes;