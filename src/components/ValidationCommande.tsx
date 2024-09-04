
import React, { useState, useEffect } from 'react';
import '../assets/cssf/ValidationCommande.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, arrayUnion   } from 'firebase/firestore';
import Headerprofile from './haederprofil';
import '../assets/css/style.css';
import '../assets/cssf/ProfilePage.css'; // Add your CSS styles here
import '../assets/cssf/ValidationCommande.css'; // Add your CSS styles here
import { db } from '../firebaseConfig';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import MyModal from './Modal';
import MyModalconf from './Modalconf' 
import CommandInvoice from './commandInvoice';
import {payementMethod} from './Config';
const stripePromise = loadStripe('pk_test_51NaIyXLrmvfcbdCw6qYQRUAskIqMI9nHplJvoyg0kxJ0bSUgXNOsbMIvY72ylNz60stMNXo79Ro4IKZ0MuqWdyPh007gtwbCql');
const SECRET_KEY = "sk_test_51NaIyXLrmvfcbdCwhxjtYMinGnA1vFLQazZaR8Em23ddZ3fC9l5QJbFX5hzau3xewOuwgGytmsKH5kUirsmJow3d00P8kuMyWI";



interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  productCategory: string;
  quantity: number;
  productImage: string;
  
}

interface Client {
  addresses: Address[];
  clientID: string;
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
}
interface Address {
  timestamp: string;
  address: string;
  latitude: number;
  longitude: number;
  id: string;
}

const ValidationCommande: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems: initialCartItems, total, deliveryAddress } = location.state as {
    cartItems: CartItem[];
    total: string;
    deliveryAddress: string;
  };

  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems || []);
  const [client, setClient] = useState<Client | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [tipError, setTipError] = useState<string>('');
  const [tip, setTip] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>(payementMethod.Carte);
  const [promoError, setPromoError] = useState<string>('');
  const [deliveryCost, setDeliveryCost] = useState<number>(8.000);
  const [userDocId, setUserDocId] = useState<string>('');
  const [lastAddress, setLastAddress] = useState<string>(deliveryAddress);
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const [selectedAddress, setSelectedAddress] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [showModalconf, setShowModalconf] = useState(false);
  const handleShowconf = () => setShowModalconf(true);
  const handleCloseconf = () => setShowModalconf(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [command, setCommand] = useState<any>(null);


  const handleConfirm = async () => {
    if(!confirmAction){
      console.log("annulé")
      return;
    }
  };

  const handleConfirmconfCard = async () => {
   
    try {
      await confirmOrderCard(); // Exécute la fonction confirmOrder
      console.log("Succès");
    } catch (error) {
      console.error('Une erreur est survenue lors de la confirmation de la commande:', error);
    } finally {
      handleCloseconf(); // Fermer le modal après confirmation
    }
  };
  const handleConfirmconfCash = async () => {
    try {
      await confirmOrderCash(); // Call the confirmOrderCash function directly
      console.log("Succès");
    } catch (error) {
      console.error('Une erreur est survenue lors de la confirmation de la commande:', error);
    } finally {
      handleCloseconf(); // Close the modal after confirmation
    }
  };
  const handleCancelconf = () => {
    setConfirmAction(false);
    setShowModalconf(false);
    /*resolve(false);*/
  };
  const handleCancel = () => {
    setConfirmAction(false);
    setShowModal(false);
  };
  console.log(payementMethod.Carte);

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
            const userData = userDoc.data() as Client;

            setUserDocId(userDoc.id); // Save the document ID
            setUserData(userData);
            setClient(userData);

            setName(userData.name);
            setEmail(userData.email);
            setPhoneNumber(userData.phoneNumber);

            if (userData.addresses) {
              setAddresses(userData.addresses);
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

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*\.?\d*$/.test(value)) {
      setTipError('Veuillez entrer uniquement des chiffres.');
    } else {
      setTip(Number(value));
      setTipError('');
    }
  };
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
  };
  const applyPromoCode = async () => {
    setPromoError('');
    const promoCodeTrimmed = promoCode.trim();

    if (promoCodeTrimmed === '') {
      setPromoError('Veuillez entrer un code promo.');
      return;
    }
    try {
      const promoQuery = query(collection(db, 'promoCode'), where('code', '==', promoCodeTrimmed));
      const querySnapshot = await getDocs(promoQuery);
      if (querySnapshot.empty) {
        setPromoError('Code promo invalide');
        setDiscount(0);
        return;
      }
      const promoData = querySnapshot.docs[0].data();
      const finishedAt = new Date(promoData.finishedAt);
      const discountRate = promoData.discount;
      const today = new Date();
      if (finishedAt < today) {
        setPromoError('Code promo expiré');
        setDiscount(0);
      } else {
        const discountAmount = parseFloat(total) * (discountRate / 100);
        setDiscount(discountAmount);
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      setPromoError('Erreur lors de l\'application du code promo.');
    }
  };
 

  useEffect(() => {
    if (parseFloat(total) > 100.00) {
      setDeliveryCost(0.00);
    } else {
      setDeliveryCost(8.00);
    }
  }, [total]);



  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };
 

  useEffect(() => {
    if (parseFloat(calculateTotalPrice()) > 100.000) {
      setDeliveryCost(0.000);
    } else {
      setDeliveryCost(8.000);
    }
  }, [total]);

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0).toFixed(3);
  };

  const finalTotal = (parseFloat(calculateTotalPrice()) - discount + tip + deliveryCost).toFixed(3);
  const calculateAmountInCents = () => {
    // Calculer le montant final en dollars
    const finalTotal = (parseFloat(calculateTotalPrice()) - discount + tip + deliveryCost).toFixed(3);
    
    // Convertir le montant final en cents (en multipliant par 100 et en arrondissant à l'entier le plus proche)
    return Math.round(parseFloat(finalTotal) * 100);
};
// CartItem type definition
  const handleButtonClick = async () => {
    const amountInCents = calculateAmountInCents(); // Obtenir le montant en cents
    setLoading(true);
    try {
        const response = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer sk_test_51NaIyXLrmvfcbdCwhxjtYMinGnA1vFLQazZaR8Em23ddZ3fC9l5QJbFX5hzau3xewOuwgGytmsKH5kUirsmJow3d00P8kuMyWI`,
            },
            body: new URLSearchParams({
                amount: amountInCents.toString(), // Utiliser le montant en cents
                currency: 'usd'
            }).toString(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.client_secret);
        setLoading(false);
    } catch (error) {
        console.error('Error creating payment intent:', error);
       
        setLoading(false);
    }
};

const handleClearCart = () => {
  setCartItems([]);
  localStorage.removeItem('cartItems');
};


const confirmOrderCard = async () => {
  setErrorMessage(null);
  setSuccessMessage(null);

  if (!stripe || !elements) {
    setErrorMessage("Stripe ou Elements n'est pas prêt.");
    return;
  }

  if (!selectedAddress) {
    setErrorMessage('Veuillez sélectionner une adresse de livraison.');
    return;
  }

  if (!cartItems || cartItems.length === 0) {
    setErrorMessage('Votre panier est vide.');
    return;
  }

  if (!paymentMethod) {
    setErrorMessage('Veuillez sélectionner une méthode de paiement.');
    return;
  }

  try {
    const userRef = doc(db, 'clients', userDocId);
    const newPanierRef = doc(collection(userRef, 'panier'));

    const orderDate = new Date().toISOString();

    const panierData = {
      id: newPanierRef.id,
      items: cartItems,
      total: parseFloat(finalTotal),
      deliveryAddress: selectedAddress,
      tip,
      discount,
      deliveryCost,
      finalTotal: parseFloat(finalTotal),
      paymentMethod,
      date: orderDate,
    };
    setCommand(panierData)
    await updateDoc(userRef, { panier: panierData });
    await addDoc(collection(db, 'command'), { userId: userDocId, ...panierData });
    await updateDoc(userRef, { historiqueCommandes: arrayUnion(panierData) });

    if (clientSecret) {
      const cardElement = elements.getElement(CardElement);
      if (cardElement) {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

        if (result.error) {
          setErrorMessage(result.error.message || 'Le paiement a échoué.');
        } else if (result.paymentIntent?.status === 'succeeded') {
          setSuccessMessage('La commande est en cours de traitement...');
          setTimeout(() => {
            handleClearCart();

            navigate('/profile');
          }, 3000);

          const requestBody = {
            clientName: client?.name,
            commandId: panierData.id,
            type: 'command'
          };
          console.log(requestBody)
          console.log(panierData?.id, "me")
          const response = await fetch('http://localhost:3008/api/add-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
          console.log(requestBody)
          console.log('Request body:', JSON.stringify(requestBody, null, 2));
        }
      }
    } else {
      setErrorMessage('Erreur avec la méthode de paiement.');
    }
  } catch (err) {
    console.error('Erreur lors de la sauvegarde de la commande dans Firestore :', err);
    setErrorMessage('Erreur lors de la sauvegarde de la commande. Veuillez réessayer.');
  }
};
const confirmOrderCash = async () => {
  setErrorMessage(null); // Reset error message
  setSuccessMessage(null); // Reset success message

  if (!selectedAddress) {
    setErrorMessage('Veuillez sélectionner une adresse de livraison.');
    return;
  }

  if (!cartItems || cartItems.length === 0) {
    setErrorMessage('Votre panier est vide.');
    return;
  }

  if (!paymentMethod) {
    setErrorMessage('Veuillez sélectionner une méthode de paiement.');
    return;
  }

  try {
    const userRef = doc(db, 'clients', userDocId);
    const newPanierRef = doc(collection(userRef, 'panier'));

    // Get the current date
    const orderDate = new Date().toISOString();

    const panierData = {
      id: newPanierRef.id,
      items: cartItems,
      total: parseFloat(finalTotal),
      deliveryAddress: selectedAddress,
      tip,
      discount,
      deliveryCost,
      finalTotal: parseFloat(finalTotal),
      paymentMethod,
      date: orderDate, // Add order date
    };


    setCommand(panierData)

    // Directly confirm the order
    await updateDoc(userRef, {
      panier: panierData,
    });

    await addDoc(collection(db, 'command'), {
      userId: userDocId,
      ...panierData,
    });

    await updateDoc(userRef, {
      historiqueCommandes: arrayUnion(panierData),
    });

    // Success message
    setSuccessMessage('La commande est en cours de traitement...');
    
    // Clear the cart and redirect after a delay
    setTimeout(() => {
      handleClearCart();
      navigate('/productlist/1'); // Redirect to the product list page
    }, 3000);
    const   requestBody = {
      clientName: client?.name,
      commandId: panierData.id,
      type: 'command'
    };
    console.log(requestBody)
    console.log(panierData?.id , userDocId ,  "me")
    const response = await fetch('http://localhost:3008/api/add-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    console.log(requestBody)
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
} catch (err) {
  console.error('Erreur lors de la sauvegarde de la commande dans Firestore :', err);
 
}
};

const handleButtonAndConfirmOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Pour éviter le rechargement de la page si c'est un bouton de formulaire

  // Appel de la fonction handleButtonClick
    await handleButtonClick();
    //const confirm = window.confirm('Êtes-vous sûr de vouloir confirmer la commande ?');

    handleShowconf();
   
};

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(e.target.value);
  };
  return (
    <div id="validation-container" className="validation-container">
       <Headerprofile />

      <div>
      <h1 className='pan'><strong>Veuillez vérifier vos informations </strong> 
      <p className='pan'> et le contenu de votre panier avant de procéder à la confirmation.</p> </h1>
      </div>
      <div className="order-container">
      {client && client.addresses && client.addresses.length > 0 && (
        <div>
          <h3 className="product-count">Vos Coordonnées</h3>
          <table className="client-details-table">
            <tbody>
              <tr>
                <th className="taa">Nom</th>
                <td>{client.name}</td>
              </tr>
              <tr>
                <th className="taa">Email</th>
                <td>{client.email}</td>
              </tr>
              <tr>
                <th className="taa">Téléphone</th>
                <td>{client.phoneNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

  <div className="cart-summary-section">
    <h3 className="product-count" >Votre panier</h3>
    <p className="product-description">
      {cartItems.length > 0 ? (
        <>
          <table id="cart-items-table" className="cart-items-table">
            <tbody>
              {cartItems.map(item => (
                <tr key={item.productId}>
                  <td><img src={item.productImage} alt={item.productName} className="cart-item-image" /></td>
                  <td>{item.productName}</td>
                  <td>
                    <span className="quantity-display">{item.quantity}</span>
                  </td>
                  <td> {item.productPrice.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div id='order-total-section'><p>Sous-total:  {total}€</p>
          </div>
          <div className="promo-code-section">
  <div className="promo-code-input-container">
    <input
      type="text"
      value={promoCode}
      onChange={handlePromoCodeChange}
      className="promo-code-input"
      placeholder="Code promo"
    />
    <button onClick={applyPromoCode} className="apply-promo-button">Appliquer</button>
  </div>
  {promoError && <p className="promo-error">{promoError}</p>}
  {discount > 0 && !promoError && <p className="promo-description">Réduction appliquée: {discount.toFixed(2)} €</p>}
</div>
   <div className="tip-section">
      <div className="tip-input-container">
        <input
          type="text"
          value={tip === 0 ? '' : tip.toString()} 
          onChange={handleTipChange}
          className="tip-input"
          placeholder="Pourboire"
        />
      </div>
      {tipError && <p className="tip-error">{tipError}</p>}
      <p>Vous avez laissé {tip.toFixed(2)} € comme pourboire.</p>
    </div>
    <div className="order-total-section">
        <p>pourboire :{tip.toFixed(2)} € </p>
        <p>Réduction :{discount.toFixed(2)} €</p>
        <p>Livraison :{deliveryCost.toFixed(2)} €</p>
        <p id='order-total-section' >À payer : {finalTotal} €</p>
      </div>
      {client && client.addresses && client.addresses.length > 0 && (
          <div className="client-addresses-section">
            <h3 className="product-count">Adresse de livrison</h3>
            <select value={selectedAddress} onChange={handleAddressChange} className="address-select">
              <option value="" disabled>Sélectionnez une adresse</option>
              {client.addresses.map((address, index) => (
                <option key={index} value={address.address}>
                  {address.address}
                </option>
              ))}
            </select>
          </div>
        )}
    <div className="payment-method-section">
        <h2 >Paiement :</h2>
        <div className="payment-methods">
          <div
            className={`payment-method-card ${paymentMethod === payementMethod.Carte ? 'active' : ''}`}
            onClick={() => handlePaymentMethodChange(payementMethod.Carte)}
          >
            <div className="payment-icon">💳</div>
            <h3>Carte</h3>
            <p>Payez avec votre carte de crédit ou débit.</p>
          </div>
          <div
            className={`payment-method-card ${paymentMethod === payementMethod.Espece ? 'active' : ''}`}
            onClick={() => handlePaymentMethodChange(payementMethod.Espece)}
          >
            <div className="payment-icon">💵</div>
            <h3>Espèce</h3>
            <p>Payer en espèces lors de la livraison.</p>
          </div>
        </div>
      </div>
      
      <div>
  {paymentMethod === payementMethod.Carte && (
    <form onSubmit={handleButtonAndConfirmOrder} className="stripe-form">
      <CardElement />
      <button type="submit" className="confirm-order-button" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Confirmer la commande'}
      </button>
      <MyModal show={showModal} handleClose={handleCancel} handleConfirm={handleConfirm} />
      <MyModalconf showconf={showModalconf} handleCloseconf={handleCancelconf} handleConfirmconf={handleConfirmconfCard}/>
      <CommandInvoice command={command}/>
    </form>
  )}

{paymentMethod === payementMethod.Espece && (
  <form onSubmit={(e) => {
    e.preventDefault();
    setShowModalconf(true); // Show the confirmation modal on form submit
  }} className="stripe-form">
    <button type="submit" className="confirm-order-button" disabled={loading}>
      Confirmer la commande
    </button>
    <MyModal show={showModal} handleClose={handleCancel} handleConfirm={handleConfirm} />
    <MyModalconf
      showconf={showModalconf}
      handleCloseconf={handleCancelconf}
      handleConfirmconf={handleConfirmconfCash} // Pass the function directly
    />
    <CommandInvoice command={command}/>
  </form>
)}
    {errorMessage && <div className="error-message">{errorMessage}</div>}
    {successMessage && <div className="success-message">{successMessage}</div>}
</div>
   
        </>
      ) : (
        'Votre panier est vide.'
      )}
    </p>
  </div>
</div>

    </div>
  );
};

const WrappedValidationCommande: React.FC = () => (
  <Elements stripe={stripePromise}>
    <ValidationCommande />
  </Elements>
);

export default WrappedValidationCommande;
