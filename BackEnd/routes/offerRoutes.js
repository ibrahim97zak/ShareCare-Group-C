import express from 'express';
import { check } from 'express-validator';
import { createDonationOffer, getDonationOffers, getDonationOfferById, updateDonationOffer, deleteDonationOffer } from '../controllers/offerController.js';
import authMiddleware from '../middlewares/authMiddleware';

const donationOfferRouter = express.Router();

// @route   POST api/donation-offers
// @desc    Create a new donation offer
// @access  Private
donationOfferRouter.post(
  '/',
  [
    authMiddleware,
    [
      check('donationId', 'Donation ID is required').not().isEmpty()
    ]
  ],
  createDonationOffer
);

// @route   GET api/donation-offers
// @desc    Get all donation offers
// @access  Public
donationOfferRouter.get('/', getDonationOffers);

// @route   GET api/donation-offers/:id
// @desc    Get donation offer by ID
// @access  Public
donationOfferRouter.get('/:id', getDonationOfferById);

// @route   PUT api/donation-offers/:id
// @desc    Update a donation offer
// @access  Private
donationOfferRouter.put(
  '/:id',
  [
    authMiddleware,
    [
      check('donationId', 'Donation ID is required').optional().not().isEmpty()
    ]
  ],
  updateDonationOffer
);

// @route   DELETE api/donation-offers/:id
// @desc    Delete a donation offer
// @access  Private
donationOfferRouter.delete('/:id', authMiddleware, deleteDonationOffer);

export default donationOfferRouter;
