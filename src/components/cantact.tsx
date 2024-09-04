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
import Header from '../components/haeder'; // Assurez-vous que ces composants existent
import Footer from '../components/footer';
import AOS from 'aos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'; // Importer les icônes appropriées
import 'aos/dist/aos.css';

const ContactPage: React.FC = () => {
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
      <Header />
      <header>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-2">
              <div className="header-style">
                <Link to="/">
                  <svg xmlns="http://www.w3.org/2000/svg" width="163" height="38" viewBox="0 0 163 38">
                    {/* SVG code */}
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
                  <li className="navbar-dropdown">
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
                  <li className="navbar-dropdown active">
                    <Link to="/contacts">Contacts</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-lg-3">
              <div className="extras bag">
                <a href="javascript:void(0)" id="desktop-menu" className="menu-btn" onClick={toggleMenu}>
                  <FontAwesomeIcon icon={faBagShopping} />
                </a>
                <Link to="/Profile" className="button button-2">Profile</Link>
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
      <section className="hero-section about gap">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6 col-lg-12" data-aos="fade-up" data-aos-delay="200" data-aos-duration="300">
            <div className="about-text">
              <ul className="crumbs d-flex">
                <li><a href="index.html">Home</a></li>
                <li className="two"><a href="index.html"><i className="fa-solid fa-right-long"></i>Contacts</a></li>
              </ul>
              <h2>Contact us</h2>
              <p>Egestas sed tempus urna et pharetra pharetra massa. Fermentum posuere urna nec tincidunt praesent semper.</p>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="address">
                  <i className="fa-solid fa-location-dot"></i>
                  <h5>1717 Harrison St, San Francisco, CA 94103, United States</h5>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="address">
                  <i className="fa-solid fa-envelope"></i>
                  <a href="mailto:quick.info@mail.net"><h6>quick.info@mail.net</h6></a>
                  <span>Lorem ipsum dolor sit.</span>
                  <a href="mailto:quick.info@mail.net"><h6>quick.info@mail.net</h6></a>
                  <span>Dolore magna aliqua</span>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="address">
                  <i className="fa-solid fa-phone"></i>
                  <a href="callto:+14253261627"><h6>+1 425 326 16 27</h6></a>
                  <span>Et netus et malesuada</span>
                  <a href="callto:+14253261627"><h6>+1 425 326 16 27</h6></a>
                  <span>Enim tortor auctor urna</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12" data-aos="fade-up" data-aos-delay="300" data-aos-duration="400">
            <div className="contact-us-img">
              <img alt="contacts-img-girl" src="https://via.placeholder.com/546x447" />
            </div>
          </div>
        </div>
      </div>
    </section>
<section className="gap no-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300" data-aos-duration="400">
            <div className="contact-map-data">
              <div className="join-courier content">
                <h3>Get in touch with us</h3>
                <p>Magna sit amet purus gravida quis blandit turpis cursus. Venenatis tellus in metus vulputate eu scelerisque felis.</p>
                <form className="blog-form">
                  <div className="name-form">
                    <i className="fa-regular fa-user"></i>
                    <input type="text" name="name" placeholder="Enter your name" />
                  </div>
                  <div className="name-form">
                    <i className="fa-regular fa-envelope"></i>
                    <input type="text" name="email" placeholder="Enter your email" />
                  </div>
                  <textarea placeholder="Enter your message"></textarea>
                  <button className="button-price">Submit Application</button>
                </form>
              </div>
              <div className="contact-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2689446.104646556!2d28.705460424349365!3d48.83127549941125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d1d9c154700e8f%3A0x1068488f64010!2sUkraine!5e0!3m2!1sen!2s!4v1661009847728!5m2!1sen!2s"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
<section className="subscribe-section gap" style={{ background: '#fcfcfc' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="flip-up" data-aos-delay="200" data-aos-duration="300">
            <div className="img-subscribe">
              <img alt="Illustration" src="https://via.placeholder.com/546x325" />
            </div>
          </div>
          <div className="col-lg-5 offset-lg-1" data-aos="flip-up" data-aos-delay="300" data-aos-duration="400">
            <div className="get-the-menu">
              <h2>Get the menu of your favorite restaurants every day</h2>
              <form>
                <i className="fa-regular fa-bell"></i>
                <input type="text" name="email" placeholder="Enter email address" />
                <button className="button button-2">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
      <footer>
      <Footer />
      </footer>
    </>
  );
};

export default ContactPage;
