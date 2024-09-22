import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUser, faSignInAlt, faKey, faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { getAuth, signOut } from 'firebase/auth';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { FaBell, FaShoppingCart } from 'react-icons/fa';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { io } from 'socket.io-client';
import './header.css';
import '../assets/cssf/responsive.css'

interface HeaderProps {
  calculateTotalQuantity: () => number;
}

const Header: React.FC<HeaderProps> = ({ calculateTotalQuantity }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [userName, setUserName] = useState<string>('Account'); 
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const hideCartOnPages = ['/restaurants' , '/Cart' , '/contact' , '/validationcommande']; 
  const shouldShowCart = !hideCartOnPages.includes(location.pathname); 

  const hidelog = ['/restaurants'  , '/contact']; 
  const shouldShowlog = !hidelog.includes(location.pathname); 

  const hidenot = ['/ValidationCommande']; 
  const shouldshownotif = !hidenot.includes(location.pathname); 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleSidebar = () => setIsSidebarOpen(prevState => !prevState);
  

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userId');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('userName'); 
      localStorage.setItem('cartTotalQuantity', '0');
      localStorage.setItem('isLogout', 'true');
      window.location.reload()
      navigate('/about');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      backgroundColor: '#ff0000',
      color: theme.palette.common.white,
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }));


  useEffect(() => {
    const socket = io('http://localhost:3008');

    socket.on('reviewNotification', () => {
      
    });

    socket.on('reviewreplyCount', count => {
      setNotificationCount(prevCount => prevCount + 1);
      console.log('Nombre de connexions actives:', count);
    });

    return () => {
      socket.off('reviewNotification');
      socket.off('reviewreplyCount');
      socket.disconnect();
    };
  }, []);


    useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setUserName('Account');  // Fallback if no userName is found in localStorage
    }
    setLoading(false);  // Stop loading after checking localStorage
  }, []);

  const handleNotificationClick = async () => {
    navigate('/mynotif');
    try {
      const notificationsRef = collection(db, 'notif');
      const q = query(notificationsRef, where('isViewed', '==', false), where('type', '==', 'replyreview'));
      const querySnapshot = await getDocs(q);

      const updatePromises = querySnapshot.docs.map(documentSnapshot => {
        const docRef = doc(db, 'notif', documentSnapshot.id);
        return updateDoc(docRef, { isViewed: true });
      });
      await Promise.all(updatePromises);

      setNotificationCount(0);
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  return (
    <header>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-2">
            <div className="header-style">
              <Link to="/about">
                <img
                  className='logo-img'
                  src="https://firebasestorage.googleapis.com/v0/b/deliverysitem-4dcc6.appspot.com/o/image%202.png?alt=media&token=36ee4647-68e8-4620-b7ac-b6af3f1fc996"
                  alt="Logo"
                  width="163"
                  height="38"
                />
              </Link>
            </div>
          </div>
          <div className="col-lg-5 ">
            <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
              <Link to="/about" className="d-none d-lg-inline">Accueil</Link>
              <Link to="/restaurants">Restaurants</Link>
              <Link to="/contact" className="d-none d-lg-inline">Contact</Link>
            </nav>
          </div>
          <div className="col-lg-5">
            <div className="header-extras">
            {userName === 'Account' ? (
                <div className="profile-dropdown" style={{position: "absolute"}}>
                  {shouldShowlog && (
                  <div style={{marginRight:"90px" , display: "flex"}}>
                      <a href="/login" className="profile-link">
                        <FontAwesomeIcon icon={faLock as IconProp} />
                        <span className="d-none d-lg-inline">Se connecter</span>
                      </a>
                      <a href="/signup" className="profile-link">
                        <FontAwesomeIcon icon={faUserPlus as IconProp} />
                        <span className="d-none d-lg-inline">S'inscrire</span>
                      </a>
                  </div>
                  )}
                  {shouldShowCart && (
              <Link to="/Cart" style={{position:"absolute" , right:"0px" , top:"0px"}}>
              <button className="order-button">
              <StyledBadge badgeContent={calculateTotalQuantity()} color="secondary">
                  <FaShoppingCart size={24} />
                </StyledBadge>
              </button>
            </Link>
            )}
                </div>
              ) : (
                <>
              <div className="profile-dropdown" onClick={toggleProfileDropdown}>
                <div className="profile-link">
                  <FontAwesomeIcon icon={faUser as IconProp} />
                  <span className="d-none d-lg-inline">{userName}</span>
                </div>
                {isProfileDropdownOpen && (
                  <div className="dropdown-menu" style={{ display: "block", width: "-webkit-fill-available" }}>
                    <Link to="/profile">Profil</Link>
                    <Link to="/history">Historique</Link>
                    <a href="#" onClick={handleLogout}>Déconnexion</a>
                  </div>
                )}
              </div>
              {shouldShowCart && (
              <Link to="/Cart">
              <button className="order-button">
              <StyledBadge badgeContent={calculateTotalQuantity()} color="secondary">
                  <FaShoppingCart size={24} />
                </StyledBadge>
              </button>
            </Link>
            )}
             {shouldshownotif && (
              <Link to="/mynotif">
                <button className="order-button">
                  <StyledBadge badgeContent={notificationCount} color="secondary">
                    <FaBell size={24} onClick={handleNotificationClick} />
                  </StyledBadge>
                </button>
              </Link>
             )}
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
