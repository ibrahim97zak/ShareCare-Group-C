// Layout.js
import { useLocation } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  const location = useLocation();

  // Paths where you don't want to show Navbar and Footer
  const noLayoutRoutes = ['/signUp', '/login', '/register'];

  // Check if the current path is in the noLayoutRoutes array
  const shouldHideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideLayout && <NavigationBar />}
      <main className="flex-grow">{children}</main>
      {!shouldHideLayout && <Footer />}
    </div>
  );
};
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;