/* eslint-disable react/prop-types */

const ActiveTab = ({ activeItems, user }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">
        Active {user.userType === "Donor" ? "Donations" : "Requests"}
      </h2>
      <ul>
        {activeItems.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-lg font-bold">{item.type}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Status: {item.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveTab;