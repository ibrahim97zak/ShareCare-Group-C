import mongoose from 'mongoose';
import User from '../models/User.js';
import Donation from '../models/Donation.js';

// Test function to ensure singleton pattern works
const testSingleton = async () => {
  await mongoose.connect('mongodb+srv://sahem:2024@sahem.uhod4.mongodb.net/');

  // Create an instance of User and Donation models
  const userInstance1 = User;
  const userInstance2 = User;

  const donationInstance1 = Donation;
  const donationInstance2 = Donation;

  // Check if both user instances point to the same model
  console.log('User Singleton Test: ', userInstance1 === userInstance2); // Should be true

  // Check if both donation instances point to the same model
  console.log('Donation Singleton Test: ', donationInstance1 === donationInstance2); // Should be true

  await mongoose.disconnect();
};

testSingleton();
