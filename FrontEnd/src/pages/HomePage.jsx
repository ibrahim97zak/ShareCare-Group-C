import React,{useState} from 'react'
import NavigationBar from '../components/NavigationBar'
import Banner from '../components/Banner'
import DonationsList from '../components/DonationsList';
import Footer from '../components/Footer';
import RequestsList from '../components/RequestsList';

const HomePage = () => {
  const [userType, setUserType] = useState('beneficiary');
  return (
    <div>
      <NavigationBar/>
      <Banner/>
      {userType === 'donor' ?(<DonationsList/>) : (<RequestsList/>)}
      <Footer/>
    </div>
  )
}

export default HomePage
