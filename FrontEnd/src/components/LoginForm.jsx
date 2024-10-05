/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "./input/InputField";
import PasswordInput from "./input/PasswordInput";
import validateLogin from "../utils/validateLogin";
import axios from "axios";
import { userContext } from "./context/UserProvider";

const LoginForm = () => {
  const { setIsLoggedIn } = userContext();
  const [userInputs, setUserInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const handleLogin = async (e) => {
    e.preventDefault();
  
    const formData = { ...userInputs };
  
    // Validate form inputs
    const { error } = validateLogin(formData);
  
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
      // Send a POST request to the login API
      const response = await axios.post("http://localhost:5000/api/auth/login", formData, {
        withCredentials: true, // This allows cookies to be set if your API is configured to use them
        credentials: 'include' // Add this line
      });
      console.log(response);
      // Handle successful login
      if (response.status === 200) {
        // Assuming the response contains a token
        // // Option 1: Store the token in localStorage
        localStorage.setItem("authToken", response.data.token);
        setIsLoggedIn(true);
      //  console.log(response);
        // Optionally redirect to another page
        window.location.href = "/";
      }
    } catch (err) {
      // Handle error (e.g., invalid credentials)
      setError("Invalid email or password. Please try again.");
    }
  };
  


  return (
    <>
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>

            <h4 className="text-2xl text-center mb-7">Login</h4>
            <br />
            <InputField
              type="email"
              placeholder="Email"
              value={userInputs.email}
              onChange={(e) => setUserInputs({ ...userInputs, email: e.target.value })}
            />
            {validationErrors.email && (
              <p className="text-red-600 text-xs pb-1">{validationErrors.email}</p>
            )}
            <br />
            <PasswordInput
              value={userInputs.password}
              onChange={(e) => setUserInputs({ ...userInputs, password: e.target.value })}
            />
            {validationErrors.password && (
              <p className="text-red-600 text-xs pb-1">{validationErrors.password}</p>
            )}
            <br />
            {error && <p className="text-red-600 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;