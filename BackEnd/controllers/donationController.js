import Donation  from '../models/Donation.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export async function createDonation(req, res) {
  try {
    const { donationType, quantity, location } = req.body;
    const newDonation = new Donation({
      donationType,
      quantity,
      location,
      donor: req.user.id
    });

    await newDonation.save();

    // Notify potential beneficiaries
    const beneficiaries = await _find({ userType: 'beneficiary' });
    for (let beneficiary of beneficiaries) {
      await create({
        userId: beneficiary._id,
        type: 'donation_match',
        content: `A new ${donationType} donation is available in ${location}`,
        relatedId: newDonation._id,
        onModel: 'Donation'
      });
    }

    res.status(201).json(newDonation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function getDonations(req, res) {
  try {
    const donations = await find().populate('donor', 'name');
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function getDonationById(req, res) {
  try {
    const donation = await findById(req.params.id).populate('donor', 'name');
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(500).send('Server error');
  }
}

export async function updateDonation(req, res) {
  try {
    const { donationType, quantity, location, status } = req.body;
    let donation = await findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.donor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    donation.donationType = donationType || donation.donationType;
    donation.quantity = quantity || donation.quantity;
    donation.location = location || donation.location;
    donation.status = status || donation.status;
    donation.updatedAt = Date.now();

    await donation.save();
    res.json(donation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(500).send('Server error');
  }
}

export async function deleteDonation(req, res) {
  try {
    const donation = await findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.donor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await donation.remove();
    res.json({ message: 'Donation removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(500).send('Server error');
  }
}