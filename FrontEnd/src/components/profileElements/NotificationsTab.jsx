import {useState, useEffect} from 'react'; 
import axios from "axios";

const NotificationsTab = ({userId}) => {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    async function fetchNotification() {
      try{ 
        const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
        console.log(response.data)
        setNotifications(response.data);
      }
      catch(error){
        console.log(error)
      }
      }
      fetchNotification();
  }, []);
    return (
   
      <div>
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <ul>
        {notifications.map((item) => {
          // Format the date to a more readable format
          const readableDate = new Date(item.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });

          return (
            <li key={item._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <p className="text-green-600">{readableDate}</p>
              <h3 className="text-lg font-bold">{item.content}</h3>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NotificationsTab;