import Notification from '../models/Notification.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import { notifyRequestUpdated, sendEmailNotification, sendInAppNotification } from '../utils/notificationUtils.js';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private
export const createInAppNotification = async (req, res) => {
  try {
    const { userId, type, content } = req.body;

    const newNotification = new Notification({
      userId,
      type,
      content,
    });

    sendInAppNotification(userId, content);
    await newNotification.save();

    res.status(201).json(newNotification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


export const CreateEmailNotification = async (req, res) => {
  try {
    const { userId, type, content } = req.body;

    const newNotification = new Notification({
      userId,
      type,
      content,
    });

    sendEmailNotification(userId, type, content);
    await newNotification.save();

    res.status(201).json(newNotification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}


// @desc    Get all notifications for a user
// @route   GET /api/notifications/user/:userId
// @access  Private
export const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Mark email as sent after sending a notification email
// @route   PUT /api/notifications/:id/email-sent
// @access  Private
export const markEmailAsSent = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.emailSent = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Match and Notify users
// @route   POST /api/notifications/match
// @access  Private
export const notifyMatch = async (req, res) => {
  const { requestUserId, offerUserId, matchedDetails } = req.body;

  try {
      const requestUser = await User.findById(requestUserId);
      const offerUser = await User.findById(offerUserId);

      if (!requestUser || !offerUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Send email to both users
      await Promise.all([
          nodemailer.createTransport().sendMail({
              to: requestUser.email,
              subject: 'You have a match!',
              text: matchedDetails
          }),
          nodemailer.createTransport().sendMail({
              to: offerUser.email,
              subject: 'You have a match!',
              text: matchedDetails
          }),
      ]);

      // Create and save notifications
      const notifications = await Promise.all([
          new Notification({ userId: requestUserId, content: matchedDetails }).save(),
          new Notification({ userId: offerUserId, content: matchedDetails }).save(),
      ]);

      return res.status(201).json({
          message: 'Notification emails sent to both users and notifications created.',
          notifications,
      });
  } catch (error) {
      console.error(error.message);
      return res.status(500).send('Server error');
  }
};



export const notifyUpdateRequest = async (req, res) => {
  try {
    const { userId, type, content } = req.body;
    await notifyRequestUpdated(userId);
    res.status(201).json({ message: 'Notification sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};