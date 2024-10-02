import mongoose from 'mongoose';
import singletonModel from './SingletonModel.js'; 

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
    enum: ['available', 'not available'],
    default: 'available'
  },

}, {
  discriminatorKey: 'donationRole',
  collection: 'donations',
  timestamps: true
});

const Donation = singletonModel('Donation', DonationSchema);
export default Donation;
