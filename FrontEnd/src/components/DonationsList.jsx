import React,{useState} from 'react';
import DonationCard from './DonationCard';
import FilterBar from './FilterBar';
import DonationService from './DonationService';

const donations = [
   { id: 1, type: 'Clothes', quantity: 20, location: 'New York',donor: 'John Doe' ,description: "This is a food donation including non-perishable items for families in need. The items include" },
  { id: 2, type: 'Money', quantity: 15, location: 'Los Angeles',donor:'Jane Smith',description: "This is a food donation including non-perishable items for families in need. The items include"},
  { id: 3, type: 'Food', quantity: 30, location: 'Chicago',donor:'Alice Johnson',description: "This is a food donation including non-perishable items for families in need. The items include"},
];
const DonationsList = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const filteredDonations = DonationService.filterService(donations,searchTerm);
   const displayedDonations = filteredDonations.length === 0 ? donations : filteredDonations;

  return (
   <div className="flex flex-col items-center justify-center p-20 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Donations List</h1>
      <FilterBar searchTerm={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      <div className="flex flex-wrap justify-center">
        {displayedDonations.map(donation => (
        <DonationCard key={donation.id} donation={donation} />
        ))}
     </div>
 </div>
  )
}

export default DonationsList
