import React, { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const clearLocalStorage = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem('userName');
    localStorage.removeItem('userData');  
  localStorage.removeItem('userDocId');
  };
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        clearLocalStorage(); // Clear local storage before signing out
        await signOut(auth); // Sign out the user
        navigate('/about'); // Redirect to the landing page after logout
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    };

    performLogout();
  }, [auth, navigate]);

  return (
    <div>
      <p>Déconnexion en cours...</p>
    </div>
  );
};

export default Logout;
