const mongoose = require('mongoose');
const User = require('./User');

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

module.exports = User.discriminator('Donor', DonorSchema);
module.exports = Donor;
