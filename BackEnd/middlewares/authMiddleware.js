import userModel from "../models/User.js";
import { asyncHandler } from "../utils/errorHandler.js";
import jwtUtils from '../utils/jwtUtils.js';

const roles = {
  Admin: 'Admin',
  User: ['Donor', 'Beneficiary']
};


export const authenticate = async (req, res, next) => {
  try {
    // Retrieve token from cookies
    const token = req.cookies?.token;
    console.log("token from auth",token)
    if (!token) {
      return next(new Error("Token not found in cookies", { cause: 400 }));
    }

    // Verify token
    const decoded = jwtUtils.verifyToken(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Invalid token payload", { cause: 400 }));
    }

    // Fetch user based on the decoded token
    const user = await userModel.findById(decoded.userId).select('userName role');
    if (!user) {
      return next(new Error("Not registered user", { cause: 401 }));

    }

    // Attach user and role details to the request object
    req.user = user;
    req.isAdmin = user.role === roles.Admin;
    req.isDonor = user.role === roles.User[0];
    req.isBeneficiary = user.role === roles.User[1];
    
    next();
  } catch (error) {
    next(new Error("Authentication failed", { cause: 500 }));
  }
};


export const authorize = (role) => {
  return async (req, res, next) => {
    if (req.isAdmin) {
      return next();
    }
    if (role === 'Donor' && req.isDonor) {
      return next();
    }
    if (role === 'Beneficiary' && req.isBeneficiary) {
      return next();
    }
    return next(new Error("not authorized user", { cause: 403 }));
  };
};