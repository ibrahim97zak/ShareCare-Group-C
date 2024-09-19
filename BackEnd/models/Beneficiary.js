const mongoose = require('mongoose');
const User = require('./User');

const BeneficiarySchema = new mongoose.Schema({
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  }]
});

module.exports = User.discriminator('Beneficiary', BeneficiarySchema);
