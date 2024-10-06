import express from 'express';
import * as userController from '../controllers/userController.js';
import * as userValidation from '../middlewares/validationMiddleware.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { handleValidationErrors } from '../utils/errorHandler.js';

const router = express.Router();

router.post('/', authenticate, handleValidationErrors, userValidation.validateCreateUser, userController.createUser);

router.get('/', authenticate, handleValidationErrors, userController.getUsers);

router.get('/:id', authenticate, handleValidationErrors, userValidation.validateUpdateUser, userController.getUserById);

router.put('/:id', authenticate, handleValidationErrors, userValidation.validateUpdateUser, userController.updateUser);

router.delete('/:id', authenticate, handleValidationErrors, authorize('Admin'), userValidation.validateUpdateUser, userController.deleteUser);

export default router;