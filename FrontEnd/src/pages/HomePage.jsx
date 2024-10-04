import React,{useState} from 'react'
import NavigationBar from '../components/NavigationBar'
import Banner from '../components/Banner'
import DonationsList from '../components/DonationsList';
import Footer from '../components/Footer';
import RequestsList from '../components/RequestsList';

const HomePage = () => {
  const [userType, setUserType] = useState('donor');
  return (
    <div>
      <Banner/>
      {userType === 'donor' ?(<RequestsList/>) : (<DonationsList/>)}
    </div>
  )
}

export default HomePage
