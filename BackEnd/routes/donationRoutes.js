// Import dependencies
import express from 'express';
import { validationResult } from 'express-validator';

// Import controllers
import * as donationController from '../controllers/donationController.js';

// Import validation middlewares
import * as validationMiddleware from '../middlewares/validationMiddleware.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

import { handleValidationErrors } from '../utils/errorHandler.js';

// Create router instance
const router = express.Router();


// Define routes
router.post('/offer', authenticate, authorize('Donor'), validationMiddleware.validateCreateDonationOffer, handleValidationErrors, donationController.createDonationOffer);
router.post('/request', authenticate, authorize('Beneficiary'), validationMiddleware.validateCreateDonationRequest, handleValidationErrors, donationController.createDonationRequest);

router.get('/', authenticate, donationController.getDonations);
router.get('/:id', authenticate, validationMiddleware.validateDonationId, handleValidationErrors, donationController.getDonationById);

router.put('/:id', authenticate, validationMiddleware.validateDonationId, handleValidationErrors, donationController.updateDonation);
router.delete('/:id', authenticate, validationMiddleware.validateDonationId, handleValidationErrors, donationController.deleteDonation);

router.post('/take-offer', authenticate, authorize('Beneficiary'), validationMiddleware.validateTakeOffer, handleValidationErrors, donationController.takeOffer);
router.post('/fulfill-request', authenticate, authorize('Donor'), validationMiddleware.validateFulfillRequest, handleValidationErrors, donationController.fulfillRequest);

router.put('/request/:id', authenticate, donationController.updateRequest);
router.post('/match', authenticate, donationController.matchRequestWithOffer);


// Export the router
export default router;