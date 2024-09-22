const mongoose = require('mongoose');

const DonationOfferSchema = new mongoose.Schema({
  donorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donor', 
    required: true 
 },
  donationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donation', 
    required: true 
  }
});

const DonationOffer = mongoose.model('DonationOffer', DonationOfferSchema);
module.exports = DonationOffer;
