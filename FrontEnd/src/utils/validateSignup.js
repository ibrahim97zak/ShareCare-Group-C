// src/utils/validateSignup.js
import Joi from 'joi';

// Improved email regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateSignup = (data) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(30).required().messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
    }),
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
    }),
    email: Joi.string().pattern(emailRegex).required().messages({
      'string.empty': 'Email is required',
      'string.pattern.base': 'Please enter a valid email',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
    }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required',
    }),
    location: Joi.string().required().messages({
      'string.empty': 'Location is required',
    }),
    role: Joi.string().valid('Donor', 'Beneficiary').required().messages({
      'string.empty': 'User type is required',
      'string.invalid': 'Invalid user type',
    }),
    phone: Joi.string()
      .pattern(/^(\+?1-?)?(\(?\d{3}\)?)?(-|\s)?(\d{3})(-|\s)?(\d{4})$/)
      .required()
      .messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Please enter a valid phone number',
      }),
      gender: Joi.string().required().messages({
        'string.empty': 'Gender is required',
      })
  });

  return schema.validate(data, { abortEarly: false });
};

export default validateSignup;