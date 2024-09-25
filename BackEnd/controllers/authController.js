import User  from '../models/User.js';
import jwt from 'jsonwebtoken';
import Bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import pkg from 'google-auth-library';
import { validationResult } from 'express-validator';


export async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, name, gender, email, password, phone, userType, location } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await Bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      name,
      gender,
      email,
      password: hashedPassword,
      phone,
      userType,
      location
    });

    // Save the user
    await newUser.save();

    // Generate JWT token
const token = jwt.sign(
  {
    user: {
      id: newUser.id,
      userType: newUser.userType
    }
  },
  process.env.JWT_SECRET, // Replace with your actual secret key
  { expiresIn: '1h' } // Optional: set expiration time
);


// Send verification email
/**const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
  }
});**/

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
  }
});

const verificationLink = `http://localhost:5000/api/auth/confirm-email?email=${email}&token=${token}`;
await transporter.sendMail({
  from: process.env.EMAIL,
  to: email,
  subject: 'Email Verification',
  text: `Click the following link to verify your email: ${verificationLink}`
});

res.send('Registration successful! Please check your email for verification.');

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
}

export async function confirmEmail(req, res) {
  const { email,token } = req.query;

  // Find the user with the provided email and token
  const user = await User.findOne({ email});

  if (!user) {
    return res.status(400).send('Invalid token or email.');
  }

  // Token is valid, verify the user
  user.isVerified = true; // Assuming you have a 'verified' field
  user.verificationToken = undefined; // Clear the token after verification
  await user.save();

  res.send('Your email has been Confirmed successfully!');
}


export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    const isMatch = await Bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        userType: user.userType
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, login failed');
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error, get profile failed :' + err.message);
  }
}

export async function changePassword(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { oldPassword, newPassword, confirmNewPassword} = req.body;
  try {
    let user = await User.findById(req.user.id);
    const isMatch = await Bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if(newPassword !== confirmNewPassword){
      return res.status(400).json({ message: 'New password confirmation does not match new password' });
    }
    const hashedPassword = await Bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json("The password was changed successfully" + user);
  } catch (err) {
    res.status(500).send('Server error, change password failed' + err.message);
  }
}


// Verify Email Function
async function verifyEmail(email) {
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return "No associated user with this email"; // Email not found
    }
    return user; // Email found, return the user object
  } catch (error) {
    throw new Error('Error verifying email');
  }
}

export async function resetPassword(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    // Verify the email
    let user = await verifyEmail(email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email, user not found' });
    }

    // Hash the password before saving
    const hashedPassword = await Bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ msg: 'Password reset successful'});
  } catch (err) {
    res.status(500).send('Server error, reset password failed: ' + err.message);
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.json({ success: true });
}

