const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
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
  availabilityDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'delivered'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', DonationSchema);
