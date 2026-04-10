import React, { createContext, useState, useEffect } from "react";
import axios from "axios";



const userContext = createContext();

const AuthContext = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/verify',{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        if(response.data.success){
          setUser(response.data.user);
          setIsAuthenticated(true);
        }else{
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      
      }catch(error){
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  },[])

  const login = (user) => {
    setIsAuthenticated(true);
    setUser(user);
  };

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
export const useAuthContext = () => {
  return React.useContext(userContext);
}; 
export default AuthContext;
 