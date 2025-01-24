import { useState, useEffect, lazy, Suspense } from "react";
import ProfileInfo from "../components/profileElements/ProfileInfo";
import calculateChartData from "../utils/chartData";
import { useUserContext } from "../context/UserProvider";
import axios from 'axios';
export const ApiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000";import LoadingSpinner from "./LoadingSpinner";

// Lazy load the tab components
const ActiveTab = lazy(() => import("../components/profileElements/ActiveTab"));
const NotificationsTab = lazy(() => import("../components/profileElements/NotificationsTab"));
const ChartsTab = lazy(() => import("./charts/ChartsTab"));
const UserPanelController = lazy(() => import("../components/profileElements/UserPanelController"));

const ProfileDetails = () => {
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState("active");
  const [activeItems, setActiveItems] = useState([]);

  const groupedItems = activeItems.reduce((acc, item) => {
    const { donationType, quantity } = item;
    acc[donationType] = acc[donationType] ? acc[donationType] + quantity : quantity;
    return acc;
  }, {});

  const deleteDonation = async (id) => {
    try {
      await axios.delete(`${ApiUrl}/api/donations/${id}`);
      setActiveItems(activeItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let response;
        if (user.role === 'Donor') {
          response = await axios.get(`${ApiUrl}/api/donations/${user._id}/offers`);
          setActiveItems(response.data.donationOffers);
        } else if (user.role === 'Admin') {
          response = await axios.get(`${ApiUrl}/api/donations/`);
          setActiveItems(response.data);
        } else {
          response = await axios.get(`${ApiUrl}/api/donations/${user._id}/requests`);
          setActiveItems(response.data.donationRequests);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-7">
      <ProfileInfo user={user} />
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <button onClick={() => setActiveTab("active")} className={`px-4 py-2 rounded ${activeTab === "active" ? "bg-green-500 text-white" : "bg-gray-200"}`}>Active {user.role === "Donor" ? "Offers" : user.role === "Beneficiary" ? "Requests" : "Offers & Requests"}</button>
          <button onClick={() => setActiveTab("notifications")} className={`px-4 py-2 rounded ${activeTab === "notifications" ? "bg-green-500 text-white" : "bg-gray-200"}`}>Notifications</button>
          <button onClick={() => setActiveTab("charts")} className={`px-4 py-2 rounded ${activeTab === "charts" ? "bg-green-500 text-white" : "bg-gray-200"}`}>Charts</button>
          <button onClick={() => setActiveTab("users")} className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-green-500 text-white" : "bg-gray-200"}`}>Users</button>
        </div>

        {/* Lazy load components for each tab */}
        <Suspense fallback={<LoadingSpinner/>}>
          {activeTab === "active" && <ActiveTab user={user} activeItems={activeItems} handleDelete={deleteDonation} />}
          {activeTab === "notifications" && <NotificationsTab userId={user._id} />}
          {activeTab === "charts" && <ChartsTab chartData={calculateChartData(groupedItems, user.role)} role={user.role} items={activeItems} />}
          {activeTab === "users" && (user.role === "Admin" ? <UserPanelController /> : <div>You do not have permission to access this page.</div>)}
        </Suspense>
      </div>
    </div>
  );
};

export default ProfileDetails;
