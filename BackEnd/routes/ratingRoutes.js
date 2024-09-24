import express from 'express';
import { check } from 'express-validator';
import {
  createRating,
  getRatings,
  getRatingById,
  updateRating,
  deleteRating,
  getRatingsByDonor
} from '../controllers/ratingController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const ratingRouter = express.Router();

// @route   POST api/ratings
// @desc    Create a new rating
// @access  Private (Beneficiary)
ratingRouter.post(
  '/',
  [
    authMiddleware,
    [
      check('ratedId', 'Rated ID (Donor) is required').not().isEmpty(),
      check('donationId', 'Donation ID is required').not().isEmpty(),
      check('score', 'Score must be a number between 1 and 5').isInt({ min: 1, max: 5 })
    ]
  ],
  createRating
);

// @route   GET api/ratings
// @desc    Get all ratings
// @access  Public
ratingRouter.get('/', getRatings);

// @route   GET api/ratings/:id
// @desc    Get rating by ID
// @access  Public
ratingRouter.get('/:id', getRatingById);

// @route   PUT api/ratings/:id
// @desc    Update a rating
// @access  Private (Beneficiary)
ratingRouter.put(
  '/:id',
  [
    authMiddleware,
    [
      check('score', 'Score must be a number between 1 and 5').optional().isInt({ min: 1, max: 5 })
    ]
  ],
  updateRating
);

// @route   DELETE api/ratings/:id
// @desc    Delete a rating
// @access  Private (Beneficiary)
ratingRouter.delete('/:id', authMiddleware, deleteRating);

// @route   GET api/ratings/donor/:donorId
// @desc    Get ratings by Donor ID
// @access  Public
ratingRouter.get('/donor/:donorId', getRatingsByDonor);

export default ratingRouter;
