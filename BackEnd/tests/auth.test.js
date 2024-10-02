// Adjust the import path according to your project structure
import { sendEmail, register, login, getProfile, changePassword, confirmEmail, resetPassword, logout } from '../controllers/authController.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwtUtils from '../utils/jwtUtils';
import dotenv from 'dotenv';

dotenv.config();

// Mocking dependencies
jest.mock('../models/User.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('nodemailer');
jest.mock('../utils/jwtUtils.js');

describe('Auth Controller', () => {
  let req;
  let res;
  let mockTransporter;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'mockUserId' },
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'mockMessageId' }),
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
  });

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      await sendEmail('test@example.com', 'Test User', 'Test Subject', 'http://test-link.com');
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        userName: 'testuser',
        name: 'Test User',
        gender: 'male',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        phone: '1234567890',
        role: 'user',
        location: 'Test Location',
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      const mockUser = { id: 'mockUserId', save: jest.fn() };
      User.mockImplementation(() => mockUser);
      jwt.sign = jest.fn().mockImplementation((payload, secret, options) => 'mockToken');

      await register(req, res);

      expect(User).toHaveBeenCalledWith(expect.objectContaining({
        userName: 'testuser',
        email: 'test@example.com',
      }));
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    // Add more test cases for registration errors
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };
  
      const mockUser = { 
        id: 'mockUserId', 
        email: 'test@example.com',
        password: 'hashedPassword',
        isVerified: true
      };
      
      // Mock User.findOne to resolve with mockUser
      User.findOne.mockResolvedValue(mockUser);
  
      // Mock bcrypt.compare to resolve as true (passwords match)
      bcrypt.compare.mockResolvedValue(true);
  
      // Mock jwtUtils.generateToken to return a synchronous token
      jwtUtils.generateToken.mockReturnValue('mockToken');
  
      // Call the login function
      await login(req, res);
  
      // Ensure that the correct calls were made
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      
      // Ensure that the token is generated correctly
      expect(jwtUtils.generateToken).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            id: 'mockUserId'
          })
        }),
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Ensure the response contains the token
      expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });
  
    // Add more test cases for login errors
  });
  

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = { id: 'mockUserId', name: 'Test User' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await getProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith('mockUserId');
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      req.body = {
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword',
      };

      const mockUser = { 
        id: 'mockUserId', 
        password: 'hashedOldPassword',
        save: jest.fn(),
      };
      User.findById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('hashedNewPassword');

      await changePassword(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('oldPassword', 'hashedOldPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    // Add more test cases for password change errors
  });

  describe('confirmEmail', () => {
    it('should confirm email successfully', async () => {
      req.query = {
        email: 'test@example.com',
        token: 'validToken'
      };

      const mockUser = { 
        email: 'test@example.com',
        isVerified: false,
        save: jest.fn().mockImplementation(function() {
          this.isVerified = true;
          return Promise.resolve(this);
        }),
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.verify = jest.fn().mockReturnValue(true);

      await confirmEmail(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockUser.isVerified).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith('Your email has been Confirmed successfully!, Log in now');
    });

    // Add more test cases for email confirmation errors
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      res.clearCookie = jest.fn();

      await logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});