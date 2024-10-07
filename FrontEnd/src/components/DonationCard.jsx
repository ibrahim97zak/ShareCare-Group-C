import {useState} from 'react';
import ProfileModal from './ProfileModal';
import SweetAlertComponent from "./SweetAlertComponent ";

const DonationCard = ({ donation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleDonorClick = () => {
    setIsModalOpen(true);
  };
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
   return (
      <div className="bg-white shadow-md rounded-lg p-4 m-4 w-80">
      <h2 className="text-xl font-semibold">{donation.donationType}</h2>
      {donation.description && (
      <p>
        {isExpanded 
          ? donation.description 
          : `${donation.description.slice(0, 100)}...`}
        <span
          className="text-green-600 cursor-pointer"
          onClick={toggleDescription}
        >
          {isExpanded ? " Read Less" : " Read More"}
        </span>
      </p>
      )}
      <button className="text-gray-600" onClick={handleDonorClick} > <span className="font-bold">Donor: </span> {donation.donor?.name || 'Unknown'}</button>
      <p className="text-gray-600"> <span className="font-bold">Quantity: </span> {donation.quantity}</p>
      <p className="text-gray-600"> <span className="font-bold">Location: </span> {donation.location}</p>
      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        onClick={() => 
          SweetAlertComponent.success('Your request has been sent to the donor.')
        }>
         Request
      </button>
      <ProfileModal isOpen={isModalOpen} onClose={closeModal} donor={donation.donor}/>
    </div>
   );
 };
 
 export default DonationCard;