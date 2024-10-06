import express from 'express';
import { validationResult } from 'express-validator';

import * as donationController from '../controllers/donationController.js';

import * as validationMiddleware from '../middlewares/validationMiddleware.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

import { handleValidationErrors } from '../utils/errorHandler.js';

const donationRoutes = express.Router();


donationRoutes.post('/offer', authenticate, authorize('Donor'), validationMiddleware.validateCreateDonationOffer, handleValidationErrors, donationController.createDonationOffer); // donor can creates offer
donationRoutes.post('/request', authenticate, authorize('Beneficiary'), validationMiddleware.validateCreateDonationRequest, handleValidationErrors, donationController.createDonationRequest); // beneficiary can creates request

donationRoutes.get('/', authenticate, donationController.getDonations); // get all donations in the database whatever type
donationRoutes.get('/:id', authenticate, validationMiddleware.validateDonationId, handleValidationErrors, donationController.getDonationById); // get a specific donation by it's id

donationRoutes.get('/:userId/requests', authenticate, donationController.getDonationRequests); // get all donation requests by user id
donationRoutes.get('/:userId/received-donations', authenticate, donationController.getReceivedDonationsByBeneficiaryId); // get all received donations for beneficiary by user id
donationRoutes.get('/:userId/offers', authenticate, donationController.getDonationOffers); // get all donation offers by user id
donationRoutes.get('/:userId/sent-donations', authenticate, donationController.getSentDonationsByDonorId); // get all sent donations for donor by user id
donationRoutes.get('/:userId/donations', authenticate, handleValidationErrors, donationController.getDonationsByUserId); // get all donations from all types by user id

donationRoutes.put('/:id', authenticate, authorize('Donor'), validationMiddleware.validateDonationId, handleValidationErrors, donationController.updateOffer); // donor can update it's offer
donationRoutes.delete('/:id', authenticate, validationMiddleware.validateDonationId, handleValidationErrors, donationController.deleteDonation); // user can delete it's donation

donationRoutes.post('/take-offer', authenticate, authorize('Beneficiary'), validationMiddleware.validateTakeOffer, handleValidationErrors, donationController.takeOffer); // beneficiary can take an offer
donationRoutes.post('/fulfill-request', authenticate, authorize('Donor'), validationMiddleware.validateFulfillRequest, handleValidationErrors, donationController.fulfillRequest); // donor can fulfill a request

donationRoutes.put('/request/:id', authenticate, authorize('Beneficiary'), donationController.updateRequest); // beneficiary can update it's request
donationRoutes.post('/match', authenticate, authorize('Admin'), donationController.matchRequestWithOffer); // to generate matching notification, this api is resposible of finding the matching between donations


export default donationRoutes;