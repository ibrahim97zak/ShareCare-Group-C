import DonationOffer from '../models/DonationOffer.js';
import Donation from '../models/Donation.js';
import { find as _find } from '../models/User.js';
import { create as createNotification } from '../models/Notification.js';

export async function createDonationOffer(req, res) {
  try {
    const { donationId } = req.body;

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const newDonationOffer = new DonationOffer({
      donorId: req.user.id,
      donationId,
    });

    await newDonationOffer.save();

    const beneficiaries = await _find({ userType: 'Beneficiary' });
    for (let beneficiary of beneficiaries) {
      await createNotification({
        userId: beneficiary._id,
        type: 'offer_received',
        content: `You have received an offer for ${donation.donationType}`,
        relatedId: newDonationOffer._id,
        onModel: 'DonationOffer'
      });
    }

    res.status(201).json(newDonationOffer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function getDonationOffers(req, res) {
  try {
    const donationOffers = await DonationOffer.find().populate('donorId', 'name').populate('donationId', 'donationType');
    res.json(donationOffers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function getDonationOfferById(req, res) {
  try {
    const donationOffer = await DonationOffer.findById(req.params.id).populate('donorId', 'name').populate('donationId', 'donationType');
    if (!donationOffer) {
      return res.status(404).json({ message: 'Donation offer not found' });
    }
    res.json(donationOffer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donation offer not found' });
    }
    res.status(500).send('Server error');
  }
}

export async function updateDonationOffer(req, res) {
  try {
    const { donationId } = req.body;
    let donationOffer = await DonationOffer.findById(req.params.id);

    if (!donationOffer) {
      return res.status(404).json({ message: 'Donation offer not found' });
    }

    if (donationOffer.donorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (donationId) {
      donationOffer.donationId = donationId;
    }
    donationOffer.updatedAt = Date.now();

    await donationOffer.save();
    res.json(donationOffer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donation offer not found' });
    }
    res.status(500).send('Server error');
  }
}

export async function deleteDonationOffer(req, res) {
  try {
    const donationOffer = await DonationOffer.findById(req.params.id);

    if (!donationOffer) {
      return res.status(404).json({ message: 'Donation offer not found' });
    }

    if (donationOffer.donorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await donationOffer.remove();
    res.json({ message: 'Donation offer removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donation offer not found' });
    }
    res.status(500).send('Server error');
  }
}
