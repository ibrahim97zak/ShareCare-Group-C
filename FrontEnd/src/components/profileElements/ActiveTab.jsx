import React,{useState,useEffect} from 'react';
import axios from 'axios';

const ActiveTab = ({activeItems,user}) => {
  const [activeDonation, setActiveDonation] = useState(activeItems);
  useEffect(() => {
    setActiveDonation(activeItems);
  }, [activeItems]);
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/donations/${id}`);
      console.log(response.data)
      alert("successfully deleted")
      setActiveDonation(activeDonation.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
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
        {activeItems.map((item,index) => (
          <li
            key={index}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            {console.log("id",item._id)}
            <h3 className="text-lg font-bold">{item.donationType}</h3>
            <p>{item.description}</p>
            {user.role === "Admin" && (<p className="text-green-600 font-bold">{item.donationRole}</p>)}
            <p>Location: {item.location}</p>
            <p>Quantity: {item.quantity}</p>
            {item.receivedQuantity >= 0 && (
              <p>Received Quantity: {item.receivedQuantity}</p>
            )}
            <button
              className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
              onClick={() => handleDelete(item._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveTab;