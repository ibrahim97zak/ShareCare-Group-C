import{useState,useEffect} from 'react';
import RequestCard from './RequestCard';
import FilterBar from './FilterBar';
import DonationService from './DonationService';
import axios from 'axios';
export const ApiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
const RequestsList = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [requests,setRequests] = useState([]);
   const filteredRequests = DonationService.filterService(requests,searchTerm);
   const displayedRequests = filteredRequests.length === 0 ? requests : filteredRequests;
   useEffect(()=>{
    async function fetchRequests() {
      try{ 
        const response = await axios.get(`${ApiUrl}/api/donations/requests`,
          {
              withCredentials: true, // Include cookies in request
          }
        );

        //Update state with fetched donations

        setRequests(response.data);
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
          {displayedRequests
          .filter(request => 
             request.goal === false)
          .map(request => (
            <RequestCard key={request._id} request={request} />
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