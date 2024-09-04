import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Assurez-vous que le chemin est correct
import { useNavigate } from 'react-router-dom';
import '../assets/css/animate.min.css';
import '../assets/css/animation.css';
import '../assets/css/bootstrap.css';
import '../assets/css/bootstrap-select.min.css';
import '../assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/cssf/owl.carousel.min.css';
import '../assets/cssf/owl.theme.default.min.css';
import '../assets/cssf/nice-select.css';
import '../assets/cssf/aos.css';
import '../assets/cssf/style.css';
import '../assets/cssf/responsive.css';
import '../assets/cssf/color.css';

const UpdatePassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Référence à la collection 'clients'
      const usersRef = collection(db, 'clients');
      // Création de la requête pour trouver l'utilisateur par email
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Authentifier l'utilisateur avec l'ancien mot de passe
        try {
          await signInWithEmailAndPassword(auth, email, currentPassword);

          // Mettre à jour le mot de passe dans Firebase Authentication
          const user = auth.currentUser;
          if (user) {
            await updatePassword(user, newPassword);

            // Mettre à jour le mot de passe dans Firestore
            await updateDoc(userDoc.ref, { password: newPassword });

            setSuccess('Mot de passe mis à jour avec succès !');
            navigate('/login');
          } else {
            setError('Erreur lors de la mise à jour du mot de passe. Utilisateur non authentifié.');
          }
        } catch (authError) {
          // Erreur d'authentification
          setError('Mot de passe actuel incorrect. Veuillez vérifier votre mot de passe actuel.');
          console.error('Erreur d\'authentification:', authError);
        }
      } else {
        setError('Utilisateur non trouvé.');
      }
    } catch (error) {
      setError('Erreur lors de la mise à jour du mot de passe. Veuillez réessayer.');
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
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
                <h3>Mettre à jour votre mot de passe</h3>
                <div className="body-text">Entrez votre adresse email, votre mot de passe actuel et votre nouveau mot de passe</div>
              </div>
              <form className="form-login flex flex-column gap24" onSubmit={handleUpdatePassword}>
                <fieldset className="email">
                  <div className="body-title mb-10">
                    Adresse email <span className="tf-color-1">*</span>
                  </div>
                  <input
                    className="flex-grow"
                    type="email"
                    placeholder="Entrez votre adresse email"
                    name="email"
                    tabIndex={0}
                    aria-required="true"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </fieldset>
                <fieldset className="current-password">
                  <div className="body-title mb-10">
                    Mot de passe actuel <span className="tf-color-1">*</span>
                  </div>
                  <input
                    className="flex-grow"
                    type="password"
                    placeholder="Entrez votre mot de passe actuel"
                    name="currentPassword"
                    tabIndex={0}
                    aria-required="true"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </fieldset>
                <fieldset className="new-password">
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
                  Mettre à jour le mot de passe
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

export default UpdatePassword;
