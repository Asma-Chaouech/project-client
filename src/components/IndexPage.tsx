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
import restaurantImage from '../assets/imgf/photo-1.png'; 
import Footer from '../components/footer';
import AOS from 'aos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'; // Importer les icônes appropriées
import 'aos/dist/aos.css';

      const IndexPage: React.FC = () => {
        const [loading, setLoading] = useState(true);
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        

        const toggleMenu = () => {
          setIsMenuOpen(!isMenuOpen);
        };
      
        useEffect(() => {
          AOS.init();
          // Simulate loading time
          const timer = setTimeout(() => setLoading(false), 2000); // Change time as needed
          return () => clearTimeout(timer);
        }, []);
      
        
      
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
                <li className="navbar-dropdown active">
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
                <li className="navbar-dropdown">
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
              <Link to="/profile" className="button button-2" onClick={toggleMenu}>PROFILE</Link>
            </div>
          </div>
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
                  <FontAwesomeIcon icon={faXmark} className="closeButton" onClick={toggleMenu} />
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
    </header>


      <section
      className="hero-section gap"
      style={{ backgroundImage: 'url(assets/img/background-1.png)' }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-lg-6"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="300"
          >
            <div className="restaurant">
              <h1>The Best restaurants in your home</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
              <div className="nice-select-one">
                <select className="nice-select Advice">
                  <option>Choose a Restaurant</option>
                  <option>Choose a Restaurant 1</option>
                  <option>Choose a Restaurant 2</option>
                  <option>Choose a Restaurant 3</option>
                  <option>Choose a Restaurant 4</option>
                </select>
                <a href="#" className="button button-2">
                  Order Now
                </a>
              </div>
            </div>
          </div>
          <div
            className="col-lg-6"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="400"
          >
             <div className="img-restaurant">
      {/* Image principale */}
      <img alt="man" src={restaurantImage} />

      {/* Contenu du restaurant */}
      <div className="wilmington">
        {/* Image du restaurant */}
        <img alt="img" src="https://via.placeholder.com/90x90" />

        {/* Détails du restaurant */}
        <div>
          <p>Restaurant of the Month</p>
          <h6>The Wilmington</h6>
          <div>
            {/* Étoiles */}
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-regular fa-star-half-stroke"></i>
          </div>
        </div>
      </div>
              <div className="wilmington location-restaurant">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h6>12 Restaurant</h6>
                  <p>In Your city</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="works-section gap no-top">
      <div className="container">
        <div className="heading" data-aos="fade-up" data-aos-delay="200" data-aos-duration="300">
          <h2>How it works</h2>
          <p>
            Magna sit amet purus gravida quis blandit turpis cursus. Venenatis tellus in
            <br />
            metus vulputate eu scelerisque felis.
          </p>
        </div>
        <div className="row">
          <div
            className="col-lg-4 col-md-6 col-sm-12"
            data-aos="flip-up"
            data-aos-delay="200"
            data-aos-duration="300"
          >
            <div className="work-card">
              <img alt="img" src="https://via.placeholder.com/300x154" />
              <h4>
                <span>01</span> Select Restaurant
              </h4>
              <p>
                Non enim praesent elementum facilisis leo vel fringilla. Lectus proin nibh nisl
                condimentum id. Quis varius quam quisque id diam vel.
              </p>
            </div>
          </div>
          <div
            className="col-lg-4 col-md-6 col-sm-12"
            data-aos="flip-up"
            data-aos-delay="300"
            data-aos-duration="400"
          >
            <div className="work-card">
              <img alt="img" src="https://via.placeholder.com/300x154" />
              <h4>
                <span>02</span> Select menu
              </h4>
              <p>
                Eu mi bibendum neque egestas congue quisque. Nulla facilisi morbi tempus iaculis
                urna id volutpat lacus. Odio ut sem nulla pharetra diam sit amet.
              </p>
            </div>
          </div>
          <div
            className="col-lg-4 col-md-6 col-sm-12"
            data-aos="flip-up"
            data-aos-delay="400"
            data-aos-duration="500"
          >
            <div className="work-card">
              <img alt="img" src="https://via.placeholder.com/300x154" />
              <h4>
                <span>03</span> Wait for delivery
              </h4>
              <p>
                Nunc lobortis mattis aliquam faucibus. Nibh ipsum consequat nisl vel pretium lectus
                quam id leo. A scelerisque purus semper eget. Tincidunt arcu non.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="best-restaurants gap" style={{ background: '#fcfcfc' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="flip-up" data-aos-delay="200" data-aos-duration="300">
            <div className="city-restaurants">
              <h2>12 Best Restaurants in Your City</h2>
              <p>
                Magna sit amet purus gravida quis blandit turpis cursus. Venenatis tellus in metus
                vulputate.
              </p>
            </div>
          </div>
          <div className="col-lg-6" data-aos="flip-up" data-aos-delay="300" data-aos-duration="400">
            <div className="logos-card">
              <img alt="logo" src="https://via.placeholder.com/100x100" />
              <div className="cafa">
                <h4>
                  <a href="restaurant-card.html">Kennington Lane Cafe</a>
                </h4>
                <div>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-regular fa-star"></i>
                </div>
                <div className="cafa-button">
                  <a href="#">american</a>
                  <a href="#">steakhouse</a>
                  <a className="end" href="#">
                    seafood
                  </a>
                </div>
                <p>
                  Non enim praesent elementum facilisis leo vel fringilla. Lectus proin nibh nisl
                  condimentum id. Quis varius quam quisque id diam vel.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6" data-aos="flip-up" data-aos-delay="400" data-aos-duration="500">
            <div className="logos-card two">
              <img alt="logo" src="https://via.placeholder.com/100x100" />
              <div className="cafa">
                <h4>
                  <a href="restaurant-card.html">The Wilmington</a>
                </h4>
                <div>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="cafa-button">
                  <a href="#">american</a>
                  <a href="#">steakhouse</a>
                  <a className="end" href="#">
                    seafood
                  </a>
                </div>
                <p>
                  Vulputate enim nulla aliquet porttitor lacus luctus. Suscipit adipiscing bibendum
                  est ultricies integer. Sed adipiscing diam donec adipiscing tristique.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6" data-aos="flip-up" data-aos-delay="500" data-aos-duration="600">
            <div className="logos-card three">
              <img alt="logo" src="https://via.placeholder.com/100x100" />
              <div className="cafa">
                <h4>
                  <a href="restaurant-card.html">Kings Arms</a>
                </h4>
                <div>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-regular fa-star-half-stroke"></i>
                </div>
                <div className="cafa-button">
                  <a href="#">healthy</a>
                  <a href="#">steakhouse</a>
                  <a className="end" href="#">
                    vegetarian
                  </a>
                </div>
                <p>
                  Tortor at risus viverra adipiscing at in tellus. Cras semper auctor neque vitae
                  tempus. Dui accumsan sit amet nulla facilisi. Sed adipiscing diam donec adipiscing
                  tristique.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="button-gap">
          <a href="restaurants.html" className="button button-2 non">
            See All<i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
    <section className="your-favorite-food gap" style={{ backgroundImage: 'url(assets/img/background-1.png)' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5" data-aos="fade-up" data-aos-delay="200" data-aos-duration="300">
            <div className="food-photo-section">
              <img alt="img" src="https://via.placeholder.com/676x700" />
              <a href="#" className="one"><i className="fa-solid fa-burger"></i>Burgers</a>
              <a href="#" className="two"><i className="fa-solid fa-cheese"></i>Steaks</a>
              <a href="#" className="three"><i className="fa-solid fa-pizza-slice"></i>Pizza</a>
            </div>
          </div>
          <div className="col-lg-6 offset-lg-1" data-aos="fade-up" data-aos-delay="300" data-aos-duration="400">
            <div className="food-content-section">
              <h2>Food from your favorite restaurants to your table</h2>
              <p>Pretium lectus quam id leo in vitae turpis massa sed. Lorem donec massa sapien faucibus et molestie. Vitae elementum curabitur vitae nunc.</p>
              <a href="#" className="button button-2">Order Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="reviews-sections gap">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6 col-lg-12" data-aos="fade-up" data-aos-delay="200" data-aos-duration="300">
            <div className="reviews-content">
              <h2>What customers say about us</h2>
              <div className="custome owl-carousel owl-theme">
                <div className="item">
                  <h4>"Dapibus ultrices in iaculis nunc sed augue lacus viverra vitae. Mauris a diam maecenas sed enim. Egestas diam in arcu cursus euismod quis. Quam quisque id diam vel".</h4>
                  <div className="thomas">
                    <img alt="girl" src="https://via.placeholder.com/70x70" />
                    <div>
                      <h6>Thomas Adamson</h6>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <h4>"Dapibus ultrices in iaculis nunc sed augue lacus viverra vitae. Mauris a diam maecenas sed enim. Egestas diam in arcu cursus euismod quis. Quam quisque id diam vel".</h4>
                  <div className="thomas">
                    <img alt="girl" src="https://via.placeholder.com/70x70" />
                    <div>
                      <h6>Thomas Adamson</h6>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <h4>"Dapibus ultrices in iaculis nunc sed augue lacus viverra vitae. Mauris a diam maecenas sed enim. Egestas diam in arcu cursus euismod quis. Quam quisque id diam vel".</h4>
                  <div className="thomas">
                    <img alt="girl" src="https://via.placeholder.com/70x70" />
                    <div>
                      <h6>Thomas Adamson</h6>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-12" data-aos="fade-up" data-aos-delay="300" data-aos-duration="400">
            <div className="reviews-img">
              <img alt="photo" src="https://via.placeholder.com/676x585" />
              <i className="fa-regular fa-thumbs-up"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="join-partnership gap" style={{ backgroundColor: '#363636' }}>
      <div className="container">
        <h2>Want to Join Partnership?</h2>
        <div className="row">
          <div className="col-lg-6" data-aos="flip-up" data-aos-delay="200" data-aos-duration="300">
            <div className="join-img">
              <img alt="img" src="https://via.placeholder.com/626x393" />
              <div className="Join-courier">
                <h3>Join Courier</h3>
                <a href="become-partner.html" className="button button-2">Learn More <i className="fa-solid fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
          <div className="col-lg-6" data-aos="flip-up" data-aos-delay="300" data-aos-duration="400">
            <div className="join-img">
              <img alt="img" src="https://via.placeholder.com/626x393" />
              <div className="Join-courier">
                <h3>Join Merchant</h3>
                <a href="become-partner.html" className="button button-2">Learn More <i className="fa-solid fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="news-section gap">
            <div className="container">
                <h2>Latest news and events</h2>
                <div className="row">
                    <div className="col-xl-6 col-lg-12" data-aos="flip-up" data-aos-delay="200" data-aos-duration="300">
                        <div className="news-posts-one">
                            <img alt="man" src="https://via.placeholder.com/626x269" />
                            <div className="quickeat">
                                <a href="#">news</a>
                                <a href="#">quickeat</a>
                            </div>
                            <h3>We Have Received An Award For The Quality Of Our Work</h3>
                            <p>Donec adipiscing tristique risus nec feugiat in fermentum. Sapien eget mi proin sed libero. Et magnis dis parturient montes nascetur. Praesent semper feugiat nibh sed pulvinar proin gravida.</p>
                            <a href="#">Read More<i className="fa-solid fa-arrow-right"></i></a>
                            <ul className="data">
                                <li><h6><i className="fa-solid fa-user"></i>by Quickeat</h6></li>
                                <li><h6><i className="fa-regular fa-calendar-days"></i>01.Jan. 2022</h6></li>
                                <li><h6><i className="fa-solid fa-eye"></i>132</h6></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-12" data-aos="flip-up" data-aos-delay="300" data-aos-duration="400">
                        <div className="news-post-two">
                            <img alt="food-img" src="https://via.placeholder.com/200x200" />
                            <div className="news-post-two-data">
                                <div className="quickeat">
                                    <a href="#">restaurants</a>
                                    <a href="#">cooking</a>
                                </div>
                                <h6><a href="single-blog.html">With Quickeat you can order food for the whole day</a></h6>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...</p>
                                <ul className="data">
                                    <li><h6><i className="fa-solid fa-user"></i>by Quickeat</h6></li>
                                    <li><h6><i className="fa-regular fa-calendar-days"></i>01.Jan. 2022</h6></li>
                                    <li><h6><i className="fa-solid fa-eye"></i>132</h6></li>
                                </ul>
                            </div>
                        </div>
                        <div className="news-post-two">
                            <img alt="food-img" src="https://via.placeholder.com/200x200" />
                            <div className="news-post-two-data">
                                <div className="quickeat">
                                    <a href="#">restaurants</a>
                                    <a href="#">cooking</a>
                                </div>
                                <h6><a href="single-blog.html">127+ Couriers On Our Team!</a></h6>
                                <p>Urna condimentum mattis pellentesque id nibh tortor id aliquet. Tellus at urna condimentum mattis...</p>
                                <ul className="data">
                                    <li><h6><i className="fa-solid fa-user"></i>by Quickeat</h6></li>
                                    <li><h6><i className="fa-regular fa-calendar-days"></i>01.Jan. 2022</h6></li>
                                    <li><h6><i className="fa-solid fa-eye"></i>132</h6></li>
                                </ul>
                            </div>
                        </div>
                        <div className="news-post-two end">
                            <img alt="food-img" src="https://via.placeholder.com/200x200" />
                            <div className="news-post-two-data">
                                <div className="quickeat">
                                    <a href="#">restaurants</a>
                                    <a href="#">cooking</a>
                                </div>
                                <h6><a href="single-blog.html">Why You Should Optimize Your Menu for Delivery</a></h6>
                                <p>Enim lobortis scelerisque fermentum dui. Sit amet cursus sit amet dictum sit amet. Rutrum tellus...</p>
                                <ul className="data">
                                    <li><h6><i className="fa-solid fa-user"></i>by Quickeat</h6></li>
                                    <li><h6><i className="fa-regular fa-calendar-days"></i>01.Jan. 2022</h6></li>
                                    <li><h6><i className="fa-solid fa-eye"></i>132</h6></li>
                                </ul>
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
              <img alt="Illustration" src="https://via.placeholder.com/676x403" />
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

export default IndexPage;
