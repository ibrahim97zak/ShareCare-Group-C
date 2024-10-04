import { Server } from 'socket.io';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

let io;

// Initialize Socket.IO
export const initializeSocketIO = (server) => {
  io = new Server(server);
  console.log('Socket.IO initialized');
};

// Set up nodemailer transporter (configure with your email service)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send in-app notification
export const sendInAppNotification = (userId, message) => {
  if (io) {
    io.to(userId).emit('notification', { message });
    console.log(`In-app notification sent to user ${userId}: ${message}`);
  } else {
    console.error('Socket.IO not initialized');
  }
};

// Send email notification
export const sendEmailNotification = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"ShareCare" <noreply@sharecare.com>',
      to: email,
      subject: subject,
      text: text
    });
    console.log(`Email notification sent to ${email}`);
  } catch (error) {
    console.log('Error sending email:', error.message);
  }
};

// Generic function to send both in-app and email notifications
export const sendNotification = async (userId, email, subject, message) => {
  sendInAppNotification(userId, message);
  await sendEmailNotification(email, subject, message);
};

// Specific notification functions
export const notifyDonationMatch = async (userId, email, donationType) => {
  const subject = 'Donation Match Found';
  const message = `A match has been found for your ${donationType} donation request!`;
  await sendNotification(userId, email, subject, message);
};

export const notifyDonationFulfilled = async (userId, email, donationType) => {
  const subject = 'Donation Fulfilled';
  const message = `Your ${donationType} donation has been fulfilled!`;
  await sendNotification(userId, email, subject, message);
};

export const notifyNewDonationRequest = async (userId, email, donationType) => {
  const subject = 'New Donation Request';
  const message = `A new ${donationType} donation request has been posted that matches your criteria.`;
  await sendNotification(userId, email, subject, message);
};

export const notifyNewDonor = async (userId, email) => {
  const subject = 'New Donor';
  const message = 'You have been added as a new donor!';
  await sendNotification(userId, email, subject, message);
}

export const notifyNewBeneficiary = async (userId, email) => {
  const subject = 'New Beneficiary';
  const message = 'You have been added as a new beneficiary!';
  await sendNotification(userId, email, subject, message);
}

export const getAllNotifications = async (userId) => {
  const user = await User.find({ userId });
  return user.notifications;
}
