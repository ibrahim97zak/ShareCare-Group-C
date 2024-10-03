import React,{useState} from 'react';
import RequestCard from './RequestCard';
import FilterBar from './FilterBar';
import DonationService from './DonationService';

const requests = [
  { id: 1, type: 'Clothes', quantity: 50, total: 1000, location: 'New York', beneficiary: 'John Doe',goal:false,
     description: "This is a food donation including non-perishable items for families in need. The items include canned goods, pasta, rice, and more. Please reach out to coordinate delivery."
   },
  { id: 2, type: 'Food', quantity: 100, total: 300, location: 'Los Angeles', beneficiary: 'Jane Smith',goal:false,
      description:"This donation contains new and gently used clothing for adults and children, including jackets, shirts, and shoes."
   },
  { id: 3, type: 'Books', quantity: 30, total: 50, location: 'Chicago', beneficiary: 'Alice Johnson',goal:false,
      description:"This donation contains new and gently used clothing for adults and children, including jackets, shirts, and shoes."
  },
  { id: 4, type: 'Money', quantity: 20, total: 100, location: 'Houston', beneficiary: 'Bob Brown' ,goal:false,
    description: "This donation contains new and gently used clothing for adults and children, including jackets, shirts, and shoes."
  },
  { id: 5, type: 'Clothes', quantity: 70, total: 150, location: 'Miami', beneficiary: 'Emily White',goal:false,
      description:"This donation contains new and gently used clothing for adults and children, including jackets, shirts, and shoes."
  },
  { id: 6, type: 'Food', quantity: 200, total: 500, location: 'New York', beneficiary: 'Chris Green',goal:true,
      description:"This donation contains new and gently used clothing for adults and children, including jackets, shirts, and shoes."
   }
];
const RequestsList = () => {
   const [searchTerm, setSearchTerm] = useState('');
  //  const [requests,setRequests] = useState([]);
   const filteredRequests = DonationService.filterService(requests,searchTerm);
   const displayedRequests = filteredRequests.length === 0 ? requests : filteredRequests;

  return (
   <div className="flex flex-col items-center justify-center p-20 bg-gray-100">
   <h1 className="text-3xl font-semibold mb-6">Requests List</h1>
   <FilterBar searchTerm={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
     <div className="flex flex-wrap justify-center">
      {displayedRequests.map(request => (
        <RequestCard key={request.id} request={request} />
      ))}
   </div>
 </div>
  )
}

export default RequestsList
