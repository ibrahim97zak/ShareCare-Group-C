//const mongoose = require('mongoose');
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  userType: { 
    type: String, 
    enum: ['Donor', 'Beneficiary'], 
    required: true 
  },
  location: { 
    type: String 
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

export default mongoose.model('User', UserSchema);