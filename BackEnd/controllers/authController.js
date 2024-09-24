import User  from '../models/User.js';
import jwt from 'jsonwebtoken';
import Bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import pkg from 'google-auth-library';
import { validationResult } from 'express-validator';


const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
  EMAIL_FROM
} = process.env;

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
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
    const token = await jwtUtils.generateToken({
      user: {
        id: newUser.id,
        userType: newUser.userType
      }
    });

    // Send verification email
    await verifyEmail(email);

    // Send response
    newUser.isVerified = true;
    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
}

export async function verifyEmail (req,res) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_FROM,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email',
      text: 'Please confirm your email address to complete your registration.',
      html: '<p>Please click <a href="#">here</a> to verify your email address.</p>' // Add actual verification link
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', result.messageId);
  } catch (error) {
    res.status(500).send('Failed to send verification email' + error.message);
  }
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
    user.password = newPassword;
    await user.save();
    res.json("The password was changed successfully" + user);
  } catch (err) {
    res.status(500).send('Server error, change password failed' + err.message);
  }
}


export async function resetPassword(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password } = req.body;
  try {
    let user = await User.findOne({ _id: req.params.id });
  
  
      // Hash the password before saving
    const hashedPassword = await Bcrypt.hash(password, 10);
    user.password = hashedPassword;
    

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error, reset password failed' + err.message);
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.json({ success: true });
}

