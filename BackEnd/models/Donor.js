import mongoose from 'mongoose';
//const User = require('./User');
import User from './User.js';

const DonorSchema = new mongoose.Schema({
  availableDonations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }],
  type: { 
    type: String, 
    required: true 
  }
});

const Donor = User.discriminator('Donor', DonorSchema);
export default Donor;
