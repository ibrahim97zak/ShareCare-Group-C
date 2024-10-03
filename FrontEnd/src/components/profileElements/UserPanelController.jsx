import { useState, useEffect } from "react";

const UserPanelController = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fake data
    const fakeUsers = [
      {
        id: 1,
        name: "John Doe",
        username: "johndoe",
        email: "johndoe@example.com",
        location: "New York",
        userType: "Admin",
        phone: "123-456-7890",
        gender: "Male",
      },
      {
        id: 2,
        name: "Jane Doe",
        username: "janedoe",
        email: "janedoe@example.com",
        location: "Los Angeles",
        userType: "User",
        phone: "987-654-3210",
        gender: "Female",
      },
      {
        id: 3,
        name: "Bob Smith",
        username: "bobsmith",
        email: "bobsmith@example.com",
        location: "Chicago",
        userType: "Moderator",
        phone: "555-123-4567",
        gender: "Male",
      },
    ];

    setUsers(fakeUsers);
    setLoading(false);
  }, []);

  const deleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };
  const deleteUserCallback = (userId) => {
    deleteUser(userId);
  };

  return (
    <div className="user-panel-controller p-1">
      {/* Add overflow-x-auto for horizontal scrolling on smaller screens */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm text-left text-gray-500 rounded-lg shadow-md mb-4">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 rounded-lg shadow-md">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">
                Username
              </th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                Email
              </th>
              <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                Location
              </th>
              <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                User Type
              </th>
              <th scope="col" className="px-6 py-3 hidden xl:table-cell">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 hidden xl:table-cell">
                Gender
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="bg-white border-b dark:bg-slate-100 dark:border-gray-700"
              >
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4 hidden md:table-cell">{user.username}</td>
                <td className="px-6 py-4 hidden sm:table-cell">{user.email}</td>
                <td className="px-6 py-4 hidden lg:table-cell">{user.location}</td>
                <td className="px-6 py-4 hidden lg:table-cell">{user.userType}</td>
                <td className="px-6 py-4 hidden xl:table-cell">{user.phone}</td>
                <td className="px-6 py-4 hidden xl:table-cell">{user.gender}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={deleteUserCallback.bind(null, user.id)}
                    className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${
                      user.userType === "Admin"
                        ? "bg-gray-300 cursor-not-allowed hover:bg-gray-300"
                        : ""
                    }`}
                    disabled={user.userType === "Admin"}
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
