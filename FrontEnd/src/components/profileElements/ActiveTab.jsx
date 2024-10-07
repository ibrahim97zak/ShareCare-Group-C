import React,{useState,useEffect} from 'react';
import axios from 'axios';

const ActiveTab = ({activeItems,user}) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">
        Active {
        user.role === "Donor" 
        ? "Offers" 
        : user.role === "Beneficiary" 
          ? "Requests" 
          : "Offers and Requests"
        }
      </h2>
      <ul>
        {activeItems.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-lg font-bold">{item.donationType}</h3>
            <p>{item.description}</p>
            <p>Location: {item.location}</p>
            <p>Quantity: {item.quantity}</p>
            {item.receivedQuantity >= 0 && (
              <p>Received Quantity: {item.receivedQuantity}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveTab;