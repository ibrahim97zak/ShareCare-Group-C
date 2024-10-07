import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const BarCharts = ({items}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    // Example data from the user
    const donationRequests = [
      {
        beneficiary: "66ff1843c7ee8c185f07fbd5",
        createdAt: "2024-10-07T15:57:49.885Z",
        donationRole: "Request",
        donationType: "food",
        quantity: 10,
      },
      {
        beneficiary: "66ff1843c7ee8c185f07fbd5",
        createdAt: "2024-10-07T14:57:32.583Z",
        donationRole: "Request",
        donationType: "food",
        quantity: 10,
      },
      {
        beneficiary: "66ff1843c7ee8c185f07fbd5",
        createdAt: "2024-10-07T14:32:20.080Z",
        description: "Canned food",
        donationRole: "Request",
        donationType: "clothes",
        quantity: 5,
      },
      {
        beneficiary: "66ff1843c7ee8c185f07fbd5",
        createdAt: "2024-10-06T14:32:20.080Z",
        description: "Canned food",
        donationRole: "Request",
        donationType: "food",
        quantity: 15,
      }
    ];

    setRequests(donationRequests);
    setLoading(false);
  }, []);

  // Function to aggregate donations by date
  const aggregateDonationsByDate = (items) => {
    return items.reduce((acc, item) => {
      // Format date to YYYY-MM-DD
      const date = new Date(item.createdAt).toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
      const { quantity } = item;

      // Check if the date is already in the accumulated data
      const existingEntry = acc.find(item => item.date === date);
      if (existingEntry) {
        existingEntry.quantity += quantity; // If the date exists, sum the quantities
      } else {
        acc.push({ date, quantity }); // If the date doesn't exist, add a new entry
      }

      return acc;
    }, []);
  };

  const aggregatedData = aggregateDonationsByDate(items);

  // Filter data based on selected type (currently this doesn't affect the aggregation, you can expand it later if needed)
  const filteredData = selectedType === 'All' ? aggregatedData : aggregatedData.filter(item => item.type === selectedType);

  return (
    <div className="bar-chart-container">
      <h3 className="text-lg font-bold">Requests Over Time</h3>

      <select
        className="mb-4 p-2 border border-gray-300 rounded"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="All">All</option>
        {/* You can add other donation types if you want the dropdown */}
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <BarChart width={500} height={300} data={filteredData}>
          <XAxis dataKey="date" />
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
