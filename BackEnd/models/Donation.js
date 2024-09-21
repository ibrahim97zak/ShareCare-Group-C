const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donationType: {
    type: String,
    required: true,
    enum: ['clothing', 'food', 'money', 'medicines', 'books', 'furniture', 'other']
  },
  quantity: {
    type: Number
  },
  description: {
    type: String
  },
  location: { 
    type: String 
  },
  availabilityDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'requested', 'completed'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: { 
    type: Date,  // Corrected here
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', DonationSchema);
