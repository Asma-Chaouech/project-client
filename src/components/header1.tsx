import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUser } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { getAuth, signOut } from 'firebase/auth';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { FaShoppingCart } from 'react-icons/fa';

interface HeaderProps {
  userName: string;
  calculateTotalQuantity: () => number;
}

const Header: React.FC<HeaderProps> = ({ userName, calculateTotalQuantity }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userId');
      navigate('/login');
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

  return (
    <header>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-2">
            <div className="header-style">
              <Link to="/ProductList">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/deliverysitem-4dcc6.appspot.com/o/image%202.png?alt=media&token=36ee4647-68e8-4620-b7ac-b6af3f1fc996"
                  alt="Logo"
                  width="163"
                  height="38"
                />
              </Link>
              <div className="extras">
                <button className="openbtn" onClick={toggleMenu}>☰</button>
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
              <Link to="/ProductList">Accueil</Link>
              <Link to="/restaurants">Restaurants</Link>
            </nav>
          </div>
          <div className="col-lg-3">
            <div className="header-extras">
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
              <Link to="/Cart">
                <button className="order-button">
                  <StyledBadge badgeContent={calculateTotalQuantity()} color="secondary">
                    <FaShoppingCart size={24} />
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

export default Header;
