// RequestDonationForm.js
import { useState } from 'react';
import LocationSelect from './input/LocationSelect';
import InputField from './input/InputField';
import SelectDonationCategory from './input/SelectDonationCategory';
import DonationFormValidator from '../utils/DonationFormValidator';
import { useNavigate } from 'react-router-dom';

const RequestDonationForm = () => {
  const [userType, setUserType] = useState('beneficiary');
  const [donationCategory, setDonationCategory] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [goal, setGoal] = useState('');          // For "Request" type
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const { error } = DonationFormValidator.validate({
      donationCategory,
      description,
      location,
    });
    if (error) {
      setErrors(error.details.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {}));
    } else {
      // Handle form submission here
      console.log({
        donationCategory,
        description,
        location,
      });
    }
  };
  const handleClose = () => {
    navigate('/');
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4 mt-12">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-6 ">Donation Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <SelectDonationCategory
            value={donationCategory}
            onChange={(event) => setDonationCategory(event.target.value)}
          />
          {errors.donationCategory && (
            <p className="text-red-500 text-sm">{errors.donationCategory}</p>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="description"
            >
              Description:
            </label>
            <InputField
              type="textarea"
              placeholder="Enter description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          {userType === 'donor' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity">
                Quantity:
              </label>
              <InputField
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>
          )}
            {userType === 'beneficiary' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="goal">
                Goal Amount:
              </label>
              <InputField
                type="number"
                placeholder="Enter goal amount"
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
              />
              {errors.goal && (
                <p className="text-red-500 text-sm">{errors.goal}</p>
              )}
            </div>
          )}
          <LocationSelect value={location} onChange={(event) => setLocation(event.target.value)} />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 focus:ring-4 focus:ring-green-300 focus:outline-none transition duration-150"
            >
              Submit
            </button>

            <button
              type="button"
              className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none transition duration-150"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestDonationForm;