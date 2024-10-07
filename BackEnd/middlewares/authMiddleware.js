import userModel from "../models/User.js";
import { asyncHandler } from "../utils/errorHandler.js";
import jwtUtils from '../utils/jwtUtils.js';

const roles = {
  Admin: 'Admin',
  User: ['Donor', 'Beneficiary']
};

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization?.startsWith(process.env.BEARERKEY)) {
    return next(new Error("invalid bearer key", { cause: 400 }));
  }
  const token = authorization.split(process.env.BEARERKEY)[1];

  if (!token) {
    return next(new Error("invalid token", { cause: 400 }));
  }
  const decoded = jwtUtils.verifyToken(token, process.env.JWT_SECRET);
  console.log('decoded.id:', decoded.user.id);
  if (!decoded) {
    return next(new Error("invalid token payload", { cause: 400 }));
  }
  const user = await userModel.findById(decoded.user.id).select('userName role');
  if (!user) {
    return next(new Error("not registered user", { cause: 401 }));
  }
  req.user = user;
  console.log('req.user:', req.user); // Add this logging statement

  req.isAdmin = user.role === roles.Admin;
  req.isDonor = user.role === roles.User[0];
  req.isBeneficiary = user.role === roles.User[1];
  next();
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