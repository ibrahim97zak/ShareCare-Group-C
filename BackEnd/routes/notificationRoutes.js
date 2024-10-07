import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { validateNotification } from '../middlewares/validationMiddleware.js'; 
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { handleValidationErrors } from '../utils/errorHandler.js';

const notificationRoutes = express.Router();

notificationRoutes.post('/', authenticate, handleValidationErrors, validateNotification, notificationController.createInAppNotification);

notificationRoutes.get('/:userId', handleValidationErrors, notificationController.getNotificationsByUser);

notificationRoutes.post('/email', authenticate, handleValidationErrors, notificationController.CreateEmailNotification);

export default notificationRoutes;
