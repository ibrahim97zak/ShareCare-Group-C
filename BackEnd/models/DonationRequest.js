const mongoose = require('mongoose');

const DonationRequestSchema = new mongoose.Schema({
  beneficiaryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Beneficiary', 
    required: true 
  },
  donationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donation', 
    required: true 
  }
});

const DonationRequest = mongoose.model('DonationRequest', DonationRequestSchema);
module.exports = DonationRequest;
