import React from 'react'
import ProgressBar from './ProgressBar';
const RequestCard = ({request}) => {
   return (
      <div className="bg-white shadow-md rounded-lg p-4 m-4 w-80">
      <h2 className="text-xl font-semibold">{request.type}</h2>
      <p className="text-gray-600">Beneficiary: {request.beneficiary}</p>
      <p className="text-gray-600">Location: {request.location}</p>
      <ProgressBar quantity={request.quantity} total={request.total} />
      <button className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
         Donate Now
      </button>
    </div>
   );
}

export default RequestCard
