import Notification from '../models/Notification.js';
import User from '../models/User.js'; 
import mongoose from 'mongoose';

export const createNotification = async (req, res, next) => {
  try {
    const { userId, type, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const newNotification = new Notification({
      userId,
      type,
      content,
    });

    await newNotification.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { notifications: newNotification._id } }, 
      { new: true }
    );

    res.status(201).json({ message: 'Notification created successfully', newNotification });
  } catch (err) {
    next(err); 
  }
};

export const getUserNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    next(err); 
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: 'Invalid notification ID format' });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    next(err);
  }
};

export const updateNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: 'Invalid notification ID format' });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(notificationId, updateData, { new: true });

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification updated successfully', updatedNotification });
  } catch (err) {
    next(err); 
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: 'Invalid notification ID format' });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await User.findByIdAndUpdate(
      notification.userId,
      { $pull: { notifications: notificationId } }, 
      { new: true }
    );

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    next(err); 
  }
};
