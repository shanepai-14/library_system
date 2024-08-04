import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../Utils/interceptor';
import {showUser} from '../../Utils/endpoint'
import Swal from 'sweetalert2';
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return token ? true : false;
};

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setIsAuthenticated(true);
    }
  }, []);

  const auth = (response) => {
    setUserData(response.data.user);
    setIsAuthenticated(true);
         localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));


  };
  const updateUserData = (updatedFields, userID) => {
    return api  // Return the Promise chain
      .patch(showUser(userID), updatedFields)
      .then((res) => {
        if (res.status === 200) {
          const updatedUserData = { ...userData, ...updatedFields };
          setUserData(updatedUserData);
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
          Swal.fire({
            title: "Success!",
            text: "User data updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
          
          return updatedUserData;
        } else {
          throw new Error('Failed to update user data');
        }
      })
      .catch((error) => {
        console.error('Error updating user data:', error);
  
        Swal.fire({
          title: "Error!",
          text: "Failed to update user data. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
  
        return false;
      })
      .finally(() => {
        // You can add any cleanup or final actions here if needed
      });
  };
  const logout = () => {
    setUserData(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
  };

  const value = {
    userData,
    isAuthenticated,
    auth,
    logout,
    updateUserData,
    setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
