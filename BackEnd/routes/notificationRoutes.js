import express from 'express';
import { createNotification, getUserNotifications, markAsRead, deleteNotification, updateNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', createNotification);

router.get('/:userId', getUserNotifications);

router.put('/:notificationId/read', markAsRead);

router.put('/:notificationId', updateNotification);

router.delete('/:notificationId', deleteNotification);

export default router;
