import User  from '../models/User.js';
import jwt from 'jsonwebtoken';
import Bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { validationResult } from 'express-validator';

//const { sign } = pkg;

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, name, gender, email, password, phone, userType, location } = req.body;

  try {
    // Check if the user already exists by email or username
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      name,
      gender,
      email,
      password,
      phone,
      userType,
      location
    });

    // Hash the password before saving
    const hashedPassword = await Bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Save the user in the database
    await user.save();

    // Generate a JWT token for the new user
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
      async (err, token) => {
        if (err) throw err;

        // Send token in the response
        res.json({ token });

        // Send verification email after the token is generated
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        // Construct the verification link using the token
        const verificationLink = `http://localhost:5000/verify-email/${token}`;

        // Send the email
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Email Verification',
          text: `Click the following link to verify your email: ${verificationLink}`
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, Signup failed');
  }
}

export async function verifyEmail (req,res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { token } = req.params;
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = User.find(u => u.email === decoded.email);
        
        if (!user) return res.status(400).send('Invalid token');
        if (user.isVerified) return res.status(400).send('Email already verified');

        // Set user as verified
        user.isVerified = true;
        res.send('Email verified successfully!');
    } catch (error) {
        res.status(400).send('Invalid or expired token');
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

