import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  userName: { 
    type: String, 
    required: true 
  },
  name: {
    type: String,
    required: true,
    trim: true
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