import React,{ useState }  from 'react'
import logo from '../assets/logo.png'
import { FaSearch } from 'react-icons/fa'; 


const NavigationBar = ({userType}) => {
   // Simulating user login state
   const [isLoggedIn, setIsLoggedIn] = useState(true); // Change to false to simulate logged-out state
   const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

   // User data (could be fetched from an API)
   const user = {
     name: 'John Doe',
   };
   const handleLogout = () => {
      setIsLoggedIn(false); // Set isLoggedIn to false to simulate logout
      setIsDropdownOpen(false); // Close the dropdown after logging out
    };
  return (
   <nav className="bg-white shadow-md fixed w-full z-50 top-0">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
      <div className="flex items-center">
        { userType === 'donor' ? 
          (<>
           <a href="#" className="ml-6 text-gray-700 hover:text-gray-900">Donate</a>
           </>
          ):
          (<a href="#" className="ml-6 text-gray-700 hover:text-gray-900">Request</a>)
        }
      </div>

      <div className="hidden md:flex  items-center text-green-600 text-xl ">
          <img src={logo}
            alt="Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold text-green-600 ml-1">SAHEM</span>
      </div>
     
       {/* Right side - Buttons */}
       <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              {/* Profile Name */}
              <div
                className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-full"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
              >
                {user.name} {/* Display user name */}
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>Logout</a>
                </div>
              )}
            </div>
          ) : (
            <>
            <a href="#" className="text-green-600 hover:text-green-700">Login</a>
            <a className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-full">Start a SAHEM</a>
            </>
          )}
        </div>

      </div>
   </nav>
  )
}

export default NavigationBar
