/* eslint-disable react/prop-types */
// UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Assuming you're using the js-cookie library
import axios from 'axios'; // Import Axios

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user data
  const userId = Cookies.get('id'); // Retrieve user ID from cookies
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/users/${userId}`)
      .then(response => {
        setUser(response.data); // Set the user data in state
        console.log('User  data:', response.data); // Log the fetched data to check
      })
        .catch(error => console.error("Error fetching user data:", error)); // Error handling for fetch
    }
  }, [userId]);
  console.log(userId)
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
