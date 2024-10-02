/* eslint-disable react/prop-types */

const NotificationsTab = ({ notifications }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <ul>
        {notifications.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-lg font-bold">{item.message}</h3>
            <p>Date: {item.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsTab;