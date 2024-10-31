import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const BarCharts = ({items,role}) => {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('All');

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

  return (
    <div className="bar-chart-container">
      {
      role === "Donor" ? ( <h3 className="text-lg font-bold">Offers Over Time</h3>):
      role === "Beneficiary" ?(<h3 className="text-lg font-bold">Requests Over Time</h3>):
      (<h3 className="text-lg font-bold">Donations Over Time</h3>)
      }
      {loading ? (
        <p>Loading...</p>
      ) : (
        <BarChart width={500} height={300} data={aggregatedData}>
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
