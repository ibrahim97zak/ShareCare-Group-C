import User  from '../models/User.js';
import jwt from 'jsonwebtoken';
import Bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import Donor from '../models/Donor.js';
import Beneficiary from '../models/Beneficiary.js';
import { validationResult } from 'express-validator';
import jwtUtils from '../utils/jwtUtils.js';
import emailjs from 'emailjs-com';

export async function sendEmail(to, userName, subject, verificationLink) {
  // Define the HTML body for the email
  var html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Email from Sahre-Care (Sahim)</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              color: #333333;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 20px;
              border: 1px solid #dddddd;
              box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
          }
          .header {
              background-color: #007BFF;
              color: #ffffff;
              padding: 10px;
              text-align: center;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
              line-height: 1.6;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: #888888;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Sahre-Care (Sahim)</h1>
          </div>
          <div class="content">
              <p>Dear ${userName},</p>
              <p>We are excited to inform you about ${subject}.</p>
              <p>${verificationLink}</p>
              <p>Thank you for choosing Sahre-Care (Sahim).</p>
              <p>Best regards,<br>Sahre-Care (Sahim) Team</p>
          </div>
          <div class="footer">
              <p>Sahre-Care (Sahim), All rights reserved.<br>123 Knowledge Street, Education City</p>
              <p><a href="#">Unsubscribe</a></p>
          </div>
      </div>
  </body>
  </html>`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

  try {
    let info = await transporter.sendMail({
      from: { name: 'Sahre-Care (Sahim)', address: process.env.EMAIL },
      to: to,
      subject: subject,
      html: html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}


export async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, name, gender, email, password, confirmPassword, phone, role, location } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    // Hash the password
    const hashedPassword = Bcrypt.hash(password, process.env.SALT_ROUNDS);

    // Create new user
    const newUser = new User({
      userName,
      name,
      gender,
      email,
      password: hashedPassword,
      phone,
      role,
      location
    });


    // Generate JWT token
const token = jwtUtils.generateToken({
  user: {
    id: newUser.id,
    userType: newUser.userType
  }
},
process.env.JWT_SECRET, // Replace with your actual secret key
{ expiresIn: '1h' } // Optional: set expiration time
);

newUser.isVerified = false;
await newUser.save();
const verificationLink = `http://localhost:5000/api/auth/confirm-email?email=${email}&token=${token}`;

sendEmail(email, userName, 'Email Verification', `Click the following link to verify your email: ${verificationLink}`);


confirmEmail(req, res);


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
  if(jwtUtils.verifyToken(token)){
  user.isVerified = true; // Assuming you have a 'verified' field
  user.verificationToken = undefined; // Clear the token after verification
  }
  await user.save();

  res.send('Your email has been Confirmed successfully!, Log in now');
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

    const token = jwtUtils.generateToken(payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      //(err, token) => {
       // if (err) throw err;
       //}
      );
      res.json({ token });
      
    /**jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );**/

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
    const hashedPassword = await Bcrypt.hash(newPassword, process.env.SALT_ROUNDS);
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
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email, user not found' });
    }

    // Hash the password before saving
    const hashedPassword = await Bcrypt.hash(password, process.env.SALT_ROUNDS);
    user.password = hashedPassword;

    await user.save();
    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).send('Server error, reset password failed: ' + err.message);
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.json({ success: true });
}

