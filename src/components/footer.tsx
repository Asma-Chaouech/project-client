import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/cssf/owl.carousel.min.css';
import '../assets/cssf/owl.theme.default.min.css';
import '../assets/cssf/nice-select.css';
import '../assets/cssf/aos.css';
import '../assets/cssf/style.css';
import '../assets/cssf/responsive.css';
import { Link } from 'react-router-dom';
import '../assets/cssf/color.css';
import '../assets/cssf/footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="gap no-bottom" style={{ backgroundColor: '#363636' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-5 col-md-6 col-sm-12">
            <div className="footer-description">
              <a href="index.html">
              <Link to="/ProductList">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/deliverysitem-4dcc6.appspot.com/o/image%202.png?alt=media&token=36ee4647-68e8-4620-b7ac-b6af3f1fc996"
            alt="Logo"
            width="163"
            height="38"
          />
        </Link>
              </a>
              <h2>Les Meilleurs Restaurants Chez Vous</h2>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="menu">
              <h4>Menu</h4>
              <ul className="footer-menu">
                <li><a href="index.html">Accueil<i className="fa-solid fa-arrow-right"></i></a></li>
                <li><a href="about.html">À propos<i className="fa-solid fa-arrow-right"></i></a></li>
                <li><a href="restaurants.html">Restaurants<i className="fa-solid fa-arrow-right"></i></a></li>
                <li><a href="contacts.html">Contacts<i className="fa-solid fa-arrow-right"></i></a></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="menu contacts">
              <h4>Contacts</h4>
              <div className="footer-location">
                <i className="fa-solid fa-location-dot"></i>
                <p> 9 Rue Louis Osteng 77181, Courtry</p>
              </div>
              <a href="mailto:quickeat@mail.net"><i className="fa-solid fa-envelope"></i>contact@ste-sitem.com</a>
              <a href="callto:+14253261627"><i className="fa-solid fa-phone"></i>+33 1 60 53 37 46</a>
            </div>
            <ul className="social-media" style={{ paddingLeft: "20px", paddingTop: "20px"}} >
              <li><a href="https://www.facebook.com/ste.sitem"><FontAwesomeIcon icon={faFacebookF} style={{width: '20px', height: '28px' , color: '#CFCFCF'}}/></a></li>
              <li><a href="https://www.instagram.com/sitem.paris/"><FontAwesomeIcon icon={faInstagram} style={{width: '20px', height: '28px' , color: '#CFCFCF'}}/></a></li>
              <li><a href="https://www.linkedin.com/company/ste-sitem/posts/?feedView=all"><FontAwesomeIcon icon={faTwitter} style={{width: '20px', height: '28px' , color: '#CFCFCF'}}/></a></li>
            </ul>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;

export {};
