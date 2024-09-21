import { Link } from "react-router-dom";
import { useState } from "react";
import InputField from "./input/InputField";
import PasswordInput from "./input/PasswordInput";
import validateSignup from "../utils/validateSignup";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // To handle field-specific errors

  const handleSignUp = (e) => {
    e.preventDefault();

    // Create an object with the form data
    const formData = {
      username,
      name,
      email,
      password,
      confirmPassword,
    };

    // Use the validateSignup function to validate form data
    const { error } = validateSignup(formData);

    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });
      setValidationErrors(validationErrors); // Set specific field errors
      return;
    }

    // Clear errors if validation passes
    setValidationErrors({});
    setError(null);

    // Proceed with your sign-up logic, such as making an API request
    console.log("Form submitted successfully", formData);
  };

  return (
    <>
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Sign Up</h4>
            <InputField
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {validationErrors.username && (
              <p className="text-red-600 text-xs pb-1">
                {validationErrors.username}
              </p>
            )}
            <InputField
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {validationErrors.name && (
              <p className="text-red-600 text-xs pb-1">
                {validationErrors.name}
              </p>
            )}
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {validationErrors.email && (
              <p className="text-red-600 text-xs pb-1">
                {validationErrors.email}
              </p>
            )}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {validationErrors.password && (
              <p className="text-red-600 text-xs pb-1">
                {validationErrors.password}
              </p>
            )}
            <PasswordInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-600 text-xs pb-1">
                {validationErrors.confirmPassword}
              </p>
            )}
            <br />

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
