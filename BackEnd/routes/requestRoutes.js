import express from 'express';
import { check } from 'express-validator';
import { createRequest, getRequests, getRequestById, updateRequest, deleteRequest, getRequestsByBeneficiary, getOpenRequests } from '../controllers/requestController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const requestRouter = express.Router();

// @route   POST api/requests
// @desc    Create a new request
// @access  Private
requestRouter.post(
  '/makeRequest',
  [
    authMiddleware,
    [
      check('role','Benficeries only create requests').isIn(['beneficiary']),
      check('donationType', 'Donation type is required').not().isEmpty(),
      check('quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
      check('location', 'Location is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  createRequest
);

// @route   GET api/requests
// @desc    Get all requests
// @access  Public
requestRouter.get('/getReguests', getRequests);

// @route   GET api/requests/:id
// @desc    Get request by ID
// @access  Public
requestRouter.get('/:id', getRequestById);

// @route   PUT api/requests/:id
// @desc    Update a request
// @access  Private
requestRouter.put(
  '/:id',
  [
    authMiddleware,
    [
      check('donationType', 'Donation type is required').optional().not().isEmpty(),
      check('quantity', 'Quantity must be a positive number').optional().isInt({ min: 1 }),
      check('location', 'Location is required').optional().not().isEmpty(),
      check('status', 'Status is required').optional().isIn(['open', 'in-progress', 'fulfilled', 'closed']),
      check('description', 'Description is required').optional().not().isEmpty()
    ]
  ],
  updateRequest
);

// @route   DELETE api/requests/:id
// @desc    Delete a request
// @access  Private
requestRouter.delete('/:id', authMiddleware, deleteRequest);

// @route   GET api/requests/user/me
// @desc    Get requests by logged in beneficiary
// @access  Private
requestRouter.get('/user/me', authMiddleware, getRequestsByBeneficiary);

// @route   GET api/requests/open
// @desc    Get all open requests
// @access  Public
requestRouter.get('/status/open', getOpenRequests);

export default requestRouter;