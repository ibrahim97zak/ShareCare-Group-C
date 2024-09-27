import dotenv from 'dotenv';
import pkg from 'jsonwebtoken';

dotenv.config();
const { sign, verify, decode } = pkg;

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const jwtUtils = {
  /**
   * Generate a JWT token
   * @param {Object} payload - Data to be encoded in the token
   * @returns {string} The generated JWT token (synchronous)
   */
  generateToken: (payload) => {
    try {
      // Synchronously sign and return the token
      const token = sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return token;
    } catch (error) {
      throw new Error('Error generating token');
    }
  },

  /**
   * Verify a JWT token
   * @param {string} token - The token to verify
   * @returns {Object} The decoded token payload
   */
  verifyToken: (token) => {
    try {
      // Synchronously verify and return the decoded payload
      const decoded = verify(token, JWT_SECRET);
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
