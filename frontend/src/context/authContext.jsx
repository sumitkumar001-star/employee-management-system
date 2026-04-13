import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


// Create a context to hold user authentication state
const userContext = createContext();

const AuthContext = ({ children }) => {
  // State to track if the user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to store the current user's data (name, role, etc.)
  const [user, setUser] = useState(null);
  // State to manage the initial verification loading process
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Function to verify the JWT token stored in localStorage on app load
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token');
        // If no token exists, stop loading and remain unauthenticated
        if (!token) {
          setLoading(false);
          return;
        }

        // Call the backend to verify the token and get user details
        const response = await axios.get('https://employee-management-system-wjrt.vercel.app/api/auth/verify',{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        
        if(response.data.success){
          // If verification is successful, update state with user info
          setUser(response.data.user);
          setIsAuthenticated(true);
        }else{
          // If verification fails, clear user state
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      
      }catch(error){
        // Handle network errors or invalid tokens
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        // Ensure loading is set to false regardless of the outcome
        setLoading(false);
      }
    };
    verifyUser();
  },[])

  // Function to manually set user state upon successful login
  const login = (user) => {
    setIsAuthenticated(true);
    setUser(user);
  };

  // Function to clear user state and remove token upon logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
  };
  return (
    <userContext.Provider value={{ user, isAuthenticated, login, logout, loading}}>
      {children}
    </userContext.Provider>
  );
};
// Custom hook to easily access the auth context from any component
export const useAuthContext = () => {
  return React.useContext(userContext);
}; 
export default AuthContext;
 