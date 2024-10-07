import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useUserContext } from "../../context/UserProvider";

const ActiveTab = () => {
  const [activeItems, setActiveItems] = useState([]);
  const { user} = useUserContext();
  console.log(activeItems)
  useEffect(()=>{
    async function fetchDonationsAdmin() {
      try{ 
        const response = await axios.get('http://localhost:5000/api/donations/');
        // Update state with fetched donations
        setActiveItems(response.data);
      }
      catch(error){
        console.log(error)
      }
      }
      async function fetchDonationsDonor() {
        try{ 
          const response = await axios.get(`http://localhost:5000/api/donations/${user._id}/offers`);
          setActiveItems(response.data.donationOffers);
        }
        catch(error){
          console.log(error)
        }
        }
        async function fetchRequestBeneficiary() {
          try{ 
            const response = await axios.get(`http://localhost:5000/api/donations/${user._id}/requests`);
            setActiveItems(response.data.donationRequests);
          }
          catch(error){
            console.log(error)
          }
          }
      if(user.role === 'Donor'){
        fetchDonationsDonor();
      }
      else if(user.role === 'Admin'){
        fetchDonationsAdmin();
      }
      else{
        fetchRequestBeneficiary();
      }
  },[])
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">
        Active {
        user.role === "Donor" 
        ? "Offers" 
        : user.role === "Beneficiary" 
          ? "Requests" 
          : "Offers and Requests"
        }
      </h2>
      <ul>
        {activeItems.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-lg font-bold">{item.donationType}</h3>
            <p>{item.description}</p>
            <p>Location: {item.location}</p>
            <p>Quantity: {item.quantity}</p>
            {item.receivedQuantity >= 0 && (
              <p>Received Quantity: {item.receivedQuantity}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveTab;