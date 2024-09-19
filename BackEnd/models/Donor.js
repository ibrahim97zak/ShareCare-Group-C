const mongoose = require('mongoose');
const User = require('./User');

const DonorSchema = new mongoose.Schema({
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }]
});

module.exports = User.discriminator('Donor', DonorSchema);
