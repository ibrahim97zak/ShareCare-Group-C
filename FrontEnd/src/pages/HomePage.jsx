import Banner from "../components/Banner";
import DonationsList from "../components/DonationsList";
import RequestsList from "../components/RequestsList";
import { useUserContext } from "../context/UserProvider";

const HomePage = () => {
  const { isLoggedIn, user } = useUserContext();
  console.log(isLoggedIn);
  console.log(user);
  return (
    <div>
      <Banner />
      {isLoggedIn && (
        user.role === "Donor" ? (
          <RequestsList />
        ) : user.role === "Beneficiary" ? (
          <DonationsList />
        ) : null // Don't display anything for Admin
      )}
    </div>
  );
};

export default HomePage;
