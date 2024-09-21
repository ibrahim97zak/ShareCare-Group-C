import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "./input/InputField";
import PasswordInput from "./input/PasswordInput";
import validateLogin from "../utils/validateLogin"; // Import the Joi validation function

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();

    // Create an object with the form data
    const formData = { email, password };

    // Validate form data using the Joi validation function
    const { error } = validateLogin(formData);

    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });
      setValidationErrors(validationErrors);
      return;
    }

    // Clear validation errors if the form is valid
    setValidationErrors({});
    setError("");

    // Proceed with login logic (e.g., API call)
    console.log("Login successful", formData);
  };

  return (
    <>
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
            <br />
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {validationErrors.email && (
              <p className="text-red-600 text-xs pb-1">{validationErrors.email}</p>
            )}
            <br />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
