import { Link } from "react-router-dom";
import { useState } from "react";
import InputField from "./input/InputField";
import PasswordInput from "./input/PasswordInput";
import validateSignup from "../utils/validateSignup";
import logo from "../assets/images/SAHEM-logo.png";

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
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const locations = [
    "Jenin",
    "Nablus",
    "Tulkarem",
    "Tubas",
    "Qalqelia",
    "Jehrico",
    "Rammallah",
    "Jerusalem",
    "Hebron",
    "Bethlahim",
  ];

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
    <>
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
              <p className="text-red-600 text-xs pb-1">
                {validationErrors.name}
              </p>
            )}
            <InputField
              type="text"
              placeholder="Username"
              value={userInputs.username}
              onChange={(e) =>
                setUserInputs({ ...userInputs, username: e.target.value })
              }
            />
            {validationErrors.username && (
              <p className="text-red-600 text-xs pb-1">
                {validationErrors.username}
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
                  Male
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
                  Female
                </label>
              </div>
            </div>
            {validationErrors.gender && (
              <p className="text-red-600 text-xs pb-1">
                {validationErrors.gender}
              </p>
            )}

            <select
              value={userInputs.location}
              onChange={(e) =>
                setUserInputs({ ...userInputs, location: e.target.value })
              }
              className="w-full mb-3 p-2 pl-10 text-sm text-gray-700 bg-transparent border-[1.5px] rounded"
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {validationErrors.location && (
              <p className="text-red-600 text-xs pb-1">
                {validationErrors.location}
              </p>
            )}

            <select
              value={userInputs.userType}
              onChange={(e) =>
                setUserInputs({ ...userInputs, userType: e.target.value })
              }
              className="w-full mb-3 p-2 pl-10 text-sm text-gray-700 bg-transparent border-[1.5px] rounded"
            >
              <option value="">Select User Type</option>
              <option value="Donor">Donor</option>
              <option value="Beneficiary">Beneficiary</option>
            </select>
            {validationErrors.userType && (
              <p className="text-red-600 text-xs pb-1">
                {validationErrors.userType}
              </p>
            )}

            {error && <p className="text-red-600 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Create An Account
            </button>
            <p className="text-sm text-center mt-4">
              Are you already registered?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                SignIn
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
