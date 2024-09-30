// RequestDonationForm.js
import { useState } from 'react';
import LocationSelect from './input/LocationSelect';
import InputField from './input/InputField';
import SelectDonationCategory from './input/SelectDonationCategory';
import DonationFormValidator from '../utils/DonationFormValidator';

const RequestDonationForm = () => {
  const [donationType, setDonationType] = useState('');
  const [donationCategory, setDonationCategory] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});

  const donationTypes = [
    { value: 'request', label: 'Request' },
    { value: 'offer', label: 'Offer' },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    const { error } = DonationFormValidator.validate({
      donationType,
      donationCategory,
      description,
      quantity,
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
        donationType,
        donationCategory,
        description,
        quantity,
        location,
      });
    }
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="max-w-md w-full p-4 bg-white rounded shadow-md">
        <h2 className="text-3xl font-bold text-green-600">Donation Form</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="donationType"
            >
              Donation Type:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={donationType}
              onChange={(event) => setDonationType(event.target.value)}
            >
              <option value="">Select Donation Type</option>
              {donationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.donationType && (
              <p className="text-red-500 text-sm">{errors.donationType}</p>
            )}
          </div>
          <SelectDonationCategory
            value={donationCategory}
            onChange={(event) => setDonationCategory(event.target.value)}
          />
          {errors.donationCategory && (
            <p className="text-red-500 text-sm">{errors.donationCategory}</p>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
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
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="quantity"
            >
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
          <LocationSelect value={location} onChange={(event) => setLocation(event.target.value)} />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestDonationForm;