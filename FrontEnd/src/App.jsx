import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ProfileDetails from './components/ProfileDetails';
import RequestDonationForm from './components/RequestDonationForm';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import UserProvider from './context/UserProvider';
import PrivateRoute from './utils/PrivateRoute';

const routes = (
  <UserProvider>
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/signUp" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
          <Route path="/ProfileDetails" element={<PrivateRoute element={<ProfileDetails />} />} />
          <Route path="/DonationForm" element={<PrivateRoute element={<RequestDonationForm />} />} />
        </Routes>
      </Layout>
    </Router>
  </UserProvider>
);

const App = () => {
  return <div>{routes}</div>;
};

export default App;
