import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "./input/InputField";
import PasswordInput from "./input/PasswordInput";
import validateLogin from "../utils/validateLogin";
import axios from "axios";

const LoginForm = () => {
  const [userInputs, setUserInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [resetError, setResetError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();

    const formData = { ...userInputs };

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

    // Login API call
    axios
      .post("/api/login", formData)
      .then((response) => {
        console.log("Login successful", response);
        // Redirect to dashboard or home page
      })
      .catch((error) => {
        console.error("Login failed", error);
        setError("Invalid email or password");
        setForgotPassword(true); // Show forgot password link on login error
      });
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    // TODO: Implement password reset API call
    // axios
    //   .post("/api/reset-password", { email: userInputs.email, newPassword: resetPassword.newPassword })
    //   .then((response) => {
    //     console.log("Password reset successful", response);
    //     setForgotPassword(false);
    //   })
    //   .catch((error) => {
    //     console.error("Password reset failed", error);
    //     setResetError("Failed to reset password");
    //   });
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
            {forgotPassword && (
              <p className="text-sm text-center mt-4">
                Forgot password?{" "}
                <a href="#" onClick={handleForgotPassword} className="font-medium text-primary underline">
                  Reset Password
                </a>
              </p>
            )}
          </form>
          {forgotPassword && (
            <form onSubmit={handleResetPassword}>
              <h4 className="text-2xl mb-7">Reset Password</h4>
              <br />
              <InputField
                type="password"
                placeholder="New Password"
                value={resetPassword.newPassword}
                onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
              />
              <br />
              <InputField
                type="password"
                placeholder="Confirm New Password"
                value={resetPassword.confirmPassword}
                onChange={(e) => setResetPassword({ ...resetPassword, confirmPassword: e.target.value })}
              />
              {resetError && <p className="text-red-600 text-xs pb-1">{resetError}</p>}
              <br />
              <button type="submit" className="btn-primary">
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginForm;