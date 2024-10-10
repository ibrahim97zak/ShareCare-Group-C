import React, { useState} from "react";
import Modal from 'react-modal';
import SweetAlertComponent from "./SweetAlertComponent ";
import axios from 'axios';

const DonationModal = ({ isOpen, onClose,donationType,remainingAmount,id,receivedQuantity,updateReceivedQuantity}) => {

  const donationAmounts = [10, 100, 200, 300, 500, 1000];
  const [selectedAmount, setSelectedAmount] = useState(null);
  if (!isOpen) return null;
  const handleSubmit = () => {
    if (!selectedAmount || Number(selectedAmount) <= 0) {
      SweetAlertComponent.error('Oops...', 'Please enter a valid amount!');
    }
    else if(selectedAmount > remainingAmount){
      SweetAlertComponent.error('Oops...', 'Donation exceeds the target.');
    }
    else{
      SweetAlertComponent.success('Thank you!', 'Your donation has been submitted successfully!')
      .then(() => {
        
        async function updateRequest() {
          try{ 
           axios.put(`http://localhost:5000/api/donations/request/${id}`,{newQuantity:selectedAmount+receivedQuantity}) // Replace with your API URL
              .then(response => {
                 console.log(response.data)
               })
             .catch(error => console.log(error));
          }
          catch(error){
            console.log(error)
          }
          }
        updateRequest();
        updateReceivedQuantity(selectedAmount);
        onClose(); });
    }
  };

  return (
   <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50 z-50"
    >
     
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">Enter your donation</h2>
        
        {/* Donation Amounts */}
     
          { donationType === 'money' ? (<div className="grid grid-cols-3 gap-4">
            {donationAmounts.map((amount, index) => (
            <button
              key={index}
              onClick={() => setSelectedAmount(amount)}
              className={`px-6 py-3 text-xl font-bold rounded-lg border ${
                selectedAmount === amount
                  ? "bg-black text-white"
                  : "bg-white text-black border-black"
              }`}
            >
              ${amount}
            </button>
            ))}</div>): (
            <div>
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="Enter the quantity"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
              />
            </div>
          )}
     

        <div className="mt-6 flex justify-center ">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-4"
          >
            Close
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Donate 
          </button>
        </div>
    </div>
    </Modal>
  );
};
export default DonationModal;