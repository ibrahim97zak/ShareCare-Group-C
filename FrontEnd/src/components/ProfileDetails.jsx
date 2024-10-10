import { useState, useEffect } from "react";
import ProfileInfo from "../components/profileElements/ProfileInfo";
import ActiveTab from "../components/profileElements/ActiveTab";
import NotificationsTab from "../components/profileElements/NotificationsTab";
import ChartsTab from "./charts/ChartsTab";
import calculateChartData from "../utils/chartData";
import UserPanelController from "../components/profileElements/UserPanelController";
import { useUserContext } from "../context/UserProvider";
import axios from 'axios';

const ProfileDetails = () => {
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState("active");
  const [activeItems,setActiveItems] = useState([]);
  console.log(activeItems);

  const groupedItems = activeItems.reduce((acc, item) => {
    const { donationType, quantity } = item;

    if (acc[donationType]) {
      acc[donationType] += quantity;  // Add to existing quantity
    } else {
      acc[donationType] = quantity;   // Initialize the quantity
    }

    return acc;
  }, {});
  const deleteDonation = async (id) => {
    try {
      // Call the API to delete the item
      await axios.delete(`http://localhost:5000/api/donations/${id}`);

      // Update the state to remove the deleted item
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  useEffect(() => {
    console.log("activeTab:", activeTab);
  }, [activeTab]);
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
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-7">
      <ProfileInfo user={user} />
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded ${
              activeTab === "active" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Active {
            user.role === "Donor" 
           ? "Offers" 
           : user.role === "Beneficiary" 
             ? "Requests" 
             : "Offers & Requests"}
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 rounded ${
              activeTab === "notifications"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`px-4 py-2 rounded ${
              activeTab === "charts" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Charts
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded ${
              activeTab === "users" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Users
          </button>
        </div>

        {activeTab === "active" && (
          <ActiveTab user={user} activeItems={activeItems}  handleDelete={deleteDonation}/>
        )}
        {activeTab === "notifications" && (
          <NotificationsTab userId={user._id}/>
        )}
        {activeTab === "charts" && (
          <ChartsTab chartData={calculateChartData(groupedItems,user.role)} role={user.role} items={activeItems}/>
        )}
        {activeTab === "users" &&
          (user.role === "Admin" ? (
            <UserPanelController />
          ) : (
            <div>You do not have permission to access this page.</div>
          ))}
      </div>
    </div>
  );
};

export default ProfileDetails;
