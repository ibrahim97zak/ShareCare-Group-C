import mongoose from 'mongoose'; 
import DonationOffer from '../models/DonationOffer.js';
import DonationRequest from '../models/DonationRequest.js';
import Donation from '../models/Donation.js';
import Beneficiary from '../models/Beneficiary.js'; 
import Donor from '../models/Donor.js';
import User from '../models/User.js'; 
import { CreateEmailNotification, createInAppNotification, notifyMatch } from './notificationController.js';

export const createDonationOffer = async (req, res, next) => {
  try {
    const { donorId, ...offerData } = req.body;

    const newOffer = new DonationOffer(offerData);
    const savedOffer = await newOffer.save();

    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });

    donor.offers.push(savedOffer._id);
    await donor.save();

    const result =  await createInAppNotification(req,res);
    res.status(201).json({ message: 'Donation offer created', savedOffer, donorName: donor.name , result});
  } catch (err) {
    next(err);
  }
};

export const createDonationRequest = async (req, res, next) => {
  try {
    const { beneficiaryId, ...requestData } = req.body;

    const newRequest = new DonationRequest(requestData);
    const savedRequest = await newRequest.save();

    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found' });

    beneficiary.requests.push(savedRequest._id);
    await beneficiary.save();
    const result =  await createInAppNotification(req,res);
    res.status(201).json({ message: 'Request created', savedRequest, beneficiaryName: beneficiary.name , result});
  } catch (err) {
    next(err);
  }
};

export const getDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (err) {
    next(err); 
  }
};

export const getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    const donorId = donation.sender[0]; 
    const donor = await User.findById(donorId);
    
    const beneficiary = await User.findById(donation.receiver); 
    res.json({
      donation,
      donorName: donor ? donor.name : null, 
      beneficiaryName: beneficiary ? beneficiary.name : null 
    });
  } catch (err) {
    next(err); 
  }
};

export const updateOffer = async (req, res, next) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDonation) return res.status(404).json({ error: 'Donation not found' });

    const donor = await Donor.findById(updatedDonation.donor);
    const beneficiary = await Beneficiary.findById(updatedDonation.receiver);

    const result =  await createInAppNotification(req,res);
    res.json({ updatedDonation, donorName: donor?.name, beneficiaryName: beneficiary?.name , result});
  } catch (err) {
    next(err); 
  }
};

export const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    const donor = await Donor.findById(donation.donor);
    const beneficiary = await Beneficiary.findById(donation.receiver);

    await Donation.findByIdAndDelete(req.params.id);

    const result =  await createInAppNotification(req,res);
    res.json({ message: 'Donation deleted successfully', donorName: donor?.name, beneficiaryName: beneficiary?.name , result});
  } catch (err) {
    next(err);
  }
};

export const takeOffer = async (req, res, next) => {
  try {
    const { offerId, beneficiaryId } = req.body;

    const offer = await DonationOffer.findById(offerId);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    if (offer.status !== 'available') return res.status(400).json({ error: 'Offer is not available' });

    offer.receiver = beneficiaryId;
    offer.status = 'not available';
    await offer.save();

    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found' });

    beneficiary.receivedDonations.push(offer._id);
    await beneficiary.save();

    const result1 =  await createInAppNotification(req,res);
    const result2 =  await CreateEmailNotification(req,res);
    res.json({ message: 'Offer accepted by beneficiary', offer, beneficiaryName: beneficiary.name, result1, result2 });
  } catch (err) {
    next(err);
  }
};

export const fulfillRequest = async (req, res, next) => {
  try {
    const { requestId, donorId, quantity } = req.body;

    const request = await DonationRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.sender = donorId;
    request.receivedQuantity += quantity;

    if (request.receivedQuantity === request.quantity) {
      request.goal = true;
      request.status = 'not available';
    }

    await request.save();

    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });

    donor.donations.push(request._id);
    await donor.save();

    const result =  await createInAppNotification(req,res);
    res.json({ message: 'Request fulfilled by donor', request, donorName: donor.name, result });
  } catch (err) {
    next(err);
  }
};

export const matchRequestWithOffer = async (req, res, next) => {
  try {
    const { requestId, offerId } = req.body;

    const request = await DonationRequest.findById(requestId);
    const offer = await DonationOffer.findById(offerId);

    if (offer.donationType === request.donationType && offer.location === request.location) {
      const beneficiary = await Beneficiary.findById(request.beneficiary);
      const donor = await Donor.findById(offer.donor);

      const result =  await notifyMatch(req,res);
      res.status(200).json({ message: 'Match found', request, offer, beneficiaryName: beneficiary?.name, donorName: donor?.name, result });
    } else {
      res.status(400).json({ message: 'No match found' });
    }
  } catch (err) {
    next(err); 
  }
};

export const updateRequest = async (req, res, next) => {
  const { id } = req.params;
  const { newQuantity, description, location } = req.body;

  try {
    const request = await DonationRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.quantity = newQuantity;
    if (description) request.description = description;
    if (location) request.location = location;

    await request.save();

    const beneficiary = await Beneficiary.findById(request.beneficiary);

    const result =  await notifyUpdateRequest(req,res);
    res.status(200).json({ message: 'Request updated successfully', request, beneficiaryName: beneficiary?.name , result });
  } catch (err) {
    next(err);
  }
};

// Get Donation Requests by User ID
export const getDonationRequests = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const donationRequests = await DonationRequest.find({ beneficiary: userId }).populate('sender').sort({ createdAt: -1 });

    const beneficiary = await Beneficiary.findById(userId);

    res.status(200).json({ donationRequests, beneficiaryName: beneficiary?.name });
  } catch (err) {
    next(err);
  }
};

export const getDonationOffers = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const donationOffers = await DonationOffer.find({ donor: userId })
      .populate('donor receiver')
      .sort({ createdAt: -1 });

    const donor = await Donor.findById(userId);

    res.status(200).json({ donationOffers, donorName: donor?.name });
  } catch (err) {
    next(err);
  }
};

export const getDonationsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userRole = req.user.role;

    let result = {};

    if (userRole === 'Beneficiary') {
      const donationRequests = await DonationRequest.find({ beneficiary: userId }).populate('beneficiary sender').sort({ createdAt: -1 });
      const receivedDonations = await DonationOffer.find({ receiver: userId }).populate('donor receiver').sort({ createdAt: -1 });

      const beneficiary = await Beneficiary.findById(userId);

      result = { donationRequests, receivedDonations, beneficiaryName: beneficiary?.name };
    } else if (userRole === 'Donor') {
      const donationOffers = await DonationOffer.find({ donor: userId }).populate('donor receiver').sort({ createdAt: -1 });
      const sentDonations = await DonationRequest.find({ sender: userId }).populate('beneficiary sender').sort({ createdAt: -1 });

      const donor = await Donor.findById(userId);

      result = { donationOffers, sentDonations, donorName: donor?.name };
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getReceivedDonationsByBeneficiaryId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching received donations for beneficiary ID: ${userId}`); 

    const receivedDonations = await DonationOffer.find({ receiver: userId })
      .populate('donor') 
      .sort({ createdAt: -1 }); 

    if (!receivedDonations.length) {
      console.log(`No received donations found for beneficiary ID: ${userId}`);
    } else {
      console.log(`Received donations: ${JSON.stringify(receivedDonations)}`);
    }

    const beneficiary = await Beneficiary.findById(userId);
    if (!beneficiary) {
      console.log(`Beneficiary not found for ID: ${userId}`);
    } else {
      console.log(`Beneficiary found: ${beneficiary.name}`);
    }

    res.status(200).json({
      receivedDonations,
      beneficiaryName: beneficiary ? beneficiary.name : null 
    });
  } catch (err) {
    console.error('Error fetching received donations:', err);
    next(err);
  }
};

export const getSentDonationsByDonorId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching donations for donor ID: ${userId}`); 

    const donor = await Donor.findById(userId).populate('donations');
    console.log(`Donor found: `, donor); 

    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.status(200).json({
      donations: donor.donations, 
      donorName: donor.name 
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};