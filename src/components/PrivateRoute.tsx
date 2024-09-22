/*import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isLoggedIn = localStorage.getItem('userId') !== null;

  // If the user is logged in, render the protected content
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;*/
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const isLoggedIn = localStorage.getItem('userId') !== null;
  const location = useLocation();
  const isLogout = localStorage.getItem('isLogout') === 'true'; // Check the logout flag

  useEffect(() => {
    if (isLogout) {
      // Delay before redirection
      const timeout = setTimeout(() => {
        localStorage.removeItem('isLogout');
        setShouldRedirect(true);
        setIsLoading(false);
      }, 1000); // 1000ms delay, adjust as needed

      // Cleanup timeout if the component unmounts
      return () => clearTimeout(timeout);
    } else {
      setIsLoading(false);
    }
  }, [isLogout]);

  if (isLoading) {
    // Show a loading spinner or placeholder if needed
    return <div>Loading...</div>;
  }

  if (shouldRedirect) {
    return <Navigate to="/about" replace />;
  }

  if (!isLoggedIn) {
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

