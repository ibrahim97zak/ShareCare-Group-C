import UserSchema, { findOne, findById, findByIdAndDelete } from '../models/User';
import Donor, { findOneAndDelete } from '../models/Donor';
import Beneficiary, { findOneAndDelete as _findOneAndDelete } from '../models/Beneficiary';
import { sign } from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import sendEmail from '../utils/sendEmail';

export async function register(req, res) {
  try {
    const { username, email, password, userType, name, location } = req.body;
    
    // Check if user already exists
    let user = await findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new UserSchema({ username, email, password, userType, name, location });
    
    // Hash password
    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    // Generate email verification token
    const verificationToken = randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // Create donor or beneficiary based on userType
    if (userType === 'Donor') {
      const donor = new Donor({ user: user._id, type: req.body.donorType });
      await donor.save();
    } else if (userType === 'Beneficiary') {
      const beneficiary = new Beneficiary({ user: user._id, description: req.body.description });
      await beneficiary.save();
    }

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message: `Please click on the link to verify your email: ${verificationUrl}`
    });

    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    // Create and return JWT token
    const payload = { user: { id: user.id } };
    sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate password reset token
    const resetToken = randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send password reset email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`
    });

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function resetPassword(req, res) {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Set new password
    const salt = await genSalt(10);
    user.password = await hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.params;

    const user = await findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Verification token is invalid or has expired' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await findById(req.user.id);

    // Check current password
    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Set new password
    const salt = await genSalt(10);
    user.password = await hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export function logout(req, res) {
  // In a stateless JWT setup, logout is typically handled client-side
  // by removing the token. Here we can invalidate the token if needed.
  res.json({ message: 'Logged out successfully' });
}

export async function deleteAccount(req, res) {
  try {
    const user = await findById(req.user.id);

    // Remove associated donor or beneficiary document
    if (user.userType === 'Donor') {
      await findOneAndDelete({ user: user._id });
    } else if (user.userType === 'Beneficiary') {
      await _findOneAndDelete({ user: user._id });
    }

    // Remove user
    await findByIdAndDelete(req.user.id);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
