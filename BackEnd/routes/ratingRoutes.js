import express from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    createRating,
    getRatings,
    getRatingById,
    updateRating,
    deleteRating
} from '../controllers/ratingController.js';

const router = express.Router();

// @route   POST api/ratings
// @desc    Create a new rating
// @access  Private
router.post(
    '/',
    [
        authMiddleware,
        [check('donationId', 'Donation ID is required').not().isEmpty()],
        [check('score', 'Score must be between 1 and 5').isInt({ min: 1, max: 5 })]
    ],
    createRating
);

// @route   GET api/ratings
// @desc    Get all ratings
// @access  Public
router.get('/', getRatings);

// @route   GET api/ratings/:id
// @desc    Get rating by ID
// @access  Public
router.get('/:id', getRatingById);

// @route   PUT api/ratings/:id
// @desc    Update a rating
// @access  Private
router.put(
    '/:id',
    authMiddleware,
    updateRating
);

// @route   DELETE api/ratings/:id
// @desc    Delete a rating
// @access  Private
router.delete('/:id', authMiddleware, deleteRating);

export default router;
