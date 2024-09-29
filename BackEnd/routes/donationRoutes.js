import express from 'express';
import { check } from 'express-validator';
import { createDonation, getDonations, getDonationById, updateDonation, deleteDonation } from '../controllers/donationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const donationRouter = express.Router();

// @route   POST api/donations
// @desc    Create a new donation
// @access  Private
donationRouter.post(
  '/createDonation',
  [
    authMiddleware,
    [
      check('role','Donors only create donations').isIn(['donor']),
      check('donationType', 'Donation type is required').not().isEmpty(),
      check('quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
      check('location', 'Location is required').not().isEmpty(),
      check('availabilityDate', 'availabilityDate is required').not().isEmpty().isDate(),
    ]
  ],
  createDonation
);

// @route   GET api/donations
// @desc    Get all donations
// @access  Public
donationRouter.get('/getDonations', getDonations);

// @route   GET api/donations/:id
// @desc    Get donation by ID
// @access  Public
donationRouter.get('/Donation/:id', getDonationById);

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
      check('availabilityDate', 'availabilityDate is required').not().isEmpty().isDate(),
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