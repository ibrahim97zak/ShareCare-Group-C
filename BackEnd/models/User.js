import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
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
  isVerified: {
    type: Boolean
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

export default model('User', UserSchema);