import {
    sendInAppNotification,
    sendEmailNotification,
    notifyConfirmEmail,
    notifyDonationMatch
  } from '../utils/notificationUtils.js';
  import nodemailer from 'nodemailer';
  import { Server } from 'socket.io';
  
  jest.mock('nodemailer'); // Mock nodemailer
  jest.mock('socket.io', () => {
    return {
      Server: jest.fn().mockImplementation(() => {
        return {
          to: jest.fn().mockReturnThis(),
          emit: jest.fn()
        };
      })
    };
  });
  
  describe('Notification Functions', () => {
    let mockEmit, mockTo, io, transporter;
  
    beforeEach(() => {
      // Mock io.to().emit() behavior
      io = new Server();
      mockEmit = io.emit;
      mockTo = io.to;
      
      // Mock console methods to avoid actual logs during testing
      console.log = jest.fn();
      console.error = jest.fn();
  
      // Mock nodemailer transporter
      transporter = {
        sendMail: jest.fn().mockResolvedValue(true)
      };
      nodemailer.createTransport.mockReturnValue(transporter);
    });
  
    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });
  
    // Test sendInAppNotification
    test('sendInAppNotification sends a message', () => {
      const userId = 'user123';
      const message = 'Test Message';
  
      // Call the function
      sendInAppNotification(userId, message);
  
      // Assertions
      expect(mockTo).toHaveBeenCalledWith(userId);
      expect(mockEmit).toHaveBeenCalledWith('notification', { userId, message });
      expect(console.log).toHaveBeenCalledWith(`In-app notification sent to user ${userId}: ${message}`);
    });
  
    test('sendInAppNotification handles Socket.IO not initialized', () => {
      // Simulate no Socket.IO instance
      io = null;
  
      const userId = 'user123';
      const message = 'Test Message';
  
      sendInAppNotification(userId, message);
  
      expect(console.error).toHaveBeenCalledWith('Socket.IO not initialized');
    });
  
    // Test sendEmailNotification
    test('sendEmailNotification sends an email', async () => {
      const email = 'test@example.com';
      const subject = 'Test Subject';
      const text = 'Test message';
  
      await sendEmailNotification(email, subject, text);
  
      expect(transporter.sendMail).toHaveBeenCalledWith({
        from: '"ShareCare" <noreply@sharecare.com>',
        to: email,
        subject: subject,
        text: text
      });
      expect(console.log).toHaveBeenCalledWith(`Email notification sent to ${email}`);
    });
  
    test('sendEmailNotification handles errors', async () => {
      transporter.sendMail.mockRejectedValueOnce(new Error('SendMail failed'));
  
      const email = 'test@example.com';
      const subject = 'Test Subject';
      const text = 'Test message';
  
      await sendEmailNotification(email, subject, text);
  
      expect(console.error).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
    });
  
    // Test notifyConfirmEmail
    test('notifyConfirmEmail sends confirmation notification', async () => {
      const userId = 'user123';
  
      // Call the function
      await notifyConfirmEmail(userId);
  
      // Assertions
      expect(mockTo).toHaveBeenCalledWith(userId);
      expect(mockEmit).toHaveBeenCalledWith('notification', {
        userId,
        message: 'Please confirm your email address.'
      });
    });
  
    // Test notifyDonationMatch
    test('notifyDonationMatch sends both in-app and email notifications', async () => {
      const userId = 'user123';
      const email = 'test@example.com';
      const donationType = 'Clothes';
  
      await notifyDonationMatch(userId, email, donationType);
  
      // Check in-app notification
      expect(mockTo).toHaveBeenCalledWith(userId);
      expect(mockEmit).toHaveBeenCalledWith('notification', {
        userId,
        message: `A match has been found for your ${donationType} donation request!`
      });
  
      // Check email notification
      expect(transporter.sendMail).toHaveBeenCalledWith({
        from: '"ShareCare" <noreply@sharecare.com>',
        to: email,
        subject: 'Donation Match Found',
        text: `A match has been found for your ${donationType} donation request!`
      });
    });
  });
  