import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ProfileDetails from "./components/ProfileDetails";
import RequestDonationForm from "./components/RequestDonationForm";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import UserProvider from "./context/UserProvider";

const routes = (
  <UserProvider>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signUp" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/ProfileDetails" element={<ProfileDetails />} />
          <Route path="/DonationForm" element={<RequestDonationForm />} />
        </Routes>
      </Layout>
    </Router>
  </UserProvider>
);
const App = () => {
  return <div>{routes}</div>;
};

export default App;
