import mongoose from 'mongoose';
import Donation from './Donation.js';

const DonationRequestSchema = new mongoose.Schema({
  beneficiary: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Beneficiary', 
    required: true 
  },
  sender: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donor', 
    default: null
  }],
  receivedQuantity: { 
    type: Number, 
    default: 0 
  },
    goal: {
    type: Boolean,
    default: false
  },
});

const DonationRequest = Donation.discriminator('Request', DonationRequestSchema);
export default DonationRequest;