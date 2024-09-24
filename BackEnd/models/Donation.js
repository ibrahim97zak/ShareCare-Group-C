import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donationType: {
    type: String,
    required: true,
    enum: ['clothing', 'food', 'money', 'medicines', 'books', 'furniture', 'other']
  },
  quantity: {
    type: Number
  },
  description: {
    type: String
  },
  location: { 
    type: String 
  },
  availabilityDate: {
    type: Date,
    required: true
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: { 
    type: Date,  
    default: Date.now
  }
});

DonationSchema.pre('save', function(next) {
  if (this.goal === true) {
    this.status = 'completed'; 
  }
  next();
});

export default mongoose.model('Donation', DonationSchema);