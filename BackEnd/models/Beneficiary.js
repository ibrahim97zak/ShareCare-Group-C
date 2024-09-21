const mongoose = require('mongoose');
const User = require('./User');

const BeneficiarySchema = new mongoose.Schema({
  description: { 
    type: String 
  }
});

const Beneficiary = User.discriminator('Beneficiary', BeneficiarySchema);
module.exports = Beneficiary;
