import express from 'express';
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

const router = express.Router();

router.post('/offer', createDonationOffer);
router.post('/request', createDonationRequest);
router.get('/', getDonations);
router.get('/:id', getDonationById);
router.put('/:id', updateDonation);
router.delete('/:id', deleteDonation);
router.post('/take-offer', takeOffer);
router.post('/fulfill-request', fulfillRequest);
router.post('/match', matchRequestWithOffer);
router.put('/:id/update-request', updateRequest);

export default router;
