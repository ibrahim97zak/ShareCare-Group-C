import mongoose from 'mongoose';
import Donation from './Donation.js'; 
import singletonModel from './SingletonModel.js'; 

const DonationOfferSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    default: null
  }
});

const DonationOffer = Donation.discriminator('Offer', DonationOfferSchema);
export default singletonModel('Offer', DonationOfferSchema);
