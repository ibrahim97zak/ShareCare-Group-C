import mongoose from 'mongoose';
import singletonModel from './SingletonModel.js'; 

const UserSchema = new mongoose.Schema({
  userName: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: { 
    type: String, 
    enum: ['Admin', 'Donor', 'Beneficiary'], 
    required: true 
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
  location: { 
    type: String 
  },
  description: {
    type: String
  },
  isVerified: {
    type: Boolean
  },
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  profilePicture:{
      type:String,
      default:""
  }

}, {
  timestamps: true,
  discriminatorKey: 'role'
});

const User = singletonModel('User', UserSchema);
export default User;
