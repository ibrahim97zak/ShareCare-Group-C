import { body, param, validationResult } from 'express-validator';
import User from '../models/User.js';

// Utility function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateRegistration = [
  body('userName')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .custom(async (value) => {
      const user = await User.findOne({ userName: value });
      if (user) {
        throw new Error('Username is already taken');
      }
      return true;
    }),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
    body('role')
    .isIn(['Donor', 'Beneficiary'])
    .withMessage('User type must be either Donor or Beneficiary'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validatePasswordReset = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'),
  handleValidationErrors
];

export const validateEmailVerificationToken = [
  param('token')
    .notEmpty()
    .withMessage('Verification token is required')
    .isLength({ min: 20, max: 20 })
    .withMessage('Invalid verification token'),
  handleValidationErrors
];

export const validatePasswordResetToken = [
  param('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 20, max: 20 })
    .withMessage('Invalid reset token'),
  handleValidationErrors
];

export const validateChangePassword = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'),
  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New password confirmation does not match new password');
      }
      return true;
    }),
  handleValidationErrors
];

export const validateDonationCreation = [
  body('donationType')
    .trim()
    .notEmpty()
    .withMessage('Donation type is required'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  handleValidationErrors
];

export const validateDonationUpdate = [
  body('donationType')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Donation type cannot be empty if provided'),
  body('quantity')
    .optional()
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0'),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty if provided'),
  body('status')
    .optional()
    .isIn(['available', 'reserved', 'completed'])
    .withMessage('Invalid status'),
  handleValidationErrors
];

export const validateRatingCreation = [
  body('score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating score must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters'),
  handleValidationErrors
];