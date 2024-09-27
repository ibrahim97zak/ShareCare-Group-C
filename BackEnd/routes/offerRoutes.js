import express from 'express';
import { check } from 'express-validator';
import { 
  createOffer, 
  getOffers, 
  getOfferById, 
  updateOffer, 
  deleteOffer, 
  getOffersByDonor 
} from '../controllers/offerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const donationOfferRouter = express.Router();

// @route   POST api/donation-offers
// @desc    Create a new Donation Offer
// @access  Private
donationOfferRouter.post(
  '/',
  [
    authMiddleware,
    [
      check('donationId', 'Donation ID is required').not().isEmpty(),
    ]
  ],
  createOffer
);

// @route   GET api/donation-offers
// @desc    Get all Donation Offers
// @access  Public
donationOfferRouter.get('/', getOffers);

// @route   GET api/donation-offers/:id
// @desc    Get Donation Offer by ID
// @access  Public
donationOfferRouter.get('/:id', getOfferById);

// @route   PUT api/donation-offers/:id
// @desc    Update a Donation Offer
// @access  Private
donationOfferRouter.put(
  '/:id',
  authMiddleware,
  updateOffer
);

// @route   DELETE api/donation-offers/:id
// @desc    Delete a Donation Offer
// @access  Private
donationOfferRouter.delete('/:id', authMiddleware, deleteOffer);

// @route   GET api/donation-offers/donor/:donorId
// @desc    Get Donation Offers by Donor
// @access  Public
donationOfferRouter.get('/donor/:donorId', getOffersByDonor);

export default donationOfferRouter;
