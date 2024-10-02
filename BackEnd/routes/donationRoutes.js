import express from 'express';
import { validationResult } from 'express-validator';
import {
  createDonationOffer,
  createDonationRequest,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  takeOffer,
  fulfillRequest,
  updateRequest,
  matchRequestWithOffer,
} from '../controllers/donationController.js';

import {
  validateCreateDonationOffer,
  validateCreateDonationRequest,
  validateDonationId,
  validateTakeOffer,
  validateFulfillRequest,
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/offer', validateCreateDonationOffer, handleValidationErrors, createDonationOffer);

router.post('/request', validateCreateDonationRequest, handleValidationErrors, createDonationRequest);

router.get('/', getDonations);

router.get('/:id', validateDonationId, handleValidationErrors, getDonationById);

router.put('/:id', validateDonationId, handleValidationErrors, updateDonation);

router.delete('/:id', validateDonationId, handleValidationErrors, deleteDonation);

router.post('/take-offer', validateTakeOffer, handleValidationErrors, takeOffer);

router.post('/fulfill-request', validateFulfillRequest, handleValidationErrors, fulfillRequest);

router.put('/request/:id', updateRequest);

router.post('/match', matchRequestWithOffer);

export default router;
