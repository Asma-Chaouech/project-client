import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import '../assets/css/style.css';
import '../assets/cssf/ProfilePage.css'; // Add your CSS styles here
import AOS from 'aos';
import AddressSearch from './AddressSearch';
import Headerprofile from './haederprofil';

const Adresscrud: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
  const [address, setAddress] = useState<string>('');
  const [userDocId, setUserDocId] = useState<string>('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showMap, setShowMap] = useState<boolean>(false); // Nouvel état pour contrôler l'affichage de la carte

  const mapRef = useRef<HTMLDivElement | null>(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AOS.init();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
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
            const userData = userDoc.data();
            if (userData && userData.addresses) {
              setAddresses(userData.addresses);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      }
    };

    fetchUserData();
  }, [auth]);

  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: selectedLocation,
        zoom: 15
      });

      const marker = new google.maps.Marker({
        position: selectedLocation,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: "Faites-moi glisser !"
      });

      marker.addListener('dragend', (event: google.maps.MouseEvent) => {
        const newLocation = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
        setSelectedLocation(newLocation);
        fetchAddress(newLocation.lat(), newLocation.lng());
      });
    }
  }, [selectedLocation]);

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
    setShowMap(true); // Affiche la carte après la sélection d'une position
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          setSelectedLocation(location);
          fetchAddress(position.coords.latitude, position.coords.longitude);
          setShowMap(true); // Affiche la carte après la sélection d'une position
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
    setShowMap(true); // Affiche la carte après la sélection d'une position
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
        const newAddressDocRef = doc(collection(userRef, 'addresses'));

        await updateDoc(userRef, {
          addresses: arrayUnion({
            id: newAddressDocRef.id,
            latitude: selectedLocation.lat(),
            longitude: selectedLocation.lng(),
            address: address,
            timestamp: new Date()
          })
        });

        setSuccess('Votre adresse a été enregistrée avec succès.');
        setError('');

        // Wait for 3 seconds before navigating to the profile page
        setTimeout(() => {
          navigate('/profile');
        }, 3000);

      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'adresse:', error);
        setError('Un problème est survenu lors de l\'enregistrement de l\'adresse. Veuillez réessayer.');
        setSuccess('');
      }
    } else {
      setError('Veuillez sélectionner un emplacement sur la carte ou entrer une adresse.');
      setSuccess('');
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
  return (
   
      <div >
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
          <div id="page" className="page-container">
            <Headerprofile />
            <div className="wrap-login-page">
              <div className="flex-grow flex flex-column justify-center gap-30">
                <div className="login-box">
                <div className="title-container">
            <img src="https://firebasestorage.googleapis.com/v0/b/deliverysitem-4dcc6.appspot.com/o/favicon.png?alt=media&token=5054e003-5422-41b4-b1bc-f4a04d9de187" alt="Logo" className="logo" />
            <h3 className="pagetitre">Ajouter une adresse de livraison</h3>
          </div>
                
                  <form className="form-login flex flex-column gap-24" onSubmit={handleSubmit}>
                    <fieldset className="email">
                      <div className="body-title mb-10">
                        Adresse <span className="required"></span>
                      </div>
                      <AddressSearch onSelect={handleLocationSelect} />
                    </fieldset>
                    <button type="button" className="tf-button style-2 w-full" id="bot" onClick={handleCurrentLocation}>
                      Utiliser ma position actuelle
                    </button>
                    
                    <div className="button-link location-form__link hidden-mobile default" onClick={handleMapLocation}>
                      <a href="#" onClick={handleMapLocation}> Ou définissez votre emplacement sur la carte</a>
                    </div>
                    
                    {error && <div className="error" style={{ color: '#f44336' }}>{error}</div>}
                    {success && <div className="success" style={{ color: '#4caf50' }}>{success}</div>}
                    <button type="submit" className="tf-button style-2 w-full" id="bot">Enregistrer l'adresse</button>
                  </form>
                  
                  {selectedLocation && (
                    <div className="selected-location">
                      <p><strong>Adresse :</strong> {address}</p>
                    </div>
                  )}
                </div>
                {showMap && (
                  <div ref={mapRef} className="map-container" style={{ height: '300px', width: '100%' }}></div>
                )}
                  <div className="section existing-addresses">
    <h3>Adresses enregistrées</h3>
    {addresses.length > 0 ? (
      <ul className="address-list">
        {addresses.map((addr: any, index: number) => (
          <li key={addr.id} className="address-item">
            <p><strong>Adresse :</strong> {addr.address}</p>
            <button className="tf-button style-3" onClick={() => handleDeleteAddress(addr.id)}>
              X
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p>Aucune adresse enregistrée.</p>
    )}
  </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  

  
export default Adresscrud;
