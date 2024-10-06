import {
  createInAppNotification,
  CreateEmailNotification,
  getNotificationsByUser,
  markEmailAsSent,
  notifyMatch,
  notifyUpdateRequest
} from '../controllers/notificationController.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import { sendInAppNotification, sendEmailNotification, notifyRequestUpdated } from '../utils/notificationUtils.js';

jest.mock('../server', () => ({
  server: {
    listen: jest.fn()
  },
  io: {
    on: jest.fn()
  }
}));

jest.mock('../dbConfig/db', () => ({
  connectDB: jest.fn()
}));



jest.mock('../models/Notification.js');
jest.mock('../models/User.js');
jest.mock('nodemailer');
jest.mock('../utils/notificationUtils.js');

const mockTransporter = {
  sendMail: jest.fn(() => Promise.resolve({})), // Mock the sendMail function
};

// Use the mocked transporter in your test
nodemailer.createTransport.mockReturnValue(mockTransporter);
const mockSave = jest.fn();
Notification.prototype.save = mockSave;

describe('Notification Controllers', () => {
  let req, res, mockSave;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockResolvedValue(undefined),
      send: jest.fn().mockResolvedValue(undefined)
    };
    mockSave = jest.fn().mockResolvedValue(undefined);
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createInAppNotification', () => {
    test('creates a new in-app notification', async () => {
      req.body = { userId: 'user123', type: 'test', content: 'Test content' };
      Notification.mockImplementation(() => ({
        save: mockSave
      }));
      sendInAppNotification.mockResolvedValue(undefined);

      await createInAppNotification(req, res);

      expect(sendInAppNotification).toHaveBeenCalledWith('user123', 'Test content');
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    test('handles errors', async () => {
      req.body = { userId: 'user123', type: 'test', content: 'Test content' };
      const error = new Error('Test error');
      Notification.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error)
      }));

      await createInAppNotification(req, res);

      expect(console.error).toHaveBeenCalledWith(error.message);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('CreateEmailNotification', () => {
    test('creates a new email notification', async () => {
      req.body = { userId: 'user123', type: 'test', content: 'Test content' };
      Notification.mockImplementation(() => ({
        save: mockSave
      }));
      sendEmailNotification.mockResolvedValue(undefined);

      await CreateEmailNotification(req, res);

      expect(sendEmailNotification).toHaveBeenCalledWith('user123', 'test', 'Test content');
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    test('handles errors', async () => {
      req.body = { userId: 'user123', type: 'test', content: 'Test content' };
      const error = new Error('Test error');
      Notification.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error)
      }));

      await CreateEmailNotification(req, res);

      expect(console.error).toHaveBeenCalledWith(error.message);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('getNotificationsByUser', () => {
    test('gets all notifications for a user', async () => {
      req.params.userId = 'user123';
      const mockNotifications = [{ id: 1 }, { id: 2 }];
      Notification.find = jest.fn().mockReturnThis();
      Notification.sort = jest.fn().mockResolvedValue(mockNotifications);

      await getNotificationsByUser(req, res);

      expect(Notification.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(Notification.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.json).toHaveBeenCalledWith(mockNotifications);
    });

    test('handles errors', async () => {
      req.params.userId = 'user123';
      const error = new Error('Test error');
      Notification.find = jest.fn().mockReturnThis();
      Notification.sort = jest.fn().mockRejectedValue(error);

      await getNotificationsByUser(req, res);

      expect(console.error).toHaveBeenCalledWith(error.message);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('markEmailAsSent', () => {
    test('marks email as sent', async () => {
      req.params.id = 'notif123';
      const mockNotification = {
        _id: 'notif123',
        emailSent: false,
        save: mockSave
      };
      Notification.findById = jest.fn().mockResolvedValue(mockNotification);

      await markEmailAsSent(req, res);

      expect(Notification.findById).toHaveBeenCalledWith('notif123');
      expect(mockNotification.emailSent).toBe(true);
      expect(mockSave).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockNotification);
    });

    test('handles notification not found', async () => {
      req.params.id = 'notif123';
      Notification.findById = jest.fn().mockResolvedValue(null);

      await markEmailAsSent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Notification not found' });
    });

    test('handles errors', async () => {
      req.params.id = 'notif123';
      const error = new Error('Test error');
      Notification.findById = jest.fn().mockRejectedValue(error);

      await markEmailAsSent(req, res);

      expect(console.error).toHaveBeenCalledWith(error.message);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('notifyMatch', () => {
    it('notifies matched users', async () => {
      req.body = {
        requestUserId: 'user1',
        offerUserId: 'user2',
        matchedDetails: 'Match details here'
      };

      const mockRequestUser = { _id: 'user1', name: 'User 1', email: 'user1@example.com' };
      const mockOfferUser = { _id: 'user2', name: 'User 2', email: 'user2@example.com' };

      // Mock User.findById to return these mock users
      User.findById = jest.fn()
        .mockResolvedValueOnce(mockRequestUser) // First call for requestUser
        .mockResolvedValueOnce(mockOfferUser);  // Second call for offerUser

      const mockTransporter = {
        sendMail: jest.fn().mockResolvedValue(true)
      };

      // Mock transporter
      nodemailer.createTransport.mockReturnValue(mockTransporter);

      // Mock Notification save process
      const mockSave = jest.fn().mockResolvedValue(true);
      Notification.mockImplementation(() => ({
        save: mockSave
      }));

      // Call the controller
      await notifyMatch(req, res);

      // Expectations
      expect(User.findById).toHaveBeenCalledTimes(2);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2); // Two emails should be sent
      expect(Notification).toHaveBeenCalledTimes(2); // Two notifications should be created
      expect(mockSave).toHaveBeenCalledTimes(2); // Each notification saved
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Notification emails sent to both users and notifications created.',
        notifications: expect.any(Array)
      }));
    });
  });

  describe('notifyUpdateRequest', () => {
    test('notifies about request update', async () => {
      req.body = { userId: 'user123', type: 'update', content: 'Test update' };
      notifyRequestUpdated.mockResolvedValue(undefined);

      await notifyUpdateRequest(req, res);

      expect(notifyRequestUpdated).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Notification sent' });
    });

    test('handles errors', async () => {
      req.body = { userId: 'user123', type: 'update', content: 'Test update' };
      const error = new Error('Test error');
      notifyRequestUpdated.mockRejectedValue(error);

      await notifyUpdateRequest(req, res);

      expect(console.error).toHaveBeenCalledWith(error.message);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });
});
