import React,{useState} from 'react';
import RequestCard from './RequestCard';
import FilterBar from './FilterBar';
import DonationService from './DonationService';

const RequestsList = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [requests,setRequests] = useState([]);
   const filteredRequests = DonationService.filterService(requests,searchTerm);
   const displayedRequests = filteredRequests.length === 0 ? requests : filteredRequests;
   useEffect(()=>{
    async function fetchRequests() {
      try{ 
       axios.get('http://localhost:5000/api/getReguests') // Replace with your API URL
          .then(response => {
             setRequests(response.data); // Update state with fetched donations
           })
         .catch(error => console.log(error));
      }
      catch(error){
        console.log(error)
      }
      }
    fetchRequests();

  },[])
  return (
   <div className="flex flex-col items-center justify-center p-20 bg-gray-100">
   <h1 className="text-3xl font-semibold mb-6">Requests List</h1>
   {requests.length > 0 ? (
        <>
      <FilterBar searchTerm={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        <div className="flex flex-wrap justify-center">
          {displayedRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
      </div>
      </>
        ):(
          <p>No Requests found.</p>
        )}
 </div>
  )
}

export default RequestsList
