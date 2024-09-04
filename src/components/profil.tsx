import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { db } from '../firebaseConfig'; // Make sure this path is correct
import '../assets/cssf/ProfilePage.css'; // Add your CSS styles here
import axios from 'axios';
import '../assets/css/style.css';
import AddressSearch from './AddressSearch';
import Headerprofile from './haederprofil';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faBars, faXmark, faUser, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons'; 
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FaShoppingCart } from 'react-icons/fa';
const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [userDocId, setUserDocId] = useState<string>('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]); // State for cart items
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
  const [address, setAddress] = useState<string>('');

  const mapRef = useRef<HTMLDivElement | null>(null);
  const auth = getAuth();
  const navigate = useNavigate();

  const [total, setTotal] = useState<number>(0);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            const usersRef = collection(db, 'clients');
            const q = query(usersRef, where('email', '==', user.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setUserDocId(userDoc.id);
                const data = userDoc.data();
                setUserData(data);
                setName(data.name);
                setEmail(data.email);
                setPhoneNumber(data.phoneNumber);

                if (data.addresses) setAddresses(data.addresses);
                if (data.cart) setCartItems(data.cart);

                // Save user data to localStorage
                localStorage.setItem('userData', JSON.stringify(data));
                localStorage.setItem('userDocId', userDoc.id);

                setLoading(false);
            } else {
                setError('Utilisateur non trouvé dans Firestore.');
            }
        } catch (error) {
            setError('Erreur lors de la récupération des données utilisateur.');
            console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
    } else {
        setError('Utilisateur non connecté.');
    }
};

useEffect(() => {
  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const usersRef = collection(db, 'clients');
        const q = query(usersRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserDocId(userDoc.id); // Save the document ID
          setUserData(userDoc.data());
          setName(userDoc.data().name);
          setEmail(userDoc.data().email);
          setPhoneNumber(userDoc.data().phoneNumber);
  
          if (userDoc.data().addresses) {
            setAddresses(userDoc.data().addresses);
          }
  
          if (userDoc.data().cart) {
            setCartItems(userDoc.data().cart); // Set the cart items
          }
  
          setLoading(false);
        } else {
          setError('Utilisateur non trouvé dans Firestore.');
        }
      } catch (error) {
        setError('Erreur lors de la récupération des données utilisateur.');
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    } else {
      setError('Utilisateur non connecté.');
    }
  };
  
  fetchUserData();
  }, [auth]);
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const usersRef = collection(db, 'clients');
          const q = query(usersRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUserDocId(userDoc.id);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      }
    };

    fetchUserData();
  }, [auth]);


  
  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendPasswordResetEmail(auth, user.email!);
        setSuccess('Email de réinitialisation du mot de passe envoyé.');
        setError(''); // Clear any previous errors;
      } else {
        setError('Utilisateur non connecté.');
      }
    } catch (error: any) {
      setError('Erreur lors de l\'envoi de l\'email de réinitialisation du mot de passe.');
      setSuccess(''); // Clear any previous success messages
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation du mot de passe:', error);
    }
  };

  const validateInputs = () => {
    // Check if name contains only letters and spaces
    if (!name.match(/^[A-Za-z ]+$/)) {
      setError('Le nom ne doit contenir que des lettres et des espaces.');
      return false;
    }
  
    // Check if email is in a valid format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Veuillez entrer une adresse email valide.');
      return false;
    }
  
    // Clean phone number by removing non-digit characters
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
  
    // Check for +33 (France) with 9 digits (excluding the country code)
    if (phoneNumber.startsWith('+33') && cleanedNumber.length === 11) {
      return true;
    }
  
    // Check for +216 (Tunisia) with 8 digits (excluding the country code)
    if (phoneNumber.startsWith('+216') && cleanedNumber.length === 11) {
      return true;
    }
  
    // If neither condition is met, set an error message
    setError('Le numéro de téléphone doit être au format +33 avec 9 chiffres ou +216 avec 8 chiffres.');
    return false;
  };
  

  const handleSaveChanges = async () => {
    if (!validateInputs()) return;

    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'clients', userDocId);

        // Check if the document exists before updating
        const docSnapshot = await getDoc(userRef);
        if (!docSnapshot.exists()) {
          setError('Le document spécifié n\'existe pas.');
          console.error('Document not found for ID:', userDocId);
          return;
        }

        console.log('Updating document for ID:', userDocId);
        await updateDoc(userRef, { name, email, phoneNumber });

        setSuccess('Données sauvegardées avec succès.');
        setError(''); 
        setEditMode(false);

        // Refresh user data after update
        await fetchUserData();
      } else {
        setError('Utilisateur non connecté.');
      }
    } catch (error: any) {
      let errorMessage = 'Erreur lors de la sauvegarde des données.';

      if (error.code) {
        switch (error.code) {
          case 'permission-denied':
            errorMessage = "Vous n'avez pas la permission de modifier ces données.";
            break;
          case 'unavailable':
            errorMessage = "Le service n'est pas disponible. Veuillez réessayer plus tard.";
            break;
          case 'network-request-failed':
            errorMessage = "Échec de la requête réseau. Vérifiez votre connexion internet.";
            break;
          default:
            errorMessage = `Erreur inattendue: ${error.message}`;
        }
      } else {
        errorMessage = `Erreur: ${error.message}`;
      }

      setError(errorMessage);
      setSuccess(''); 
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  };
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          latlng: `${lat},${lng}`,
          key: 'AIzaSyDFUn6EuiuNTZ0TsETQ-BhCpmMcvOA7FME'
        }
      });
      const result = response.data.results[0];
      setAddress(result.formatted_address);
    } catch (error) {
      console.error('Erreur lors de la récupération de l’adresse:', error);
    }
  };

  const handleLocationSelect = (location: google.maps.LatLng) => {
    setSelectedLocation(location);
    fetchAddress(location.lat(), location.lng());
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          setSelectedLocation(location);
          fetchAddress(position.coords.latitude, position.coords.longitude);
        },
        () => {
          alert('Impossible de récupérer votre position.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  };

  const handleMapLocation = () => {
    if (mapRef.current) {
      const initialLocation = selectedLocation || new google.maps.LatLng(48.8566, 2.3522); // Paris coordinates
      const map = new google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 15
      });

      const marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: "Faites-moi glisser !"
      });
      marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const newLocation = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
          setSelectedLocation(newLocation);
          fetchAddress(newLocation.lat(), newLocation.lng());
        }
      });

      alert('Déplacez le marqueur sur la carte pour définir votre emplacement.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedLocation && userDocId) {
      try {
        const userRef = doc(db, 'clients', userDocId);
        const newAddressDocRef = doc(collection(db, 'addresses'));
        await updateDoc(userRef, {
          addresses: arrayUnion({
            id: newAddressDocRef.id,
            latitude: selectedLocation.lat(),
            longitude: selectedLocation.lng(),
            address: address
          })
        });

        // Mettre à jour l'état des adresses pour un affichage en temps réel
        setAddresses(prevAddresses => [
          ...prevAddresses,
          {
            id: newAddressDocRef.id,
            latitude: selectedLocation.lat(),
            longitude: selectedLocation.lng(),
            address: address
          }
        ]);

        setSelectedLocation(null);
        setAddress('');
        setSuccessMessage('Adresse ajoutée avec succès.');
        setErrorMessage(''); // Effacer les erreurs précédentes

        // Hide the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // 3 seconds

      } catch (error) {
        setErrorMessage('Erreur lors de l\'ajout de l\'adresse.');
        console.error('Erreur lors de l\'ajout de l\'adresse:', error);

        // Hide the error message after 3 seconds
        setTimeout(() => {
          setErrorMessage('');
        }, 3000); // 3 seconds
      }
    } else {
      setErrorMessage('Veuillez sélectionner une adresse valide.');

      // Hide the error message after 3 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // 3 seconds
    }
  };
  const handleDeleteAddress = async (addressId: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'clients', userDocId);

        // Get the current user data
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData && userData.addresses) {
          // Filter the addresses to remove the one with the matching ID
          const updatedAddresses = userData.addresses.filter((addr: any) => addr.id !== addressId);

          // Update the addresses field in Firestore
          await updateDoc(userRef, { addresses: updatedAddresses });

          // Update the local state
          setAddresses(updatedAddresses);
          setSuccess('Adresse supprimée avec succès.');
          setError(''); // Clear any previous errors
        } else {
          setError('Erreur lors de la récupération des adresses.');
        }
      } else {
        setError('Utilisateur non connecté.');
      }
    } catch (error: any) {
      setError('Erreur lors de la suppression de l\'adresse.');
      setSuccess(''); // Clear any previous success messages
      console.error('Erreur lors de la suppression de l\'adresse:', error);
    }
  };
  const handleGoToAddressManagement = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate('/Adresscrud'); // Replace with the actual route
  };
  return (
    
<div className="profile-page">
  <Headerprofile />

      <div className="profile-container">
        <div className="profile-left">
          <div className="profile-header">
            <h1>Mon Profil</h1>
          </div>
          
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <div className="profile-content">
              <div className="profile-item">
                <img
                  src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/person.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d"
                  alt="Profile Icon"
                />
                <div className="profile-info">
                  {editMode ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  ) : (
                    <div className="title">{userData?.name}</div>
                  )}
                </div>
              </div>

              <div className="profile-item">
                <img
                  src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/mail.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d"
                  alt="Email Icon"
                />
                <div className="profile-info">
                  {editMode ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <div className="title">{userData?.email}</div>
                  )}
                </div>
              </div>

              <div className="profile-item">
                <img
                  src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/lock.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d"
                  alt="Password Icon"
                />
                <div className="profile-info">
                  <div className="title">
                    <a href="#" onClick={handleChangePassword}>
                      Changer le mot de passe
                    </a>
                  </div>
                </div>
              </div>

              <div className="profile-item">
                <img
                  src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/screen.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d"
                  alt="Phone Icon"
                />
                <div className="profile-info">
                  {editMode ? (
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  ) : (
                    <div className="title">{userData?.phoneNumber}</div>
                  )}
                </div>
              </div>

          

              <div className="profile-item">
      <img
        src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/location.svg"
        alt="Address Icon"
      />
      <div className="profile-info">
        <div className="title">
          <a href="#" onClick={handleGoToAddressManagement}>
            Gérer les adresses
          </a>
        </div>
      </div>
    </div>

              <div className="profile-actions">
                <button className="tf-button style-2 w-full" onClick={() => setEditMode(!editMode)}>
                  {editMode ? 'Annuler' : 'Modifier'}
                </button>
                {editMode && (
                  <button className="tf-button style-2 w-full" onClick={handleSaveChanges}>
                    Sauvegarder
                  </button>
                )}
              </div>

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
            </div>
          )}
          
        </div>

        </div>
          
 
            
     
  
   
  </div>     
    
  );
};

export default Profile;
