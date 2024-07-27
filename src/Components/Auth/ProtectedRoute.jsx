import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth ,isAuthenticated  } from './AuthContext'; 
const ProtectedRoute = ({ children , allowedRoles }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const { userData } = useAuth();
  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  if (!userData) {
    // You might want to show a loading spinner here
    return <div>Loading...</div>;
  }
  

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    // Redirect to unauthorized page or any other route
    return <Navigate to="/unauthorized" />;
  }

  return React.cloneElement(children, { userData });
};

export default ProtectedRoute;