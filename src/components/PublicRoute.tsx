/*import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  useEffect(() => {
    // Clear the userId from localStorage when the application starts
    localStorage.removeItem('userId');
  }, []);

  const isLoggedIn = localStorage.getItem('userId') !== null;

  return !isLoggedIn ? <Outlet /> : <Navigate to="/about" replace />;
};

export default PublicRoute;*/
import { Outlet } from 'react-router-dom';

const PublicRoute = () => {
  return <Outlet />;
};

export default PublicRoute;

