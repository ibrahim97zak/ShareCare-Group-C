import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { validateNotification } from '../middlewares/validationMiddleware.js'; 
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { handleValidationErrors } from '../utils/errorHandler.js';

const router = express.Router();

router.post('/', authenticate, handleValidationErrors, validateNotification, notificationController.createNotification);

router.get('/:userId', authenticate, handleValidationErrors, notificationController.getUserNotifications);

router.put('/:notificationId/read', authenticate, handleValidationErrors, notificationController.markAsRead);

router.put('/:notificationId', authenticate, handleValidationErrors, validateNotification, notificationController.updateNotification); 

router.delete('/:notificationId', authenticate, handleValidationErrors, notificationController.deleteNotification);

export default router;
