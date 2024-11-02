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
    // Create a new FormData instance
    const formData = new FormData();
    
    // Iterate through the updatedFields and append to FormData
    Object.keys(updatedFields).forEach(key => {
      if (key === 'profile_picture') {
        // Handle profile picture file
        console.log('profile_picture' , key ,true)
        if (updatedFields[key] instanceof File) {
          formData.append('profile_picture', updatedFields[key]);
          console.log('append profile_picture' , updatedFields[key])
        }
      } else {
        formData.append(key, updatedFields[key]);
      }
    });
  
    // Set headers for multipart form data
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
  
    return api
      .post(`user_update/${userID}`, formData, config)
      .then((res) => {
        if (res.status === 200) {
          // Create updated user data object
          const updatedUserData = { ...userData };
          
          // Update all fields except profile_picture
          Object.keys(updatedFields).forEach(key => {
            if (key !== 'profile_picture') {
              updatedUserData[key] = updatedFields[key];
            }
          });
          
          // If there's a profile_picture in the response, update it
          if (res.data.user.profile_picture) {
            updatedUserData.profile_picture = res.data.user.profile_picture;
          }
  
          // Update state and localStorage
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
          text: error.response?.data?.message || "Failed to update user data. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
  
        return false;
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
