// utils/validationSchema.js
import Joi from 'joi';

const DonationFormValidator = Joi.object({
  donationCategory: Joi.string().required().valid(
    'clothes',
    'food',
    'money',
    'medicines',
    'books',
    'furniture'
  ),
  description: Joi.string().required().min(10).max(200),
  // quantity: Joi.number().required().integer().min(1),
  location: Joi.string().required(),
});

export default DonationFormValidator;