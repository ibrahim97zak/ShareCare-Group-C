import express from 'express';
import { validationResult } from 'express-validator';

import * as donationController from '../controllers/donationController.js';

import * as validationMiddleware from '../middlewares/validationMiddleware.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

import { handleValidationErrors } from '../utils/errorHandler.js';

const router = express.Router();


router.post('/offer', validationMiddleware.validateCreateDonationOffer, handleValidationErrors, donationController.createDonationOffer); // donor can creates offer
router.post('/request', validationMiddleware.validateCreateDonationRequest, handleValidationErrors, donationController.createDonationRequest); // beneficiary can creates request

router.get('/offers', donationController.getAllOffers); // get all donation offers in db
router.get('/requests', donationController.getAllRequests); // get all donation requests in db

router.get('/', donationController.getDonations); // get all donations in the database whatever type
router.get('/:id', validationMiddleware.validateDonationId, handleValidationErrors, donationController.getDonationById); // get a specific donation by it's id

router.get('/:userId/requests', donationController.getDonationRequests); // get all donation requests by user id
router.get('/:userId/received-donations', authenticate, authorize('Beneficiary'), donationController.getReceivedDonationsByBeneficiaryId); // get all received donations for beneficiary by user id

router.get('/:userId/offers', donationController.getDonationOffers); // get all donation offers by user id
router.get('/:userId/sent-donations', authenticate, authorize('Donor'), donationController.getSentDonationsByDonorId); // get all sent donations for donor by user id

router.get('/:userId/donations', authenticate, handleValidationErrors, donationController.getDonationsByUserId); // get all donations from all types by user id

router.put('/:id', authenticate, authorize('Donor'), validationMiddleware.validateDonationId, handleValidationErrors, donationController.updateOffer); // donor can update it's offer
router.delete('/:id', authenticate, validationMiddleware.validateDonationId, handleValidationErrors, donationController.deleteDonation); // user can delete it's donation

router.post('/take-offer', authenticate, authorize('Beneficiary'), validationMiddleware.validateTakeOffer, handleValidationErrors, donationController.takeOffer); // beneficiary can take an offer
router.post('/fulfill-request', authenticate, authorize('Donor'), validationMiddleware.validateFulfillRequest, handleValidationErrors, donationController.fulfillRequest); // donor can fulfill a request

router.put('/request/:id', donationController.updateRequest); // beneficiary can update it's request
router.post('/match', authenticate, authorize('Admin'), donationController.matchRequestWithOffer); // to generate matching notification, this api is resposible of finding the matching between donations


export default router;
