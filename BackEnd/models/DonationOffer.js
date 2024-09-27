import mongoose from 'mongoose';

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
export default DonationOffer;
