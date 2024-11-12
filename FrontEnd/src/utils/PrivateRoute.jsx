import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserProvider'; // Make sure to import your context

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useUserContext();  // Get the isLoggedIn state from context

  // If not logged in, redirect to the login page, otherwise render the element
  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default PrivateRoute;