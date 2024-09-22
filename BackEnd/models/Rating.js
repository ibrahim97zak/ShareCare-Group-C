const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  raterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Beneficiary', 
    required: true 
  },
  ratedId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donor', 
    required: true 
  },
  donationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donation', 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  comment: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  }
});

const Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;
