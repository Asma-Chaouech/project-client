import React, { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut(auth);
        localStorage.removeItem('userId'); // Clear the user ID from local storage
        navigate('/LandingPage'); // Redirect to the landing page after logout
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    };

    performLogout();
    navigate('/LandingPage'); 
  }, [auth, navigate]);

  return (
    <div>
      <p>Déconnexion en cours...</p>
      
    </div>
    
  );
};

export default Logout;
