// RegisterForm.js
import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "./input/InputField";
import PasswordInput from "./input/PasswordInput";
import validateSignup from "../utils/validateSignup";
import logo from "../assets/images/SAHEM-logo.png";
import LocationSelect from "./input/LocationSelect";
import axios from "axios";

const RegisterForm = () => {
  const [userInputs, setUserInputs] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    role: "",
    phone: "", // Add phone number state
    gender: "", // Add gender state
  });
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    role: "",
    phone: "",
    gender: "",
  });

  const handleSignUp = async (e) => {
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

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      const data = response.data;
      console.log("Form submitted successfully", data);
      // You can also redirect the user to the login page or any other page
      window.location.href = "/login";
    } catch (error) {
      if (error.response) {
        console.error("Error submitting form:", error.response.data.message);
      } else {
        console.error("Error submitting form:", error.message);
      }
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSignUp}>
          <div className="flex items-center justify-center mb-1">
            <h4 className="text-2xl">Sign Up to</h4>
            <img
              src={logo}
              alt="SAHEM logo"
              className="w-20 h-20 object-contain ml-2"
            />
          </div>

          <InputField
            type="text"
            placeholder="Name"
            value={userInputs.name}
            onChange={(e) =>
              setUserInputs({ ...userInputs, name: e.target.value })
            }
          />
          {validationErrors.name && (
            <p className="text-red-600 text-xs pb-1">{validationErrors.name}</p>
          )}
          <InputField
            type="text"
            placeholder="Username"
            value={userInputs.userName}
            onChange={(e) =>
              setUserInputs({ ...userInputs, userName: e.target.value })
            }
          />
          {validationErrors.userName && (
            <p className="text-red-600 text-xs pb-1">
              {validationErrors.userName}
            </p>
          )}
          <InputField
            type="email"
            placeholder="Email"
            value={userInputs.email}
            onChange={(e) =>
              setUserInputs({ ...userInputs, email: e.target.value })
            }
          />
          {validationErrors.email && (
            <p className="text-red-600 text-xs pb-1">
              {validationErrors.email}
            </p>
          )}
          <InputField
            type="tel"
            placeholder="Phone Number"
            value={userInputs.phone}
            onChange={(e) =>
              setUserInputs({ ...userInputs, phone: e.target.value })
            }
          />
          {validationErrors.phone && (
            <p className="text-red-600 text-xs pb-1">
              {validationErrors.phone}
            </p>
          )}
          <PasswordInput
            value={userInputs.password}
            onChange={(e) =>
              setUserInputs({ ...userInputs, password: e.target.value })
            }
          />
          {validationErrors.password && (
            <p className="text-red-600 text-xs pb-1">
              {validationErrors.password}
            </p>
          )}
          <PasswordInput
            placeholder="Confirm Password"
            value={userInputs.confirmPassword}
            onChange={(e) =>
              setUserInputs({
                ...userInputs,
                confirmPassword: e.target.value,
              })
            }
          />
          {validationErrors.confirmPassword && (
            <p className="text-red-600 text-xs pb-1">
              {validationErrors.confirmPassword}
            </p>
          )}

          {/* Gender Selection */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender:
            </label>
            <div className="flex items-center space-x-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={userInputs.gender === "Male"}
                  onChange={(e) =>
                    setUserInputs({ ...userInputs, gender: e.target.value })
                  }
                />
                <span className="ml-2">Male</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={userInputs.gender === "Female"}
                  onChange={(e) =>
                    setUserInputs({ ...userInputs, gender: e.target.value })
                  }
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>
          {validationErrors.gender && (
            <p className="text-red-600 text-xs pb-1">
              {validationErrors.gender}
            </p>
          )}

          {/* Location Selection */}
          <LocationSelect
            value={userInputs.location}
            onChange={(e) =>
              setUserInputs({ ...userInputs, location: e.target.value })
            }
          />
          {validationErrors.location && (
            <p className="text-red-600 text-xs pb-1">
              {validationErrors.location}
            </p>
          )}

          {/* User Type Selection */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Type:
            </label>
            <div className="flex items-center space-x-4">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Donor"
                  checked={userInputs.role === "Donor"}
                  onChange={(e) =>
                    setUserInputs({ ...userInputs, role: e.target.value })
                  }
                />
                <span className="ml-2">Donor</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Beneficiary"
                  checked={userInputs.role === "Beneficiary"}
                  onChange={(e) =>
                    setUserInputs({ ...userInputs, role: e.target.value })
                  }
                />
                <span className="ml-2">Beneficiary</span>
              </label>
            </div>
          </div>
          {validationErrors.role && (
            <p className="text-red-600 text-xs pb-1">{validationErrors.role}</p>
          )}
          {error && <p className="text-red-600 text-xs pb-1">{error}</p>}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:text-green-700">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;