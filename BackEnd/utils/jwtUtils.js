import jwt from 'jsonwebtoken';

const jwtUtils = {
  generateToken: async (payload) => {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret key is not set');
    }
    try {
      const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      return token;
    } catch (error) {
      throw new Error(`Error generating token: ${error.message}`);
    }
  },

  verifyToken: (token) => {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret key is not set');
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.exp < Date.now() / 1000) {
        throw new Error('Token has expired');
      }
      return decoded;
    } catch (error) {
      throw new Error(`Error verifying token: ${error.message}`);
    }
  },
};

export default jwtUtils;