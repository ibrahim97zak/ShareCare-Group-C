import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import DonationModal from './DonationModal';

const RequestCard = ({ request }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receivedQuantity, setReceivedQuantity] = useState(request.receivedQuantity);
  const [quantity, setQuantity] = useState(request.quantity);

  useEffect(() => {
    setReceivedQuantity(request.receivedQuantity);
    setQuantity(request.quantity);
  }, [request]);

  const remainingAmount = quantity - receivedQuantity;

  const handleDonateClick = () => {
    setIsModalOpen(true);
  
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const updateReceivedQuantity = (newQuantity) => {
    setReceivedQuantity(prevQuantity => prevQuantity + newQuantity);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-4 w-80">
      <h2 className="text-xl font-semibold">{request.donationType}</h2>
      {request.description && (
        <p>
          {isExpanded ? request.description : `${request.description.slice(0, 100)}...`}
          <span
            className="text-green-600 cursor-pointer"
            onClick={toggleDescription}
          >
            {isExpanded ? " Read Less" : " Read More"}
          </span>
        </p>
      )}
      <p className="text-gray-600 ">
        <span className="font-bold">Beneficiary: </span> {request.beneficiary?.name || 'Unknown'}
      </p>
      <p className="text-gray-600"> <span className="font-bold">Location: </span> {request.location}</p>
      <ProgressBar quantity={receivedQuantity} total={quantity} />
      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        onClick={handleDonateClick}
      >
        Donate Now
      </button>
      <DonationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        donationType={request.donationType}
        remainingAmount={remainingAmount}
        id={request._id}
        receivedQuantity={request.receivedQuantity}
        updateReceivedQuantity={updateReceivedQuantity}
      />
    </div>
  );
};

export default RequestCard;