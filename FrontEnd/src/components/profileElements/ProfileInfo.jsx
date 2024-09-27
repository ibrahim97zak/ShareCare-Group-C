/* eslint-disable react/prop-types */

const ProfileInfo = ({ user }) => {
  return (
    <div className="flex flex-wrap items-center bg-white p-6 rounded-lg shadow-md mb-6">
      <img
        src={user.profilePicture}
        alt="Profile"
        className="w-24 h-24 rounded-full mr-4 md:w-20 md:h-20 sm:w-16 sm:h-16"
      />
      <div className="flex-1">
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500">{user.accountType}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;