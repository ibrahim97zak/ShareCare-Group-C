// src/utils/validateLogin.js
import Joi from 'joi';

// Improved email regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().pattern(emailRegex).required().messages({
      'string.empty': 'Email is required',
      'string.pattern.base': 'Please enter a valid email',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export default validateLogin;