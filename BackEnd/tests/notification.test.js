import {
  sendInAppNotification,
  sendEmailNotification,
  notifyConfirmEmail,
  notifyDonationMatch
} from '../utils/notificationUtils.js';
import nodemailer from 'nodemailer';
import { Server } from 'socket.io';

jest.mock('nodemailer');
jest.mock('../utils/notificationUtils.js', () => ({
  sendInAppNotification: jest.fn(),
  sendEmailNotification: jest.fn(),
  notifyConfirmEmail: jest.fn(),
  notifyDonationMatch: jest.fn()
}));

describe('Notification Functions', () => {
  let mockEmit, mockTo, io, transporter;

  beforeEach(() => {
    io = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
    mockEmit = io.emit;
    mockTo = io.to;
    
    console.log = jest.fn();
    console.error = jest.fn();

    transporter = {
      sendMail: jest.fn().mockResolvedValue(true)
    };
    nodemailer.createTransport.mockReturnValue(transporter);

    // Mock the global io object
    global.io = io;
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete global.io;
  });

  test('sendInAppNotification sends a message', () => {
    const userId = 'user123';
    const message = 'Test Message';

    sendInAppNotification(userId, message);

    expect(sendInAppNotification).toHaveBeenCalledWith(userId, message);
  });

  test('sendInAppNotification handles Socket.IO not initialized', () => {
    delete global.io;

    const userId = 'user123';
    const message = 'Test Message';

    sendInAppNotification(userId, message);

    expect(sendInAppNotification).toHaveBeenCalledWith(userId, message);
  });

  test('sendEmailNotification sends an email', async () => {
    const email = 'test@example.com';
    const subject = 'Test Subject';
    const text = 'Test message';

    await sendEmailNotification(email, subject, text);

    expect(sendEmailNotification).toHaveBeenCalledWith(email, subject, text);
  });

  test('sendEmailNotification handles errors', async () => {
    const email = 'test@example.com';
    const subject = 'Test Subject';
    const text = 'Test message';
    const error = new Error('SendMail failed');

    sendEmailNotification.mockRejectedValueOnce(error);

    await expect(sendEmailNotification(email, subject, text)).rejects.toThrow('SendMail failed');
    expect(sendEmailNotification).toHaveBeenCalledWith(email, subject, text);
  });

  test('notifyConfirmEmail sends confirmation notification', async () => {
    const userId = 'user123';

    await notifyConfirmEmail(userId);

    expect(notifyConfirmEmail).toHaveBeenCalledWith(userId);
  });

  test('notifyDonationMatch sends both in-app and email notifications', async () => {
    const userId = 'user123';
    const email = 'test@example.com';
    const donationType = 'Clothes';

    await notifyDonationMatch(userId, email, donationType);

    expect(notifyDonationMatch).toHaveBeenCalledWith(userId, email, donationType);
  });
});