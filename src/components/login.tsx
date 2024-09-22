import React, { useState, useEffect } from 'react';

import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../assets/css/style.css';
import '../assets/cssf/Login.css';
import AOS from 'aos';
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AOS.init();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Authentification avec Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Rechercher l'utilisateur par email dans la collection "clients"
      const q = query(collection(db, 'clients'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Utilisateur non trouvé dans la base de données.');
        return;
      }

      let isBlocked = false;
      let userName = '';

      // Vérifier le statut bloqué et mettre à jour le mot de passe dans Firestore si nécessaire
      for (const docSnapshot of querySnapshot.docs) {
        const userData = docSnapshot.data();
        isBlocked = userData.blocked || false;
        userName = userData.name || '';
        console.log(userData)

        if (userData.password !== password) {
          // Mettre à jour le mot de passe dans Firestore
          const userRef = doc(db, 'clients', docSnapshot.id);
          await updateDoc(userRef, { password });
          setSuccess('Mot de passe mis à jour avec succès.');
        }
      }

      if (isBlocked) {
        setError('Votre compte est bloqué. Veuillez contacter le support.');
        return;
      }

      setSuccess('Connexion réussie.');
      localStorage.setItem('userId', auth.currentUser?.uid || '');
      localStorage.setItem('userName', userName || ''); 



      navigate('/AddressPage'); // Redirige vers la page d'adresse
    } catch (error) {
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
      console.error('Erreur lors de la connexion:', error);
    }
  };

  const handlePasswordReset = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez entrer votre adresse mail.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Email de réinitialisation envoyé. Veuillez vérifier votre boîte de réception.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      setError('Erreur lors de l\'envoi de l\'email de réinitialisation. Veuillez réessayer.');
    }
  };

  return (
    
    <>
{loading && (
  <div className="page-loader">
    <div className="wrapper">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
      <span>Loading</span>
    </div>
  </div>
)}
{!loading && (
  <div id="wrapper">
  <div id="page">
    <div className="wrap-login-page">
      <a href="index.html" id="site-logo-inner"></a>
      <div className="login-box">
        <div className="title-container">
          <img src="https://firebasestorage.googleapis.com/v0/b/deliverysitem-4dcc6.appspot.com/o/favicon.png?alt=media&token=5054e003-5422-41b4-b1bc-f4a04d9de187" alt="Logo" className="logo" />
          <h3 className="pagetitre">Connectez-vous à votre compte</h3>
        </div>
        <form className="form-login" onSubmit={handleLogin}>
          <fieldset className="email">
            <div className="body-title mb-10">
              Adresse mail <span className="tf-color-1">*</span>
            </div>
            <div className="input-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Entrez votre adresse mail"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </fieldset>
          <fieldset className="password">
            <div className="body-title mb-10">
              Mot de passe <span className="tf-color-1">*</span>
            </div>
            <div className="input-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Entrez votre mot de passe"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </fieldset>
          <button type="submit" className="tf-button style-2 w-full" id="bot">
            Se connecter
          </button>
          <p>
            <a href="#" onClick={handlePasswordReset}>mot de passe oublié</a>
          </p>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
        <div className="new-client">
          <p>
            <a href="/signup">Vous n'avez pas de compte ? Inscrivez-vous ici.</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
)}
</>
);
};

export default Login;
