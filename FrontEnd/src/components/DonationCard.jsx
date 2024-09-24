import React from 'react';

const DonationCard = ({ donation }) => {
   return (
      <div className="bg-white shadow-md rounded-lg p-4 m-4 w-80">
      <h2 className="text-xl font-semibold">{donation.type}</h2>
      <p className="text-gray-600">Donor: {donation.donor}</p>
      <p className="text-gray-600">Quantity: {donation.quantity}</p>
      <p className="text-gray-600">Location: {donation.location}</p>
      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
              Request
            </button>
    </div>
   );
 };
 
 export default DonationCard;