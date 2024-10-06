import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { validateNotification } from '../middlewares/validationMiddleware.js'; 
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { handleValidationErrors } from '../utils/errorHandler.js';

const router = express.Router();

router.post('/', authenticate, handleValidationErrors, validateNotification, notificationController.createNotification);

router.get('/:userId', authenticate, handleValidationErrors, notificationController.getNotificationsByUser);

router.post('/email', authenticate, handleValidationErrors, notificationController.CreateEmailNotification);

export default router;