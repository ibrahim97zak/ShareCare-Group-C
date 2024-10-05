import React,{useState} from 'react'
import NavigationBar from '../components/NavigationBar'
import Banner from '../components/Banner'
import DonationsList from '../components/DonationsList';
import Footer from '../components/Footer';
import RequestsList from '../components/RequestsList';
import {userContext} from '../components/context/UserProvider';
const HomePage = () => {
  const { isLoggedIn } = userContext();
  const [userType, setUserType] = useState('b');
  console.log(isLoggedIn);
  return (
    <div>
      <Banner/>
      {userType === 'donor' ?(<RequestsList/>) : (<DonationsList/>)}
    </div>
  )
}

export default HomePage
