// RegisterForm.js
import { useState } from 'react';
import { Link } from "react-router-dom";
import InputField from "./input/InputField";
import PasswordInput from "./input/PasswordInput";
import validateSignup from "../utils/validateSignup";
import logo from "../assets/images/SAHEM-logo.png";
import LocationSelect from './input/LocationSelect';

const RegisterForm = () => {
  const [userInputs, setUserInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    userType: "",
    phone: "", // Add phone number state
    gender: "", // Add gender state
  });
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});


  const handleSignUp = (e) => {
    e.preventDefault();

    const formData = { ...userInputs };

    const { error } = validateSignup(formData);

    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });
      setValidationErrors(validationErrors);
      return;
    }

    setValidationErrors({});
    setError(null);

    console.log("Form submitted successfully", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-center items-center mb-4">
        <h4 className="text-2xl font-semibold text-gray-700">Sign Up to</h4>
        <img src={logo} alt="SAHEM logo" className="w-16 h-16 object-contain ml-2" />
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Name Input */}
        <InputField
          type="text"
          placeholder="Name"
          value={userInputs.name}
          onChange={(e) => setUserInputs({ ...userInputs, name: e.target.value })}
        />
        {validationErrors.name && (
          <p className="text-red-600 text-xs">{validationErrors.name}</p>
        )}

        {/* Username Input */}
        <InputField
          type="text"
          placeholder="Username"
          value={userInputs.username}
          onChange={(e) => setUserInputs({ ...userInputs, username: e.target.value })}
        />
        {validationErrors.username && (
          <p className="text-red-600 text-xs">{validationErrors.username}</p>
        )}

        {/* Email Input */}
        <InputField
          type="email"
          placeholder="Email"
          value={userInputs.email}
          onChange={(e) => setUserInputs({ ...userInputs, email: e.target.value })}
        />
        {validationErrors.email && (
          <p className="text-red-600 text-xs">{validationErrors.email}</p>
        )}

        {/* Phone Number Input */}
        <InputField
          type="tel"
          placeholder="Phone Number"
          value={userInputs.phone}
          onChange={(e) => setUserInputs({ ...userInputs, phone: e.target.value })}
        />
        {validationErrors.phone && (
          <p className="text-red-600 text-xs">{validationErrors.phone}</p>
        )}

        {/* Password Input */}
        <PasswordInput
          value={userInputs.password}
          onChange={(e) => setUserInputs({ ...userInputs, password: e.target.value })}
        />
        {validationErrors.password && (
          <p className="text-red-600 text-xs">{validationErrors.password}</p>
        )}

        {/* Confirm Password Input */}
        <PasswordInput
          placeholder="Confirm Password"
          value={userInputs.confirmPassword}
          onChange={(e) => setUserInputs({ ...userInputs, confirmPassword: e.target.value })}
        />
        {validationErrors.confirmPassword && (
          <p className="text-red-600 text-xs">{validationErrors.confirmPassword}</p>
        )}

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={userInputs.gender === 'Male'}
                onChange={(e) => setUserInputs({ ...userInputs, gender: e.target.value })}
                className="form-radio text-green-500"
              />
              <span className="ml-2 text-gray-600">Male</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={userInputs.gender === 'Female'}
                onChange={(e) => setUserInputs({ ...userInputs, gender: e.target.value })}
                className="form-radio text-green-500"
              />
              <span className="ml-2 text-gray-600">Female</span>
            </label>
          </div>
          {validationErrors.gender && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.gender}</p>
          )}
        </div>

        {/* Location Selection */}
        <LocationSelect
          value={userInputs.location}
          onChange={(e) => setUserInputs({ ...userInputs, location: e.target.value })}
        />
        {validationErrors.location && (
          <p className="text-red-600 text-xs mt-1">{validationErrors.location}</p>
        )}

        {/* User Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="Donor"
                checked={userInputs.userType === 'Donor'}
                onChange={(e) => setUserInputs({ ...userInputs, userType: e.target.value })}
                className="form-radio text-green-500"
              />
              <span className="ml-2 text-gray-600">Donor</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="Beneficiary"
                checked={userInputs.userType === 'Beneficiary'}
                onChange={(e) => setUserInputs({ ...userInputs, userType: e.target.value })}
                className="form-radio text-green-500"
              />
              <span className="ml-2 text-gray-600">Beneficiary</span>
            </label>
          </div>
          {validationErrors.userType && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.userType}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Sign Up
        </button>
      </form>

      {/* Redirect to Login */}
      <p className="text-center text-sm mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-green-500 hover:text-green-700">
          Log In
        </Link>
      </p>
    </div>
  </div>
);
};

export default RegisterForm;