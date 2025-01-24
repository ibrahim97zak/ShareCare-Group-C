/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
export const ApiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
const UserPanelController = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try{ 
        const response = await axios.get(`${ApiUrl}/api/users/`);
        setUsers(response.data);
        setLoading(false);
      }
      catch(error){
        console.log(error)
      }
      }
      fetchUsers();
  }, []);

  const deleteUser = (userId) => {
    const token = localStorage.getItem('authToken');
    const res =  axios.delete(`${ApiUrl}/api/users/${userId}`,  {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    })
    .then((res)=>{
      alert("Successfully Deleted")
    })
    .catch(err => console.log(err))
  };
  return (
    <div className="user-panel-controller p-1">
      {/* Add overflow-x-auto for horizontal scrolling on smaller screens */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm text-left text-gray-500 rounded-lg shadow-md mb-4">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 rounded-lg shadow-md">
          <tr>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3 hidden md:table-cell">Username</th>
              <th scope="col" className="px-4 py-3 hidden sm:table-cell">Email</th>
              <th scope="col" className="px-4 py-3 hidden lg:table-cell">Location</th>
              <th scope="col" className="px-4 py-3 hidden lg:table-cell">User Type</th>
              <th scope="col" className="px-4 py-3 hidden xl:table-cell">Phone</th>
              <th scope="col" className="px-4 py-3 hidden xl:table-cell">Gender</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="bg-white border-b dark:bg-slate-100 dark:border-gray-700"
              >
                 <td className="px-4 py-4">{user.name}</td>
                <td className="px-4 py-4 hidden md:table-cell">{user.userName}</td>
                <td className="px-4 py-4 hidden sm:table-cell">{user.email}</td>
                <td className="px-4 py-4 hidden lg:table-cell">{user.location}</td>
                <td className="px-4 py-4 hidden lg:table-cell">{user.role}</td>
                <td className="px-4 py-4 hidden xl:table-cell">{user.phone}</td>
                <td className="px-4 py-4 hidden xl:table-cell">{user.gender}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    onClick={()=>deleteUser(user._id)}
                    className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${
                      user.role === "Admin"
                        ? "bg-gray-300 cursor-not-allowed hover:bg-gray-300"
                        : ""
                    }`}
                    disabled={user.role === "Admin"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      )}
    </div>
  );
};

export default UserPanelController;
