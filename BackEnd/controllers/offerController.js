import DonationOffer from '../models/DonationOffer.js';
import Donation from '../models/Donation.js';
import Donor from '../models/Donor.js';

// @desc    Create a new Donation Offer
// @route   POST /api/donation-offers
// @access  Private (Donor only)
export async function createOffer(req, res) {
  try {
    const { donationId } = req.body;
    const donorId = req.user.id;  // The authenticated donor's ID

    // Check if the logged-in user is a Donor
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(401).json({ message: 'Unauthorized, donor account required' });
    }

    // Check if the donation exists
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Create donation offer
    const offer = new DonationOffer({
      donorId,
      donationId,
    });

    // Save the offer
    await offer.save();

    // Optionally update the donor's available donations
    donor.availableDonations.push(donationId);
    await donor.save();

    res.status(201).json(offer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

// @desc    Get all Donation Offers
// @route   GET /api/donation-offers
// @access  Public
export async function getOffers(req, res) {
  try {
    const offers = await DonationOffer.find()
      .populate('donorId', 'username email')  // Populate donor details from the User base model
      .populate('donationId', 'donationType quantity location');  // Populate donation details
    res.json(offers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

// @desc    Get Donation Offer by ID
// @route   GET /api/donation-offers/:id
// @access  Public
export async function getOfferById(req, res) {
  try {
    const offer = await DonationOffer.findById(req.params.id)
      .populate('donorId', 'username email')
      .populate('donationId', 'donationType quantity location');

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(offer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.status(500).send('Server error');
  }
}

// @desc    Update a Donation Offer
// @route   PUT /api/donation-offers/:id
// @access  Private (Donor only)
export async function updateOffer(req, res) {
  try {
    const offer = await DonationOffer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Check if the logged-in user is the donor who created the offer
    if (offer.donorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const { donationId } = req.body;
    offer.donationId = donationId || offer.donationId;
    offer.updatedAt = Date.now();

    await offer.save();
    res.json(offer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

// @desc    Delete a Donation Offer
// @route   DELETE /api/donation-offers/:id
// @access  Private (Donor only)
export async function deleteOffer(req, res) {
  try {
    const offer = await DonationOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Check if the logged-in user is the donor who created the offer
    if (offer.donorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Remove offer
    await offer.remove();

    // Optionally remove the donation from donor's available donations
    const donor = await Donor.findById(req.user.id);
    if (donor) {
      donor.availableDonations.pull(offer.donationId);
      await donor.save();
    }

    res.json({ message: 'Offer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

// @desc    Get Donation Offers by Donor
// @route   GET /api/donation-offers/donor/:donorId
// @access  Public
export async function getOffersByDonor(req, res) {
  try {
    const offers = await DonationOffer.find({ donorId: req.params.donorId })
      .populate('donationId', 'donationType quantity location');
    
    if (!offers.length) {
      return res.status(404).json({ message: 'No offers found for this donor' });
    }

    res.json(offers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
