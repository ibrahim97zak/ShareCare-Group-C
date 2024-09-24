import React,{useState} from 'react';
import DonationCard from './DonationCard';
import { FaSearch } from 'react-icons/fa';

const donations = [
   { id: 1, type: 'Clothes', quantity: 20, location: 'New York',donor: 'John Doe' },
  { id: 2, type: 'Money', quantity: 15, location: 'Los Angeles',donor:'Jane Smith'},
  { id: 3, type: 'Food', quantity: 30, location: 'Chicago',donor:'Alice Johnson'},
];
const DonationsList = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const searchBarRef = useRef(null);
   const filteredDonations = donations.filter(
      (donation) =>
        donation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
   const displayedDonations = filteredDonations.length === 0 ? donations : filteredDonations;

  return (
   <div className="flex flex-col items-center justify-center p-20 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Donations List</h1>
      <div id="donation-search-bar" className="relative w-80" >
          {/* Search Icon */}
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      
          {/* Search Input */}
          <input
            type="text"
            ref={searchBarRef}
            placeholder="Filter by Type or Location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
      </div>
      <div className="flex flex-wrap justify-center">
        {displayedDonations.map(donation => (
        <DonationCard key={donation.id} donation={donation} />
        ))}
     </div>
 </div>
  )
}

export default DonationsList
