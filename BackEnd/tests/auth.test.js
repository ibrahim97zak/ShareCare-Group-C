import { register, login, getProfile, changePassword, resetPassword } from '../controllers/authController';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import jwtUtils from '../utils/jwtUtils.js';

// Mocking dependencies
jest.mock('../models/User.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('nodemailer');
jest.mock('../utils/jwtUtils.js');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        userName: 'testuser',
        name: 'Test User',
        gender: 'male',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        userType: 'donor',
        location: 'Test City'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save.mockResolvedValue({
        id: 'someUserId',
        userType: 'donor'
      });
      jwtUtils.generateToken.mockReturnValue('someToken');

      const mockTransporter = {
        sendMail: jest.fn().mockResolvedValue(true)
      };
      nodemailer.createTransport.mockReturnValue(mockTransporter);

      await register(req, res);

      expect(User.prototype.save).toHaveBeenCalled();
      expect(jwtUtils.generateToken).toHaveBeenCalled();
      expect(mockTransporter.sendMail).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Registration successful'));
    });

    it('should return 400 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'someUserId',
        email: 'test@example.com',
        password: 'hashedPassword',
        isVerified: true,
        userType: 'donor'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwtUtils.generateToken.mockReturnValue('someToken');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({ token: 'someToken' });
    });

    it('should return 400 if user is not verified', async () => {
      User.findOne.mockResolvedValue({ isVerified: false });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Please verify your email before logging in' });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: 'someUserId',
        name: 'Test User',
        email: 'test@example.com'
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      req.user = { id: 'someUserId' };

      await getProfile(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      req.body = {
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword'
      };
      req.user = { id: 'someUserId' };

      const mockUser = {
        id: 'someUserId',
        password: 'hashedOldPassword',
        save: jest.fn()
      };

      User.findById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('hashedNewPassword');

      await changePassword(req, res);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.stringContaining('The password was changed successfully'));
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'newPassword'
      };

      const mockUser = {
        email: 'test@example.com',
        save: jest.fn()
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue('hashedNewPassword');

      await resetPassword(req, res);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ msg: 'Password reset successful' });
    });

    it('should return 400 if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid email, user not found' });
    });
  });
});