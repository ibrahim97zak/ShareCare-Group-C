import Rating from '../models/Rating.js';
import Donation from '../models/Donation.js';
import Beneficiary from '../models/Beneficiary.js';
import Donor from '../models/Donor.js';

// @desc    Create a new rating
// @route   POST /api/ratings
// @access  Private (Beneficiary only)
export const createRating = async (req, res) => {
  try {
    const { ratedId, donationId, score, comment } = req.body;

    // Check if the donation exists
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if the ratedId (Donor) exists
    const donor = await Donor.findById(ratedId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Create a new rating
    const newRating = new Rating({
      raterId: req.user.id, // Assuming req.user contains the authenticated beneficiary's ID
      ratedId,
      donationId,
      score,
      comment
    });

    await newRating.save();

    res.status(201).json(newRating);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all ratings
// @route   GET /api/ratings
// @access  Public
export const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate('raterId', 'name') // Get beneficiary's name
      .populate('ratedId', 'name') // Get donor's name
      .populate('donationId', 'donationType quantity location'); // Get donation details

    res.json(ratings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get rating by ID
// @route   GET /api/ratings/:id
// @access  Public
export const getRatingById = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate('raterId', 'name')
      .populate('ratedId', 'name')
      .populate('donationId', 'donationType quantity location');

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json(rating);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Update a rating
// @route   PUT /api/ratings/:id
// @access  Private (Beneficiary only)
export const updateRating = async (req, res) => {
  try {
    const { score, comment } = req.body;

    let rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Ensure the logged-in user is the rater (beneficiary)
    if (rating.raterId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update fields
    rating.score = score || rating.score;
    rating.comment = comment || rating.comment;
    rating.updatedAt = Date.now();

    await rating.save();

    res.json(rating);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Delete a rating
// @route   DELETE /api/ratings/:id
// @access  Private (Beneficiary only)
export const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Ensure the logged-in user is the rater (beneficiary)
    if (rating.raterId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await rating.remove();

    res.json({ message: 'Rating removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Get ratings by donor (for a specific donor)
// @route   GET /api/ratings/donor/:donorId
// @access  Public
export const getRatingsByDonor = async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedId: req.params.donorId })
      .populate('raterId', 'name')
      .populate('donationId', 'donationType quantity location');

    res.json(ratings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
