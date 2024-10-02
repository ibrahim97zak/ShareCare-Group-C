import mongoose from 'mongoose';
import User from './User.js';
import singletonModel from './SingletonModel.js'; 

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
export default singletonModel('Donor', DonorSchema);
