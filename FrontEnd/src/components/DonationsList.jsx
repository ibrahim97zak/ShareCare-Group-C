import {useState,useEffect} from 'react';
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
          const response = await axios.get(`/api/donations/offers`,
            
            {
                withCredentials: true, // Include cookies in request
            });
          // Update state with fetched donations
          setDonations(response.data);

        }
        catch(error){
          console.log(error)
        }
        }
      fetchDonations();
    },[])
  return (
   <div className="flex flex-col items-center justify-center p-20 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Donations List</h1>
      {displayedDonations.length > 0 ? (
        <>
        <FilterBar searchTerm={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        <div className="flex flex-wrap justify-center">
          {displayedDonations
           .filter(donation => 
             donation.status === 'available' )
          .map(donation => (
          <DonationCard key={donation._id} donation={donation} />
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
