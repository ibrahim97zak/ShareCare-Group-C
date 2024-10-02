import mongoose from 'mongoose'; 
import DonationOffer from '../models/DonationOffer.js';
import DonationRequest from '../models/DonationRequest.js';
import Donation from '../models/Donation.js';
import Notification from '../models/Notification.js';
import Beneficiary from '../models/Beneficiary.js'; 
import Donor from '../models/Donor.js';

export const createDonationOffer = async (req, res, next) => {
  try {
    const { donorId, ...offerData } = req.body;

    const newOffer = new DonationOffer(offerData);
    const savedOffer = await newOffer.save();

    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ error: 'Donor not found' });

    donor.offers.push(savedOffer._id);
    await donor.save();

    res.status(201).json({ message: 'Donation offer created', savedOffer });
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

    res.status(201).json({ message: 'Request created', savedRequest });
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
    res.json(donation);
  } catch (err) {
    next(err);
  }
};

export const updateDonation = async (req, res, next) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDonation) return res.status(404).json({ error: 'Donation not found' });
    res.json(updatedDonation);
  } catch (err) {
    next(err); 
  }
};

export const deleteDonation = async (req, res, next) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donation deleted' });
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

    res.json({ message: 'Offer accepted by beneficiary', offer });
  } catch (err) {
    next(err);
  }
};

export const fulfillRequest = async (req, res, next) => {
  try {
    const { requestId, donorId, quantity } = req.body;

    const request = await DonationRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.goal) return res.status(400).json({ error: 'Request goal has already been met' });

    const remainingQuantity = request.quantity - request.receivedQuantity;
    if (quantity > remainingQuantity) {
      return res.status(400).json({ error: `Requested quantity exceeded. Only ${remainingQuantity} units are needed.` });
    }

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

    res.json({ message: 'Request fulfilled by donor', request });
  } catch (err) {
    next(err);
  }
};

export const matchRequestWithOffer = async (req, res, next) => {
  try {
    const { requestId, offerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId) || !mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({ error: 'Invalid requestId or offerId format' });
    }

    const request = await Donation.findById(requestId);
    const offer = await Donation.findById(offerId);

    if (!request || request.donationRole !== 'Request') {
      return res.status(404).json({ error: 'Request not found or invalid type' });
    }

    if (!offer || offer.donationRole !== 'Offer') {
      return res.status(404).json({ error: 'Offer not found or invalid type' });
    }

    if (offer.donationType === request.donationType && offer.location === request.location) {
      const beneficiaryNotification = new Notification({
        userId: request.beneficiary, 
        type: 'match',
        content: `A new offer matches your request for ${request.donationType} at ${request.location}.`,
      });

      const donorNotification = new Notification({
        userId: offer.donor,
        type: 'match',
        content: `Your offer matches a request for ${offer.donationType} at ${offer.location}.`,
      });

      await beneficiaryNotification.save();
      await donorNotification.save();

      res.status(200).json({ message: 'Match found and notifications sent', request, offer });
    } else {
      res.status(400).json({ message: 'No match found based on donation type or location' });
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
    if (!request) {
      return res.status(404).json({ message: 'Request not found', success: false });
    }

    if (newQuantity < request.receivedQuantity) {
      return res.status(400).json({ 
        message: 'New quantity cannot be less than the already received quantity', 
        success: false 
      });
    }

    request.quantity = newQuantity;

    if (description) {
      request.description = description;
    }
    
    if (location) {
      request.location = location;
    }

    if (request.receivedQuantity >= request.quantity) {
      request.goal = true;
      request.status = 'not available';
    } else {
      request.goal = false;
      request.status = 'available';
    }

    await request.save();

    return res.status(200).json({ message: 'Request updated successfully', success: true, request });
  } catch (error) {
    next(error); 
  }
};
