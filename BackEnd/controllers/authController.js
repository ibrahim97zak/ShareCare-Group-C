import User from '../models/User.js';
import Bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { validationResult } from 'express-validator';
import jwtUtils from '../utils/jwtUtils.js';
// import BeneficiaryFactory from '../models/FactoryDp/factories/BeneficiaryFactory.js';
// import DonorFactory from '../models/FactoryDp/factories/DonorFactory.js';

 
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
  </html>
  `;

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

export async function register(req, res,next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, name, gender, email, password, confirmPassword, phone, role, location } = req.body;

    // Check if the user already exists
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // let userRole;
    // if (role === 'Beneficiary') {
    //   userRole = await BeneficiaryFactory.createRole();
    // } else if (role === 'Donor') {
    //   userRole = await DonorFactory.createRole();
    // } else {
    //   return res.status(400).json({ message: 'Invalid role' });
    // }

    // Hash the password
    const hashedPassword = await Bcrypt.hash(password, 10);
    // profile pic
    const boyProfilePic= `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic= `https://avatar.iran.liara.run/public/girl?username=${userName}`;
    // Create new user
    const newUser = new User({
      userName,
      name,
      gender,
      email,
      password: hashedPassword,
      phone,
      role,
      location,
      isVerified: false,
      profilePicture: gender === "Male" ? boyProfilePic : girlProfilePic
    });

    // Save the user
    await newUser.save();

    let token;
    try {
      token = await jwtUtils.generateToken({ user: { id: newUser.id, role: newUser.role } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error generating token' });
    }

    // Send verification email
    const verificationLink = `http://localhost:5000/api/auth/confirm-email?email=${newUser.email}&token=${token}`;
    await sendEmail(newUser.email, newUser.userName, 'Email Verification', verificationLink);

    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during user creation' });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Authenticate user credentials
    const user = await User.findOne({ email });


    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ error: 'Email is not verified' });
    }

    const isValidPassword = await Bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }


    // Generate a token for the user
    const token = await  jwtUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return the token in the response
    res.json({ message: 'User  logged in successfully' ,token,user});  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export async function confirmEmail(req, res) {
  try {
    const { email, token } = req.query; // Access query parameters
    if (!token) {
      return res.status(400).json({ message: 'jwt must be provided' });
    }
    // Verify the token
    try {
      const decoded = await jwtUtils.verifyToken(token);
      console.log('Decoded token:', decoded);
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(500).json({ message: 'Error verifying token' });
    }

    // Update the user's verification status
    try {
      const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
      if (!user) {
        console.error('User not found');
        return res.status(400).json({ message: 'User not found' });
      }
      console.log('User updated:', user);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error confirming email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


export async function logout(req, res) {
  const token = req.cookies.jwtToken;
  console.log('Token before deletion:', token);
  res.clearCookie('token');
  res.json({ success: true });
}
