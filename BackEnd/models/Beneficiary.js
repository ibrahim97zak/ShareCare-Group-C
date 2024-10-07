import mongoose from 'mongoose';
import User from './User.js';
import singletonModel from './SingletonModel.js'; 

const BeneficiarySchema = new mongoose.Schema({
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  }],
  receivedDonations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }]
});

const Beneficiary = User.discriminator('Beneficiary', BeneficiarySchema);
export default singletonModel('Beneficiary', BeneficiarySchema);
