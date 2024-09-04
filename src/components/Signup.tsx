import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebaseConfig';
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

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState<string>(''); // State for country code
  const [country, setCountry] = useState<string>(''); // State for country name
  const [paymentOption, setPaymentOption] = useState<string>(''); // State for payment option
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateName = (name: string) => {
    return name.trim().length > 0;
  };

  const validatePhoneNumber = (number: string) => {
    const cleanedNumber = number.replace(/[\s-]/g, ''); // Remove spaces and hyphens
  
    if (countryCode === '+216') {
      return /^\d{8}$/.test(cleanedNumber) || // Tunisia: 8 digits
             /^\+216\s?\d{2}\s?\d{3}\s?\d{3}$/.test(number) || // +216 XX XXX XXX
             /^\d{2}\s?\d{3}\s?\d{3}$/.test(number); // XX XXX XXX
    } else if (countryCode === '+33') {
      return (
        /^\d{9}$/.test(cleanedNumber) || // France: 9 digits without leading 0
        /^0[67]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/.test(number) || // 07 44 73 67 33
        /^\+33\s?7\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/.test(number) || // +33 7 44 73 67 33
        /^00\s?33\s?7\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/.test(number) // 00 33 7 44 73 67 33
      );
    }
    return false;
  };
  const formatPhoneNumber = (number: string) => {
    const cleanedNumber = number.replace(/[\s-]/g, ''); // Remove spaces and hyphens
  
    if (cleanedNumber.startsWith('0033')) {
      // Remove the leading '0033'
      const localNumber = cleanedNumber.slice(4);
      return `00 33 ${localNumber.replace(/(\d{1})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 ')}`;
    } else if (cleanedNumber.startsWith('+33')) {
      // Remove the leading '+33'
      const localNumber = cleanedNumber.slice(3);
      return `+33 ${localNumber.replace(/(\d{1})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 ')}`;
    } else if (cleanedNumber.startsWith('0')) {
      return cleanedNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
    } else if (cleanedNumber.startsWith('+216')) {
      // Remove the leading '+216'
      const localNumber = cleanedNumber.slice(4);
      return `+216 ${localNumber.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3')}`;
    } else if (countryCode === '+216') {
      return cleanedNumber.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3'); // Tunisia: 8 digits
    }
  
    return number; // Return the original number if none of the cases matched
  };
  
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   

    if (!validateEmail(email)) {
      setError('Adresse email invalide.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (!validateName(name)) {
      setError('Le nom ne peut pas être vide.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Le numéro de téléphone doit comporter le bon format pour le pays sélectionné.');
      return;
    }

    try {
      // Créer l'utilisateur dans Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ajouter les informations utilisateur dans la collection "clients" de Firestore
      const clientRef = collection(db, 'clients');
      await addDoc(clientRef, {
        uid: user.uid,  // Utilisez l'UID généré par Firebase Authentication
        email,
        password,  // Notez que stocker les mots de passe en clair n'est pas sécurisé
        name,
        phoneNumber: formatPhoneNumber(phoneNumber), // Stockage du numéro de téléphone avec le code pays
        country // Ajout du pays sélectionné
      });

      setSuccess('Inscription réussie !');
      localStorage.setItem('userId', auth.currentUser?.uid || '');
      navigate('/AddressPage'); // Redirige vers la page d'adresse
      // Effacer les champs du formulaire après l'inscription réussie (optionnel)
      setEmail('');
      setPassword('');
      setName('');
      setPhoneNumber('');
      setCountryCode(''); // Réinitialiser le code du pays
      setCountry(''); // Réinitialiser le pays
      setError('');
    } catch (error) {
      setError('Échec de l\'inscription. Veuillez réessayer.');
      console.error('Erreur lors de l\'inscription:', error);
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
    <div id="wrapper" style={{ backgroundColor: 'WHITE' }}>
      <div id="page" className="">
        <div className="wrap-login-page">
          <div className="flex-grow flex flex-column justify-center gap30">
            <a href="index.html" id="site-logo-inner"></a>
            <div className="login-box">
              <div>
                <div className="title-container">
                  <img src="https://firebasestorage.googleapis.com/v0/b/deliverysitem-4dcc6.appspot.com/o/favicon.png?alt=media&token=5054e003-5422-41b4-b1bc-f4a04d9de187" alt="Logo" className="logo" />
                  <h3 className="pagetitre">Créer votre compte</h3>
                </div>
                <div className="pagetitre body-text">Entrez vos informations pour vous inscrire</div>
              </div>
              <form className="form-login flex flex-column gap24" onSubmit={handleSignup}>
                <fieldset className="email">
                  <div className="body-title mb-10">
                    Adresse mail <span className="tf-color-1">*</span>
                  </div>
                  <div className="input-icon">
                    <i className="fas fa-envelope"></i>
                    <input
                      className="flex-grow"
                      type="email"
                      placeholder="Entrez votre adresse mail."
                      name="email"
                      tabIndex={0}
                      aria-required="true"
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
                      className="flex-grow"
                      type="password"
                      placeholder="Entrez votre mot de passe."
                      name="password"
                      tabIndex={0}
                      aria-required="true"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </fieldset>
                <fieldset className="name">
                  <div className="body-title mb-10">
                    Nom et Prénom <span className="tf-color-1">*</span>
                  </div>
                  <div className="input-icon">
                    <i className="fas fa-user"></i>
                    <input
                      className="flex-grow"
                      type="text"
                      placeholder="Entrez votre nom et votre prénom."
                      name="name"
                      tabIndex={0}
                      aria-required="true"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </fieldset>
                <fieldset className="country">
                      <div className="body-title mb-10">
                        Pays <span className="tf-color-1">*</span>
                      </div>
                      <div className="input-icon">
                        <i className="fas fa-globe"></i>
                        <select
                          className="flex-grow"
                          name="country"
                          tabIndex={0}
                          aria-required="true"
                          required
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);
                            if (e.target.value === 'Tunisia') {
                              setCountryCode('+216');
                            } else if (e.target.value === 'France') {
                              setCountryCode('+33');
                            }
                          }}
                        >
                          <option value="" disabled>
                            Sélectionnez un pays
                          </option>
                          <option value="Tunisia">Tunisia</option>
                          <option value="France">France</option>
                          {/* Ajoutez d'autres options de pays ici */}
                        </select>
                      </div>
                    </fieldset>
                    <fieldset className="phone">
                      <div className="body-title mb-10">
                        Numéro de téléphone <span className="tf-color-1">*</span>
                      </div>
                      <div className="input-icon">
                        <i className="fas fa-phone"></i>
                        <input
                          className="flex-grow"
                          type="text"
                          placeholder={`Numéro de téléphone (${countryCode}...)`}
                          name="phoneNumber"
                          tabIndex={0}
                          aria-required="true"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    </fieldset>
                <button id="bot" type="submit" className="tf-button style-2 w-full">S'inscrire</button>
                <p>
                  <a href="/login">Vous avez déjà un compte ? Connectez-vous ici.</a>
                </p>
                {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
                {success && <div className="success" style={{ color: 'green' }}>{success}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
      )}
      </>
    );
  };
export default Signup;
