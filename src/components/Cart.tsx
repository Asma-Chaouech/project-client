import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars,faArrowLeft, faHome, faShoppingCart, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import '../assets/cssf/Cart.css';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { FaShoppingCart } from 'react-icons/fa';
import {  useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore

import { getAuth, signOut } from 'firebase/auth'; // Import Firebase Auth
import Header from './header1';
interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  productImage: string;
  finalTotal: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryCost, setDeliveryCost] = useState<number>(8.000);
  const [total, setTotal] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const auth = getAuth(); // Initialize Firebase Auth
  const [userName, setUserName] = useState<string>('Account'); // State for user's name
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors
  const navigate = useNavigate();
  const db = getFirestore(); // Initialize Firestore

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
            const data = userDoc.data();
            setUserName(data.name || 'Account'); // Update the user's name
     
          

            setLoading(false);
          } else {
            setError('Utilisateur non trouvé dans Firestore.');
            setLoading(false);
          }
        } catch (error) {
          setError('Erreur lors de la récupération des données utilisateur.');
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          setLoading(false);
        }
      } else {
        setError('Utilisateur non connecté.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth, db]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const removeFromCart = (productId: string) => {
    const updatedCartItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const increaseQuantity = (productId: string) => {
    const updatedCartItems = cartItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const decreaseQuantity = (productId: string) => {
    const updatedCartItems = cartItems.map(item =>
      item.productId === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0).toFixed(2);
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    localStorage.setItem('cartTotal',"0");
    localStorage.setItem('cartTotalQuantity',"0");
  };

  useEffect(() => {
    const totalPrice = parseFloat(calculateTotalPrice());
    setTotal(totalPrice);
    if (totalPrice > 100.00) {
      setDeliveryCost(0.00);
    } else {
      setDeliveryCost(8.00);
    }
    localStorage.setItem('cartTotal', (totalPrice + deliveryCost).toString());
  }, [cartItems]);

  const calculateTotalQuantity = (): number => {
    const quantity = localStorage.getItem('cartTotalQuantity');
    return quantity ? parseInt(quantity, 10) : 0;
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      backgroundColor: '#ff0000', // Custom background color
      color: theme.palette.common.white, // Custom text color
      fontSize: '1rem', // Adjust this value to increase text size
 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }));
  const handleUpdateCart = () => {
    navigate(-1);
  };


  return (
    <div id="cart-container" className="cart-container">
       <Header calculateTotalQuantity={calculateTotalQuantity} />

      <h1 className='pan'><strong>Votre panier est prêt !</strong> 
      <p className='pan'> Vérifiez vos articles et passez à la caisse pour compléter votre achat.</p> </h1>
      <div className="cart-header">
        <span className="cart-summary">
          {cartItems.length} {cartItems.length === 1 ? 'produit' : 'produits'}
        </span>
        <button className="clear-cart-button" onClick={handleClearCart}>
          Vider le panier
        </button>
      </div>
      {cartItems.length === 0 ? (
        <p id="empty-cart-message" className="empty-cart-message">Votre panier est vide.</p>
      ) : (
        <>
          <table id="cart-items-table" className="cart-items-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom du produit</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.productId}>
                  <td><img src={item.productImage} alt={item.productName} className="cart-item-image" /></td>
                  <td>{item.productName}</td>
                  <td>{item.productPrice.toFixed(2)}€</td>
                  <td>
                    <button
                      id={`increase-button-${item.productId}`}
                      className="quantity-button"
                      onClick={() => increaseQuantity(item.productId)}
                    >
                      +
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      id={`decrease-button-${item.productId}`}
                      className="quantity-button"
                      onClick={() => decreaseQuantity(item.productId)}
                    >
                      -
                    </button>
                  </td>
                  <td>
                    <button
                      id={`remove-button-${item.productId}`}
                      className="remove-button"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <FontAwesomeIcon icon={faXmark as IconProp} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="#">
            <button className="payment-button" onClick={handleUpdateCart}>Mettre à jour votre panier</button>
          </Link>
          <table id="summary-table" className="summary-table">
            <tbody>
              <tr>
                <td>Livraison</td>
                <td>{deliveryCost === 0 ? 'Gratuite' : ` ${deliveryCost.toFixed(2)} €`}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>{calculateTotalPrice()} €</td>
              </tr>
            </tbody>
          </table>
          <Link
            to="/ValidationCommande"
            state={{
              cartItems: cartItems,
              total: calculateTotalPrice(),
              deliveryAddress: "Votre adresse de livraison"
            }}
          >
            <button id="payment-button" className="payment-button">
              Payer
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Cart;
