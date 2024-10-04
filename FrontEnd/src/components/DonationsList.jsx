import React,{useState,useEffect} from 'react';
import DonationCard from './DonationCard';
import FilterBar from './FilterBar';
import DonationService from './DonationService';
import axios from 'axios';

const DonationsList = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [donations, setDonations] = useState([]);
   const filteredDonations = DonationService.filterService(donations,searchTerm);
   const displayedDonations = filteredDonations.length === 0 ? donations : filteredDonations;
   useEffect(()=>{
      async function fetchDonations() {
        try{ 
         axios.get('http://localhost:5000/api/donations') // Replace with your API URL
            .then(response => {
               setDonations(response.data); // Update state with fetched donations
             })
           .catch(error => console.log(error));
        }
        catch(error){
          console.log(error)
        }
        }
      fetchDonations();

    },[])
    console.log(donations);
  return (
   <div className="flex flex-col items-center justify-center p-20 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Donations List</h1>
      {donations.length > 0 ? (
        <>
        <FilterBar searchTerm={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        <div className="flex flex-wrap justify-center">
          {displayedDonations
           .filter((donation) => donation.status === 'available')
          .map(donation => (
          <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
        </>
        ):(
          <p>No donations found.</p>
        )}
 </div>
  )
}

export default DonationsList
