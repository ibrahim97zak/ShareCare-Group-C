import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import Banner from "../components/Banner";
import DonationsList from "../components/DonationsList";
import Footer from "../components/Footer";
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
      user.role === "Donor" ? <RequestsList /> : <DonationsList />
    )}
    </div>
  );
};

export default HomePage;
