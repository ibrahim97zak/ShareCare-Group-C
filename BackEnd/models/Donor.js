import mongoose from 'mongoose';
import User from './User.js';

const DonorSchema = new mongoose.Schema({
  offers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  }],
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }]
});

const Donor = User.discriminator('Donor', DonorSchema);
export default Donor;
