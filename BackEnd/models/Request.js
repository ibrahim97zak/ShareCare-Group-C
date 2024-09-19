const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  needType: {
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
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'closed'],
    default: 'pending'
  },
  dateRequested: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', RequestSchema);
