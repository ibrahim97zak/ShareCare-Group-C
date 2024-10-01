import User from '../models/User.js';
import Donor from '../models/Donor.js';
import Beneficiary from '../models/Beneficiary.js';

export const createUser = async (req, res, next) => {
  try {
    const { role, ...userData } = req.body;  

    let newUser;

    if (role === 'Donor') {
      newUser = new Donor(userData);
    } else if (role === 'Beneficiary') {
      newUser = new Beneficiary(userData);
    } else {
      newUser = new User(userData);
    }

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
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

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
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
