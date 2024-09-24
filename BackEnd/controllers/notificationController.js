import Notification from '../models/Notification.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

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
export const createNotification = async (req, res) => {
  try {
    const { userId, type, content } = req.body;

    const newNotification = new Notification({
      userId,
      type,
      content,
    });

    await newNotification.save();

    res.status(201).json(newNotification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

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
  try {
    const { requestUserId, offerUserId, matchedDetails } = req.body;

    const requestUser = await User.findById(requestUserId);
    const offerUser = await User.findById(offerUserId);

    if (!requestUser || !offerUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const emailContent = `A match has been found!\nDetails: ${matchedDetails}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: requestUser.email,
      subject: 'Match Found!',
      text: `Hi ${requestUser.name},\n${emailContent}`,
    });

    const notificationForRequester = new Notification({
      userId: requestUserId,
      type: 'Match',
      content: emailContent,
      emailSent: true,
    });

    await notificationForRequester.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: offerUser.email,
      subject: 'Match Found!',
      text: `Hi ${offerUser.name},\n${emailContent}`,
    });

    const notificationForOfferer = new Notification({
      userId: offerUserId,
      type: 'Match',
      content: emailContent,
      emailSent: true,
    });

    await notificationForOfferer.save();

    res.status(201).json({
      message: 'Notification emails sent to both users and notifications created.',
      notifications: [notificationForRequester, notificationForOfferer],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
