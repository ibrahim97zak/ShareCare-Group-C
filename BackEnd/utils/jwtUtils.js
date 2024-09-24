// utils/jwtUtils.js

import { sign, verify, decode } from 'jsonwebtoken';
import { promisify } from 'util';

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Promisify jwt.sign and jwt.verify
const signAsync = promisify(sign);
const verifyAsync = promisify(verify);

const jwtUtils = {
  /**
   * Generate a JWT token
   * @param {Object} payload - Data to be encoded in the token
   * @returns {Promise<string>} The generated JWT token
   */
  generateToken: async (payload) => {
    try {
      const token = await signAsync(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return token;
    } catch (error) {
      throw new Error('Error generating token');
    }
  },

  /**
   * Verify a JWT token
   * @param {string} token - The token to verify
   * @returns {Promise<Object>} The decoded token payload
   */
  verifyToken: async (token) => {
    try {
      const decoded = await verifyAsync(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  /**
   * Extract token from request headers
   * @param {Object} req - Express request object
   * @returns {string|null} The token or null if not found
   */
  extractTokenFromHeader: (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  },

  /**
   * Decode a JWT token without verifying
   * @param {string} token - The token to decode
   * @returns {Object|null} The decoded token payload or null if invalid
   */
  decodeToken: (token) => {
    try {
      return decode(token);
    } catch (error) {
      return null;
    }
  }
};

export default jwtUtils;