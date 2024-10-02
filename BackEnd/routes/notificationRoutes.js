import express from 'express';
import { 
  createNotification, 
  getUserNotifications, 
  markAsRead, 
  deleteNotification, 
  updateNotification 
} from '../controllers/notificationController.js';
import { validateNotification } from '../middlewares/validationMiddleware.js'; 
const router = express.Router();

router.post('/', validateNotification, createNotification);

router.get('/:userId', getUserNotifications);

router.put('/:notificationId/read', markAsRead);

router.put('/:notificationId', validateNotification, updateNotification); 

router.delete('/:notificationId', deleteNotification);

export default router;
