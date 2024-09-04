import React, { useState } from 'react';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Assurez-vous que le chemin est correct

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const auth = getAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const oobCode = searchParams.get('oobCode');
    const email = searchParams.get('email'); // Assuming email is passed in the URL

    if (!oobCode || !email) {
      setError('Lien de réinitialisation de mot de passe invalide.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);

      // Update the user's password in Firestore
      const userDocRef = doc(db, 'clients', email);
      await updateDoc(userDocRef, {
        password: newPassword
      });

      setSuccess('Mot de passe réinitialisé avec succès !');
      navigate('/login');
    } catch (error) {
      setError('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
      console.error('Erreur de réinitialisation:', error);
    }
  };

  return (
    <div id="wrapper" style={{ backgroundColor: 'orange' }}>
      <div id="page" className="">
        <div className="wrap-login-page">
          <div className="flex-grow flex flex-column justify-center gap30">
            <a href="index.html" id="site-logo-inner"></a>
            <div className="login-box">
              <div>
                <h3>Réinitialiser votre mot de passe</h3>
                <div className="body-text">Entrez votre nouveau mot de passe</div>
              </div>
              <form className="form-login flex flex-column gap24" onSubmit={handleResetPassword}>
                <fieldset className="password">
                  <div className="body-title mb-10">
                    Nouveau mot de passe <span className="tf-color-1">*</span>
                  </div>
                  <input
                    className="flex-grow"
                    type="password"
                    placeholder="Entrez votre nouveau mot de passe"
                    name="newPassword"
                    tabIndex={0}
                    aria-required="true"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </fieldset>
                <button type="submit" className="button button-2">
                  Réinitialiser le mot de passe
                </button>
                {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
                {success && <div className="success" style={{ color: 'green' }}>{success}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
