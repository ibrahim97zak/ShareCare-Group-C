import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import UserProvider from './context/UserProvider';
import PrivateRoute from './utils/PrivateRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const RegisterForm = lazy(() => import('./components/RegisterForm'));
const LoginForm = lazy(() => import('./components/LoginForm'));
const ProfileDetails = lazy(() => import('./components/ProfileDetails'));
const RequestDonationForm = lazy(() => import('./components/RequestDonationForm'));
const HomePage = lazy(() => import('./pages/HomePage'));

const routes = (
  <UserProvider>
    <Router>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/signUp" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />

            {/* Protected Routes */}
            <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
            <Route path="/ProfileDetails" element={<PrivateRoute element={<ProfileDetails />} />} />
            <Route path="/DonationForm" element={<PrivateRoute element={<RequestDonationForm />} />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  </UserProvider>
);

const App = () => {
  return <div>{routes}</div>;
};

export default App;
