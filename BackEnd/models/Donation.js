import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  donationType: {
    type: String,
    required: true,
    enum: ['clothes', 'food', 'money', 'medicines', 'books', 'furniture', 'other']
  },
  quantity: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  location: { 
    type: String 
  },
  status: {
    type: String,
    enum: ['available', 'completed'],
    default: 'available'
  },
  goal: {
    type: Boolean,
    default: false
  },
}, {
  discriminatorKey: 'donationRole',
  collection: 'donations',
  timestamps: true
});

DonationSchema.pre('save', function(next) {
  if (this.goal === true) {
    this.status = 'completed'; 
  }
  next();
});

const Donation = mongoose.model('Donation', DonationSchema);
export default Donation;
