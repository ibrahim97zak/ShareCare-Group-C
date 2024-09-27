import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarCharts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All'); // State to track the selected data type

  // Simulate the logged-in user (this can come from your auth state)
  const currentUser = {
    id: 1,
    name: 'Admin User',
    userType: 'Admin', // Change this to test with 'User' or other roles
  };

  useEffect(() => {
    // Fake data
    const fakeUsers = [
      {
        id: 1,
        name: 'John Doe',
        userName: 'johndoe',
        email: 'johndoe@example.com',
        location: 'New York',
        userType: 'Admin',
        phone: '123-456-7890',
        gender: 'Male',
        donations: [
          { type: 'Cash', quantity: 100 },
          { type: 'Food', quantity: 50 },
          { type: 'Clothing', quantity: 20 },
        ],
      },
      {
        id: 2,
        name: 'Jane Doe',
        userName: 'janedoe',
        email: 'janedoe@example.com',
        location: 'Los Angeles',
        userType: 'User',
        phone: '987-654-3210',
        gender: 'Female',
        donations: [
          { type: 'Cash', quantity: 200 },
          { type: 'Food', quantity: 30 },
          { type: 'Toys', quantity: 10 },
        ],
      },
      {
        id: 3,
        name: 'Bob Smith',
        userName: 'bobsmith',
        email: 'bobsmith@example.com',
        location: 'Chicago',
        userType: 'Moderator',
        phone: '555-123-4567',
        gender: 'Male',
        donations: [
          { type: 'Cash', quantity: 150 },
          { type: 'Food', quantity: 40 },
          { type: 'Clothing', quantity: 30 },
        ],
      },
    ];

    setUsers(fakeUsers);
    setLoading(false);
  }, []);

  // Filter data based on the selected type and user type
  const filteredData = users.reduce((acc, user) => {
    // Check if the current user is admin or the same as the logged-in user
    if (currentUser.userType === 'Admin' || currentUser.id === user.id) {
      user.donations.forEach((donation) => {
        if (selectedType === 'All' || donation.type === selectedType) {
          const existingDonation = acc.find((item) => item.type === donation.type);
          if (existingDonation) {
            existingDonation.quantity += donation.quantity;
          } else {
            acc.push({
              type: donation.type,
              quantity: donation.quantity,
            });
          }
        }
      });
    }
    return acc;
  }, []);

  return (
    <div className="bar-chart-container">
      <h3 className="text-lg font-bold">Select Data to Display</h3>

      {/* Dropdown for selecting donation type */}
      <select
        className="mb-4 p-2 border border-gray-300 rounded"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Cash">Cash</option>
        <option value="Food">Food</option>
        <option value="Clothing">Clothing</option>
        <option value="Toys">Toys</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <BarChart width={500} height={300} data={filteredData}>
          <XAxis dataKey="type" />
          <YAxis />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" />
        </BarChart>
      )}
    </div>
  );
};

export default BarCharts;
