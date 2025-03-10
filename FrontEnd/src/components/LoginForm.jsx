/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./input/InputField";
import PasswordInput from "./input/PasswordInput";
import validateLogin from "../utils/validateLogin";
import axios from "axios";
import Cookies from "js-cookie";
import { useUserContext } from "../context/UserProvider";

const LoginForm = () => {
  const { setIsLoggedIn, setUser } = useUserContext();
  const navigate = useNavigate();
  const [userInputs, setUserInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({ email: "", password: "" });

  useEffect(() => {
    if (Object.keys(validationErrors).every((key) => validationErrors[key] === "")) {
      setError(null);
    }
  }, [validationErrors]);

  const handleValidation = (formData) => {
    const { error } = validateLogin(formData);
    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        if (!validationErrors[err.path[0]]) {
          validationErrors[err.path[0]] = [err.message];
        } else {
          validationErrors[err.path[0]].push(err.message);
        }
      });
      setValidationErrors(validationErrors);
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = { ...userInputs };

    if (!handleValidation(formData)) return;

    try {
      const response = await axios.post(`/api/auth/login`, formData, { withCredentials: true });

      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set("token", token, { expires: 1, secure: true, sameSite: "Lax" });
        
        // Set user without including the password
        const { password, ...userWithoutPassword } = response.data.user;
        await setUser(userWithoutPassword);

        if (response.data.user && response.data.user.role) {
          setIsLoggedIn(true);
          navigate("/");
        } else {
          setError("User role is undefined.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl text-center mb-7">Login in SAHEM</h4>
          <InputField
            type="email"
            placeholder="Email"
            value={userInputs.email}
            onChange={(e) => setUserInputs({ ...userInputs, email: e.target.value })}
          />
          {validationErrors.email && <p className="text-red-600 text-xs pb-1">{validationErrors.email}</p>}
          <PasswordInput
            value={userInputs.password}
            onChange={(e) => setUserInputs({ ...userInputs, password: e.target.value })}
          />
          {validationErrors.password && <p className="text-red-600 text-xs pb-1">{validationErrors.password}</p>}
          {error && <p className="text-red-600 text-xs pb-1">{error}</p>}
          <button type="submit" className="btn-primary">Login</button>
          <p className="text-sm text-center mt-4">
            Not registered yet? <Link to="/register" className="font-medium text-primary underline">Create an Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
