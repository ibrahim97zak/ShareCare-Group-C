import { useState, useEffect } from "react";
import ProfileInfo from "../components/profileElements/ProfileInfo";
import ActiveTab from "../components/profileElements/ActiveTab";
import HistoryTab from "../components/profileElements/HistoryTab";
import NotificationsTab from "../components/profileElements/NotificationsTab";
import ChartsTab from "./charts/ChartsTab";
import calculateChartData from "../utils/chartData";
import UserPanelController from "../components/profileElements/UserPanelController";
import { useUserContext } from "../context/UserProvider";

const ProfileDetails = () => {
  const { user } = useUserContext();
  console.log(user.name);

  const activeItems = [
    { id: 1, type: "Food", quantity: "10", status: "Active", for: "Donation" },
    {
      id: 2,
      type: "Clothes",
      quantity: "5",
      status: "Active",
      for: "Donation",
    },
    { id: 3, type: "Books", quantity: "8", status: "Active", for: "Donation" },
  ];

  const notifications = [
    { id: 1, message: "New request for donation", date: "2024-09-15" },
    { id: 2, message: "Your donation is completed", date: "2024-09-10" },
  ];

  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    console.log("activeTab:", activeTab);
  }, [activeTab]);
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ProfileInfo user={user} />
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded ${
              activeTab === "active" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Active {user.role === "Donor" ? "Requests" : "Donations"}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded ${
              activeTab === "history"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            History
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
          <ActiveTab activeItems={activeItems} user={user} />
        )}
        {activeTab === "history" && <HistoryTab activeItems={activeItems} />}
        {activeTab === "notifications" && (
          <NotificationsTab notifications={notifications} />
        )}
        {activeTab === "charts" && (
          <ChartsTab chartData={calculateChartData(activeItems)} />
        )}
        {activeTab === "users" &&
          (user.role === "admin" ? (
            <UserPanelController />
          ) : (
            <div>You do not have permission to access this page.</div>
          ))}
      </div>
    </div>
  );
};

export default ProfileDetails;
