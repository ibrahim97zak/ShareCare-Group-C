import mongoose from 'mongoose';
import { body, param, validationResult } from 'express-validator';

export const validateCreateUser = [
  body('userName')
    .exists().withMessage('User name is required')
    .isString().withMessage('User name must be a string')
    .isLength({ min: 3 }).withMessage('User name must be at least 3 characters long'),
  
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),

  body('role')
    .exists().withMessage('Role is required')
    .isIn(['Donor', 'Beneficiary', 'Admin']).withMessage('Role must be Donor, Beneficiary, or Admin'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

export const validateUpdateUser = [
  param('id')
    .exists().withMessage('User ID is required')
    .isMongoId().withMessage('Must be a valid MongoDB ID'),

  body('userName')
    .optional()
    .isString().withMessage('User name must be a string')
    .isLength({ min: 3 }).withMessage('User name must be at least 3 characters long'),

  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email'),

  body('role')
    .optional()
    .isIn(['Donor', 'Beneficiary', 'Admin']).withMessage('Role must be Donor, Beneficiary, or Admin'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

export const validateCreateDonationOffer = [
  body('donorId').isMongoId().withMessage('Invalid donor ID'),
  body('donationType').notEmpty().withMessage('Donation type is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
];

export const validateCreateDonationRequest = [
  body('beneficiaryId').isMongoId().withMessage('Invalid beneficiary ID'),
  body('donationType').notEmpty().withMessage('Donation type is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
];

export const validateDonationId = [
  param('id').isMongoId().withMessage('Invalid donation ID'),
];

export const validateTakeOffer = [
  body('offerId').isMongoId().withMessage('Invalid offer ID'),
  body('beneficiaryId').isMongoId().withMessage('Invalid beneficiary ID'),
];

export const validateFulfillRequest = [
  body('requestId').isMongoId().withMessage('Invalid request ID'),
  body('donorId').isMongoId().withMessage('Invalid donor ID'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
];


export const validateNotification = (req, res, next) => {
  const { userId, type, content } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }

  if (!type || typeof type !== 'string') {
    return res.status(400).json({ error: 'Notification type is required and must be a string' });
  }

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Notification content is required and must be a string' });
  }

  next(); 
};