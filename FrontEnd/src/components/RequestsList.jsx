import React,{useState} from 'react';
import RequestCard from './RequestCard';
import { FaSearch } from 'react-icons/fa';

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

   const filteredRequests = requests.filter(
      (request) =>
         request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
         request.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
   const displayedRequests = filteredRequests.length === 0 ? requests : filteredRequests;

  return (
   <div className="flex flex-col items-center justify-center p-20 bg-gray-100">
   <h1 className="text-3xl font-semibold mb-6">Requests List</h1>
   <div className="relative w-80">
        {/* Search Icon */}
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Filter by Type or Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
     <div className="flex flex-wrap justify-center">
      {displayedRequests.map(request => (
        <RequestCard key={request.id} request={request} />
      ))}
   </div>
 </div>
  )
}

export default RequestsList
