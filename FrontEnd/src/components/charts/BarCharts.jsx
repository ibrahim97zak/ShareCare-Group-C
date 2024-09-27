import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarCharts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fake data
    const fakeUsers = [
      {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
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
        username: 'janedoe',
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
        username: 'bobsmith',
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

  const data = users.reduce((acc, user) => {
    user.donations.forEach((donation) => {
      const existingDonation = acc.find((item) => item.type === donation.type);
      if (existingDonation) {
        existingDonation.quantity += donation.quantity;
      } else {
        acc.push({
          type: donation.type,
          quantity: donation.quantity,
        });
      }
    });
    return acc;
  }, []);

  return (
    <div className="bar-chart-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <BarChart width={500} height={300} data={data}>
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