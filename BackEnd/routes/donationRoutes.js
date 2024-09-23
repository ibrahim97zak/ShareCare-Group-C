import express from 'express';
import { check } from 'express-validator';
import { createDonation, getDonations, getDonationById, updateDonation, deleteDonation } from '../controllers/donationController';
import authMiddleware from '../middlewares/authMiddleware';

const donationdonationRouter = express.Router();

// @route   POST api/donations
// @desc    Create a new donation
// @access  Private
donationRouter.post(
  '/',
  [
    authMiddleware,
    [
      check('donationType', 'Donation type is required').not().isEmpty(),
      check('quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
      check('location', 'Location is required').not().isEmpty()
    ]
  ],
  createDonation
);

// @route   GET api/donations
// @desc    Get all donations
// @access  Public
donationRouter.get('/', getDonations);

// @route   GET api/donations/:id
// @desc    Get donation by ID
// @access  Public
donationRouter.get('/:id', getDonationById);

// @route   PUT api/donations/:id
// @desc    Update a donation
// @access  Private
donationRouter.put(
  '/:id',
  [
    authMiddleware,
    [
      check('donationType', 'Donation type is required').optional().not().isEmpty(),
      check('quantity', 'Quantity must be a positive number').optional().isInt({ min: 1 }),
      check('location', 'Location is required').optional().not().isEmpty(),
      check('status', 'Status is required').optional().isIn(['available', 'reserved', 'completed'])
    ]
  ],
  updateDonation
);

// @route   DELETE api/donations/:id
// @desc    Delete a donation
// @access  Private
donationRouter.delete('/:id', authMiddleware, deleteDonation);

export default donationRouter;