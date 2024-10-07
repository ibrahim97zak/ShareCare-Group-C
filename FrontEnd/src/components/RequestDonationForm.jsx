// RequestDonationForm.js
import { useState } from "react";
import LocationSelect from "./input/LocationSelect";
import InputField from "./input/InputField";
import SelectDonationCategory from "./input/SelectDonationCategory";
import DonationFormValidator from "../utils/DonationFormValidator";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserProvider.jsx";
import axios from "axios";
import Swal from 'sweetalert2';

const RequestDonationForm = () => {
  const { user } = useUserContext();
  const [donationCategory, setDonationCategory] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0); // Initialize quantity as a number
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  console.log(user._id);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error } = DonationFormValidator.validate({
      donationCategory,
      description,
      location,
      
    });
    if (error) {
      setErrors(
        error.details.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {})
      );
      return;
    }

    // Add validation for quantity here
    if (isNaN(quantity) || quantity <= 0) {
      setErrors({ quantity: "Please enter a valid quantity" });
      return;
    }

    const formData = {
      userId: user._id, // Assuming the beneficiary ID is available
      donationType: donationCategory,
      location,
      description
    };

    if (user.role === "Beneficiary") {
      formData.quantity = quantity;
    } else {
      formData.quantity = quantity;
    }

    console.log(formData);
    // Make API call to create donation here
    const endpoint = `http://localhost:5000/api/donations/${user.role === "Beneficiary" ? "request" : "offer"}`;

  try {
    const response = await axios.post(endpoint, formData);
    console.log(response.data);
    // Handle success response
    Swal.fire({
      icon: 'success',
      title: 'Donation Form Submitted Successfully!',
      text: 'Your donation form has been submitted successfully.',
    });
  } catch (error) {
    console.error(error);
    // Handle error response
    Swal.fire({
      icon: 'error',
      title: 'Error Submitting Donation Form',
      text: 'An error occurred while submitting your donation form.',
    });
  }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4 mt-12">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-6 ">
          Donation Form
        </h2>
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
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="quantity"
            >
              {user.role === "Beneficiary" ? "Goal Amount" : "Quantity"}
            </label>
            <InputField
              type="number"
              placeholder={user.role === "Beneficiary" ? "Enter goal amount" : "Enter quantity"}
              value={quantity}
              onChange={(event) => setQuantity(parseInt(event.target.value, 10))}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity}</p>
            )}
          </div>
          <LocationSelect
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-5"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestDonationForm;