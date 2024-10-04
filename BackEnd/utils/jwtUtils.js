import jwt from 'jsonwebtoken';

const jwtUtils = {
  generateToken: async (payload) => {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
      }

      if (!process.env.JWT_EXPIRES_IN || typeof process.env.JWT_EXPIRES_IN !== 'string') {
        throw new Error('JWT_EXPIRES_IN environment variable must be a non-empty string');
      }

      const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      return token;
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error(`Error generating token: ${error.message}`);
    }
  },

  verifyToken: (token) => {
    try {
      if (!token) {
        throw new Error('jwt must be provided');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('decoded:', decoded);
      return decoded;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Error verifying token');
    }
  },

  extractTokenFromHeader: (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  },

  decodeToken: (token) => {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};

export default jwtUtils;