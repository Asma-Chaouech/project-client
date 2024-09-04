import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/cssf/owl.carousel.min.css';
import '../assets/cssf/owl.theme.default.min.css';
import '../assets/cssf/nice-select.css';
import '../assets/cssf/aos.css';
import '../assets/cssf/style.css';
import '../assets/cssf/responsive.css';
import '../assets/cssf/color.css';
import Footer from '../components/footer';
import AOS from 'aos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'; // Importer les icônes appropriées
import 'aos/dist/aos.css';
import './about.css'
import dileveryimg from '../assets/imgf/delivery-w.png';
import backgroungimg from '../assets/imgf/background-1.png'
import illustraion1 from '../assets/imgf/illustration-1.png'
import illustraion2 from '../assets/imgf/illustration-2.png'
import illustraion3 from '../assets/imgf/illustration-3.png'

      const AboutPage: React.FC = () => {
        const [loading, setLoading] = useState(true);
        const [isMenuOpen, setIsMenuOpen] = useState(false);
      
        useEffect(() => {
          AOS.init();
          // Simulate loading time
          const timer = setTimeout(() => setLoading(false), 2000); // Change time as needed
          return () => clearTimeout(timer);
        }, []);
      
        const toggleMenu = () => {
          setIsMenuOpen(prevState => !prevState);
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
      <header>
<div className="container">
  <div className="row align-items-center">
    <div className="col-xl-2">
      <div className="header-style">
        <Link to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="163" height="38" viewBox="0 0 163 38">
            <g id="Logo" transform="translate(-260 -51)">
              <g id="Logo-2" data-name="Logo" transform="translate(260 51)">
                <g id="Elements">
                  <path id="Path_1429" data-name="Path 1429" d="M315.086,140.507H275.222v-.894c0-11.325,8.941-20.538,19.933-20.538s19.931,9.213,19.931,20.538Z" transform="translate(-270.155 -115.396)" fill="#f29f05" />
                  <path id="Path_1430" data-name="Path 1430" d="M301.13,133.517a1.488,1.488,0,0,1-1.394-.994,11.361,11.361,0,0,0-10.583-7.54,1.528,1.528,0,0,1,0-3.055,14.353,14.353,0,0,1,13.37,9.527,1.541,1.541,0,0,1-.875,1.966A1.444,1.444,0,0,1,301.13,133.517Z" transform="translate(-264.176 -113.935)" fill="#fff" />
                  <path id="Path_1431" data-name="Path 1431" d="M297.343,146.544a14.043,14.043,0,0,1-13.837-14.211h2.975a10.865,10.865,0,1,0,21.723,0h2.975A14.043,14.043,0,0,1,297.343,146.544Z" transform="translate(-266.247 -108.544)" fill="#363636" />
                  <path id="Path_1432" data-name="Path 1432" d="M302.183,132.519a7.064,7.064,0,1,1-14.122,0Z" transform="translate(-264.027 -108.446)" fill="#363636" />
                  <path id="Path_1433" data-name="Path 1433" d="M320.332,134.575H273.3a1.528,1.528,0,0,1,0-3.055h47.033a1.528,1.528,0,0,1,0,3.055Z" transform="translate(-271.815 -108.923)" fill="#f29f05" />
                  <path id="Path_1434" data-name="Path 1434" d="M289.154,123.4a1.507,1.507,0,0,1-1.487-1.528v-3.678a1.488,1.488,0,1,1,2.975,0v3.678A1.508,1.508,0,0,1,289.154,123.4Z" transform="translate(-264.154 -116.667)" fill="#f29f05" />
                  <path id="Path_1435" data-name="Path 1435" d="M284.777,138.133H275.3a1.528,1.528,0,0,1,0-3.055h9.474a1.528,1.528,0,0,1,0,3.055Z" transform="translate(-270.84 -107.068)" fill="#363636" />
                  <path id="Path_1436" data-name="Path 1436" d="M284.8,141.691h-6.5a1.528,1.528,0,0,1,0-3.055h6.5a1.528,1.528,0,0,1,0,3.055Z" transform="translate(-269.379 -105.218)" fill="#363636" />
                </g>
              </g>
              <text id="Quickeat" transform="translate(320 77)" fill="#363636" fontSize="20" fontFamily="Poppins" fontWeight="700">
                <tspan x="0" y="0">QUICK</tspan>
                <tspan y="0" fill="#f29f05">EAT</tspan>
              </text>
            </g>
          </svg>
        </Link>
        <div className="extras bag">
          <a href="javascript:void(0)" className="menu-btn" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBagShopping} />
          </a>
          <div className="bar-menu" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-7">
<nav className="navbar">
  <ul className="navbar-links">
  <li className="navbar-dropdown">
      <Link to="/indexpage">Home</Link>
    </li>
   
    <li className="navbar-dropdown active">
      <Link to="/about">About Us</Link>
    </li>
    <li className="navbar-dropdown">
      <a href="#">Restaurants</a>
      <div className="dropdown">
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/restaurant-card">Restaurant Card</Link>
        <Link to="/checkout">Checkout</Link>
      </div>
    </li>
    <li className="navbar-dropdown">
      <a href="#">Pages</a>
      <div className="dropdown">
        <Link to="/blog">Blog</Link>
        <Link to="/single-blog">Single Blog</Link>
        <Link to="/services">Services</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/pricing-table">Pricing Table</Link>
        <Link to="/become-partner">Become A Partner</Link>
        <Link to="/404">404</Link>
      </div>
    </li>
    <li className="navbar-dropdown">
      <Link to="/Contacts">Contacts</Link>
    </li>
   
  </ul>
</nav>
</div>
    <div className="col-lg-3">
      <div className="extras bag">
        <a href="javascript:void(0)" id="desktop-menu" className="menu-btn" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBagShopping} />
        </a>
        <Link to="#" className="button button-2">Order Now</Link>
      </div>
    </div>
    {isMenuOpen && (
      <div className="menu-wrap">
        <div className="menu-inner ps ps--active-x ps--active-y">
          <span className="menu-cls-btn" onClick={toggleMenu}>
            <i className="cls-leftright"></i>
            <i className="cls-rightleft"></i>
          </span>
          <div className="checkout-order">
            <div className="title-checkout">
              <h2>My Orders</h2>
            </div>
            <div className="banner-wilmington">
              <img alt="logo" src="https://via.placeholder.com/50x50" />
              <h6>Kennington Lane Cafe</h6>
            </div>
            <ul>
              <li className="price-list">
                <FontAwesomeIcon icon={faXmark} className="closeButton" />
                <div className="counter-container">
                  <div className="counter-food">
                    <img alt="food" src="https://via.placeholder.com/100x100" />
                    <div className="content-food">
                      <p>Brown Hamburger</p>
                      <h6>Hamburgers</h6>
                    </div>
                  </div>
                  <div className="food-price">
                    <h6 className="text-red">$28.00</h6>
                    <div className="food-count">
                      <button className="counter-btn">-</button>
                      <span className="counter-input">1</span>
                      <button className="counter-btn">+</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div className="checkout">
              <h5>Sub Total</h5>
              <h5 className="text-red">$22.00</h5>
            </div>
            <div className="process-checkout">
              <Link to="/checkout" className="button button-2">Order Now</Link>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
</header>
<section className="hero-section gap" >
		<div className="container">
			<div className="row align-items-center">
				<div className="col-lg-6" data-aos="fade-up"  data-aos-delay="200" data-aos-duration="300">
					<div className="restaurant">
						<h2>Les Meilleurs Restaurnts Chez Vous</h2>
						<p>Commandez vos plats préférés en quelques clics et laissez-nous nous occuper du reste!</p>
						<div className="nice-select-one">
						<a href="#" className="button button-2" style={{paddingTop: "4"}}>Choisir Votre restaurant</a>
						</div>
					</div>
				</div>
				<div className="col-lg-6" data-aos="fade-up"  data-aos-delay="300" data-aos-duration="400">
					<div className="img-restaurant">
						<img alt="man" src={dileveryimg}/>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section className="works-section gap no-top">
		<div className="container">
			<div className="hading" data-aos="fade-up"  data-aos-delay="200" data-aos-duration="300">
				<h2>  Comment ça marche</h2>
				<p>Découvrez la simplicité de Delivio ? Suivez ces étapes simples pour une expérience de commande fluide et agréable :</p>
			</div>
			<div className="row ">
				<div className="col-lg-4 col-md-6 col-sm-12" data-aos="flip-up"  data-aos-delay="200" data-aos-duration="300">
					<div className="work-card">
						<img alt="img" src={illustraion1}/>
						<h4><span>01</span> Explorez nos restaurants</h4>
						<p>Parcourez une vaste sélection de restaurants et découvrez une variété de plats délicieux adaptés à tous les goûts.</p>
					</div>
				</div>
        <br/>
				<div className="col-lg-4 col-md-6 col-sm-12" data-aos="flip-up"  data-aos-delay="300" data-aos-duration="400">
					<div className="work-card">
						<img alt="img" src={illustraion2}/>
						<h4><span>02</span> Choisissez vos plats préférés</h4>
						<p>Personnalisez votre commande en sélectionnant les options qui vous plaisent.assurez-vous que tout est parfait avant de passer à l'étape suivante.</p>
					</div>
				</div>
				<div className="col-lg-4 col-md-6 col-sm-12" data-aos="flip-up"  data-aos-delay="400" data-aos-duration="500">
					<div className="work-card">
						<img alt="img" src={illustraion3}/>
						<h4><span>03</span>Passez votre commande</h4>
						<p>Passez commande facilement en quelques clics grâce à notre interface conviviale. Choisissez votre mode de paiement préféré et confirmez votre commande en toute sécurité.</p>
					</div>
				</div>
			</div>
		</div>
	</section>
    <section className="cards-section gap no-top">
      <div className="container">
        <div className="row">
          {/* Repeat for each card */}
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="200" data-aos-duration="300">
            <div className="card-text-data">
              <img className="on" alt="icon" src="assets/img/service-icon-2.svg" />
              <img className="off" alt="icon" src="assets/img/service-icon-1.svg" />
              <h3>Free Delivery</h3>
              <p>Cras fermentum odio eu feugiat pretium nibh ipsum. Ut faucibus pulvinar elementum integer enim neque volutpat.</p>
            </div>
          </div>
          {/* Add other cards similarly */}
        </div>
      </div>
    </section>
      <section className="cards-section gap no-top">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="200" data-aos-duration="300">
              <div className="card-text-data">
                <img className="on" alt="icon" src="assets/img/service-icon-2.svg" />
                <img className="off" alt="icon" src="assets/img/service-icon-1.svg" />
                <h3>Free Delivery</h3>
                <p>Cras fermentum odio eu feugiat pretium nibh ipsum. Ut faucibus pulvinar elementum integer enim neque volutpat.</p>
              </div>
            </div>
            {/* Ajoutez d'autres cartes de manière similaire */}
          </div>
        </div>
      </section>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default AboutPage;

