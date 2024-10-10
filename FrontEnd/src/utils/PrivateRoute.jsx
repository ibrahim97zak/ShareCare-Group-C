/* eslint-disable react/prop-types */
// PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!Cookies.get('token'); // Check if token exists

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
