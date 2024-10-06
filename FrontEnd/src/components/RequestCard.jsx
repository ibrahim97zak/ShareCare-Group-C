import React,{useState} from 'react'
import ProgressBar from './ProgressBar';
import DonationModal from './DonationModal';

const RequestCard = ({request}) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const remainingAmount = request.total - request.quantity;
   const handleDonateClick = () => {
     setIsModalOpen(true);
   };
 
   const closeModal = () => {
     setIsModalOpen(false);
   };
   const toggleDescription = () => {
      setIsExpanded(!isExpanded);
    };
    if(!request.goal){
     return (
      <div className="bg-white shadow-md rounded-lg p-4 m-4 w-80">
      <h2 className="text-xl font-semibold">{request.type}</h2>
      <p>
       
        {isExpanded ? request.description : `${request.description.slice(0, 100)}...`}
        <span
          className="text-green-600 cursor-pointer"
          onClick={toggleDescription}
        >
          {isExpanded ? " Read Less" : " Read More"}
        </span>
      </p>
      <p className="text-gray-600 ">
         <span className="font-bold">Beneficiary: </span>{request.beneficiary}</p>
      <p className="text-gray-600"> <span className="font-bold">Location: </span> {request.location}</p>
      <ProgressBar quantity={request.quantity} total={request.total} />
      <button 
        className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        onClick={handleDonateClick}
        >
         Donate Now
      </button>
      <DonationModal isOpen={isModalOpen} onClose={closeModal} donationType={request.type} remainingAmount={remainingAmount}/>
    </div>
   );}
}

export default RequestCard
