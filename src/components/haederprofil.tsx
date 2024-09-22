import React, { useState, useEffect } from 'react';
import '../assets/cssf/headerprofile.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUser } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FaBell, FaShoppingCart } from 'react-icons/fa';
import { getAuth, signOut, User } from 'firebase/auth'; // Import Firebase Auth
import { getFirestore, collection, query, where, getDocs, updateDoc, doc  } from 'firebase/firestore'; // Import Firestore
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { io, Socket } from 'socket.io-client';

interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  productImage: string;
}

interface Notification {
  id: string;
  clientName: string;
  productName: string;
  isViewed: boolean;
  timestamp: string;
  type: string;
}

const Headerprofile: React.FC = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>('Account');
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors
  const auth = getAuth(); 
  const db = getFirestore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unviewedCount, setUnviewedCount] = useState<number>(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign the user out
      localStorage.removeItem('userId'); // Clear the user ID from local storage
      localStorage.removeItem('cartItems'); // Clear the cart items from local storage
      localStorage.removeItem('userName'); // Clear the cart items from local storage
      setCartItems([]); // Clear the cart items in the state
      navigate('/about'); // Redirect to the LandingPage after logout
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
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
  const calculateTotalQuantity = () => {
    return cartItems.reduce((totalQuantity, item) => totalQuantity + item.quantity,0);
  };

  useEffect(() => {
    const socket = io('http://localhost:3008');

    // Listen for new review notifications
    socket.on('reviewNotification', () => {
        setNotificationCount(prevCount => prevCount + 1); // Increment count
    });

    // Listen for the number of active connections
    socket.on('reviewreplyCount', (count) => {
        console.log('Nombre de connexions actives:', count);
    });

    return () => {
        socket.off('reviewNotification');
        socket.off('reviewreplyCount');
        socket.disconnect();
    };
}, []);

// Handle notification click to mark them as viewed
const handleNotificationClick = async () => {
    navigate('/Notif');
    try {
        const notificationsRef = collection(db, 'notif');
        const q = query(notificationsRef, where('isViewed', '==', false) , where("type", '==', "replyreview"));
        const querySnapshot = await getDocs(q);

        // Update all notifications to marked as viewed
        const updatePromises = querySnapshot.docs.map(documentSnapshot => {
            const docRef = doc(db, 'notif', documentSnapshot.id);
            return updateDoc(docRef, { isViewed: true });
        });
        await Promise.all(updatePromises);

        // Reset the notification count to zero after updating
        setNotificationCount(0);
    } catch (error) {
        console.error('Error updating notifications:', error);
    }
};

  return (
    <header>
    <div className="container">
      <div className="row align-items-center">
        <div className="col-xl-2">
        
          <div className="header-style">
            <Link to="/about">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/deliverysitem-4dcc6.appspot.com/o/image%202.png?alt=media&token=36ee4647-68e8-4620-b7ac-b6af3f1fc996"
                alt="Logo"
                width="163"
                height="38"
              />
            </Link>
            <div className="extras">
              <button className="openbtn" onClick={toggleSidebar}>☰</button>
            </div>
            <div className="extras">
              <div className={`bar-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <FontAwesomeIcon icon={isMenuOpen ? (faXmark as IconProp) : (faBars as IconProp)} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/about">Accueil</Link>
            <Link to="/restaurants">Restaurants</Link>
            
          </nav>
        </div>
        <div className="col-lg-3">
          <div className="header-extras">
            <div className="profile-dropdown" onClick={toggleProfileDropdown}>
              <div className="profile-link">
                <FontAwesomeIcon icon={faUser as IconProp} />
                <span className="d-none d-lg-inline">{userName}</span> {/* Display user's name */}
              </div>
              {isProfileDropdownOpen && (
             <div className="dropdown-menu" style={{display: "block", width: "-webkit-fill-available"}}>
             <Link to="/profile">Profil</Link>
             <Link to="/history">Historique</Link> {/* Ajoutez le lien Historique */}
             <a href="#" onClick={handleLogout}>Déconnexion</a>
           </div>
              )}
            </div>
            <Link to="/Cart">
              <button className="order-button">
              <StyledBadge badgeContent={calculateTotalQuantity()} color="secondary">
                  <FaShoppingCart size={24} />
                </StyledBadge>
              </button>
            </Link>
            <Link to="/Notif">
              <button className="order-button">
              <StyledBadge badgeContent={notificationCount} color="secondary">
                  <FaBell size={24} onClick={handleNotificationClick}/>
                </StyledBadge>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </header>
  );
};

export default Headerprofile;
