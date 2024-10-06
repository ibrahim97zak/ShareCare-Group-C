import React,{createContext,useContext,useState} from 'react'
const UserContext = createContext();

const UserProvider = ({children}) => {
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [user,setUser] = useState({});
   return (
      <UserContext.Provider
        value={{isLoggedIn,setIsLoggedIn,
                user,setUser
               }}
      >
         {children}
      </UserContext.Provider>
  )
}
export const useUserContext = () => useContext(UserContext);
export default UserProvider;
