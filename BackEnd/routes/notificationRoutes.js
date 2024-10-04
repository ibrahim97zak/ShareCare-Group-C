import express from 'express';
import { createNotification, getNotificationsByUser, markEmailAsSent, notifyMatch } from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const notificationRouter = express.Router();

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private
notificationRouter.post('/', authMiddleware, createNotification);

// @route   GET /api/notifications/user/:userId
// @desc    Get all notifications for a user
// @access  Private
notificationRouter.get('/user/:userId', authMiddleware, getNotificationsByUser);

// @route   PUT /api/notifications/:id/email-sent
// @desc    Mark email as sent
// @access  Private
notificationRouter.put('/:id/email-sent', authMiddleware, markEmailAsSent);

// @route   POST /api/notifications/match
// @desc    Match and send notification emails to both users
// @access  Private
notificationRouter.post('/match', authMiddleware, notifyMatch);

export default notificationRouter;
