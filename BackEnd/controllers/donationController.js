import Donation  from '../models/Donation.js';
import User from '../models/User.js';
import DonationOffer from '../models/DonationOffer.js';
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';
import { notifyDonationDeleted, notifyDonationFulfilled, notifyDonationUpdated } from '../utils/notificationUtils.js';

export async function createDonation(req, res) {
  try {
    const { donationType, quantity, location, availabilityDate } = req.body;
    const newDonation = new Donation({
      donationType,
      quantity,
      location,
      availabilityDate,
      donor: req.user.id
    });

    await newDonation.save();

    // Notify potential beneficiaries
    const beneficiaries = await User.find({ userType: 'beneficiary' });
    for (let beneficiary of beneficiaries) {
      await create({
        userId: beneficiary._id,
        type: 'donation_match',
        content: `A new ${donationType} donation is available in ${location}`,
        relatedId: newDonation._id,
        onModel: 'Donation'
      });
    }
    // notify Donor
    notifyDonationFulfilled(req.user.id, donationType);

    res.status(201).json(newDonation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error create donation failed');
  }
}

export async function getDonations(req, res) {
  try {
    const donations = await Donation.find().populate('donor', 'name');
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, fetching donations failed');
  }
}

export async function getDonationById(req, res) {

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid donation ID' });
  }

  try {
    const donation = await Donation.findById(req.params.id).populate('donor', 'name');
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(500).send('Server error, fethcing donation failed');
  }
}

export async function updateDonation(req, res) {
  try {
    const { donationType, quantity, location, availabilityDate, status } = req.body;
    let donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.donor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    donation.donationType = donationType || donation.donationType;
    donation.quantity = quantity || donation.quantity;
    donation.location = location || donation.location;
    donation.availabilityDate = availabilityDate || donation.availabilityDate;
    donation.status = status || donation.status;
    donation.updatedAt = Date.now();

    // notify 
    notifyDonationUpdated(req.user.id, donationType);

    await donation.save();
    res.json(donation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(500).send('Server error , Update donation failed');
  }
}

export async function deleteDonation(req, res) {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.donor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Donation.deleteOne({ _id: req.params.id });
    //notify
    notifyDonationDeleted(req.user.id, donation.donationType);

    res.json({ message: 'Donation removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(500).send('Server error , Removing donation failed');
  }
}