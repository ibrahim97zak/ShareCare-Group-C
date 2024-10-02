import User from '../models/User.js';
import Donor from '../models/Donor.js';
import Beneficiary from '../models/Beneficiary.js';

export const createUser = async (req, res, next) => {
  try {
    const { role, ...userData } = req.body;

    const existingUser = await User.findOne({ userName: userData.userName });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    let newUser;

    if (!role) {
      return res.status(400).json({ success: false, error: 'Role is required' });
    }

    switch (role) {
      case 'Donor':
        newUser = new Donor({ ...userData, role });  
        break;
      case 'Beneficiary':
        newUser = new Beneficiary({ ...userData, role });  
        break;
      case 'Admin':
        newUser = new User({ ...userData, role });  
        break;
      default:
        return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    const savedUser = await newUser.save();
    res.status(201).json({ success: true, user: savedUser });
  } catch (err) {
    next(err);  
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err); 
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err); 
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: err.message });
    }
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err); 
  }
};
