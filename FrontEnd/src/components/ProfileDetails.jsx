import { useState } from 'react';

const ProfileDetails = () => {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    accountType: "Donor",
    profilePicture: "https://via.placeholder.com/100",
  };

  // Mock data for active requests/donations
  const activeItems = [
    { id: 1, type: "Food", quantity: "10", status: "Active", for: "Donation" },
    { id: 2, type: "Clothes", quantity: "5", status: "Active", for: "Request" },
  ];

  // Mock notifications/messages
  const notifications = [
    { id: 1, message: "New request for donation", date: "2024-09-15" },
    { id: 2, message: "Your donation is completed", date: "2024-09-10" },
  ];

  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Profile Info Section */}
      <div className="flex items-center bg-white p-6 rounded-lg shadow-md mb-6">
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mr-4"
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-500">{user.accountType}</p>
        </div>
        <button className="ml-auto bg-green-500 text-white py-2 px-4 rounded">
          Edit Profile
        </button>
      </div>

      {/* Tabs for Active and History */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded ${activeTab === "active" ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Active {user.accountType === "Donor" ? "Donations" : "Requests"}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded ${activeTab === "history" ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 rounded ${activeTab === "notifications" ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Notifications
          </button>
        </div>

        {/* Active Section */}
        {activeTab === "active" && (
          <div>
            <h3 className="font-bold text-lg mb-4">
              Active {user.accountType === "Donor" ? "Donations" : "Requests"}
            </h3>
            <div className="grid gap-4">
              {activeItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                >
                  <div>
                    <p>{item.type}</p>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-gray-500">Status: {item.status}</p>
                  </div>
                  <button className="text-blue-500">Edit</button>
                  <button className="text-red-500">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        {activeTab === "history" && (
          <div>
            <h3 className="font-bold text-lg mb-4">History</h3>
            {/* Add completed donations/requests history here */}
            <p className="text-gray-500">No history available.</p>
          </div>
        )}

        {/* Notifications Section */}
        {activeTab === "notifications" && (
          <div>
            <h3 className="font-bold text-lg mb-4">Notifications</h3>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-gray-100 p-4 rounded-lg mb-2"
              >
                <p>{notification.message}</p>
                <p className="text-gray-500 text-sm">{notification.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
