import mongoose from 'mongoose';
import User from './User.js';

const BeneficiarySchema = new mongoose.Schema({
  description: { 
    type: String 
  }
});

const Beneficiary = User.discriminator('Beneficiary', BeneficiarySchema);
//module.exports = Beneficiary;
export default Beneficiary;

