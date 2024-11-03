import { useEffect } from 'react';
import { useNavigate , Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const AutoRedirect = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (userData) {
  //     if (userData.role === 'admin') {
  //       navigate('/admin/dashboard');
  //     } else if (userData.role === 'student') {
  //       navigate('/student/dashboard');
  //     }
  //   }
  // }, [userData, navigate]);

  return <Outlet />;
};

export default AutoRedirect;