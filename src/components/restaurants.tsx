import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/cssf/owl.carousel.min.css';
import '../assets/cssf/owl.theme.default.min.css';
import '../assets/cssf/nice-select.css';
import '../assets/cssf/aos.css';
import '../assets/cssf/style.css';
import '../assets/cssf/responsive.css';
import '../assets/cssf/color.css';
import burgerimg from '../assets/images/burger.png';
import Footer from '../components/footer';
import AOS from 'aos';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './restaurant.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import 'aos/dist/aos.css';
import ReactAutocomplete from 'react-autocomplete';
import { useNavigate } from 'react-router-dom';
//import Headerprofile from './haederprofil';
import Headerprofile from './haeder';

const Restaurant: React.FC = () => {
  interface Restaurant {
    id: string;
    name: string;
    address: string;
    closingTime: string;
    logoPath: string;
    openTime: string;
    phoneNumber: string;
    description: string;
    tag: string;
  }

  const [restaurant, setRestaurant] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantCollection = collection(db, 'shopData');
        const restaurantSnapshot = await getDocs(restaurantCollection);
        const restaurantList: Restaurant[] = restaurantSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Restaurant[];
        setRestaurant(restaurantList);
        setFilteredRestaurants(restaurantList);
      } catch (error) {
        setError('Échec de la récupération des restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);



  useEffect(() => {
    if (selectedValue === '') {
      setFilteredRestaurants(restaurant);
    } else {
      const searchLower = selectedValue.toLowerCase();
      const isTagSearch = tags.some(tag => tag.toLowerCase().includes(searchLower));
      setFilteredRestaurants(restaurant.filter(r =>
        isTagSearch
          ? r.tag.toLowerCase().includes(searchLower)
          : r.name.toLowerCase().includes(searchLower)
      ));
    }
  }, [selectedValue, restaurant]);

  const handleViewProduct = (RestaurantId: string) => {
    navigate(`/productlist/${RestaurantId}`);
  };

  const tags = Array.from(new Set(restaurant.map(r => r.tag))).sort();
  const names = Array.from(new Set(restaurant.map(r => r.name))).sort();

  return (
    <>
      <div className='my-page'>
        {loading && (
          <div className="page-loader">
            <div className="wrapper">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
              <span>Chargement</span>
            </div>
          </div>
        )}
        
        <section className="hero-section about gap my-about" >
          <div className="container">
            <Headerprofile />
            <div className="row align-items-center">
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200" data-aos-duration="200">
                <div className="about-text">
                  <ul className="crumbs d-flex" style={{marginLeft: "75px", fontSize: "12px"}}>
                    <li><a href="/indexpage">Home</a></li>
                    <FontAwesomeIcon icon={faArrowRight} style={{color: "#e88b53"}}/>
                    <li className="two"><a href="index.html">Restaurants</a></li>
                  </ul>
                  <h2>Restaurants</h2>
                  <p className='my-text'>Profitez de repas délicieux livrés directement chez vous, préparés avec amour et fraîcheur pour une expérience culinaire exceptionnelle à chaque commande.</p>
                  <div className="restaurant">
                    <div
                      className={`nice-select Advice my-search`}
                    >
                      <ReactAutocomplete
                        items={tags.map(tag => ({ label: tag })).concat(names.map(name => ({ label: name })))}
                        shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                        getItemValue={item => item.label}
                        renderItem={(item, isHighlighted) =>
                          <div key={item.label} className={`option ${isHighlighted ? 'focus' : ''}`}>
                            {item.label}
                          </div>
                        }
                        value={selectedValue}
                        onChange={e => setSelectedValue(e.target.value)}
                        onSelect={value => setSelectedValue(value)}
                        inputProps={{ className: 'current', style: { border: 'none', outline: 'none', boxShadow: 'none', width: '466px', paddingLeft: '15px', fontSize: '20px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#000' } }}
                        menuStyle={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 2,
                          borderRadius: '3px',
                          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          padding: '2px 0',
                          maxHeight: '200px',
                          overflow: 'auto',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300" data-aos-duration="400">
                <div className="food-photo-section">
                  <img className="my-img" alt="man" src={burgerimg} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="best-restaurants gap my-gap">
          <div className="container">
            <div className="row justify-content-center">
              {filteredRestaurants.map((restaurant, index) => {
                const isLastItem = index === filteredRestaurants.length - 1;
                const isOddCount = filteredRestaurants.length % 2 !== 0;

                return (
                  <div
                    key={index}
                    className={`col-lg-6 my-space ${isOddCount && isLastItem ? 'center-last' : ''}`}
                    data-aos="flip-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    <div className="logos-card restaurant-page my-frame">
                      <div className='col-lg-4'>
                        <img
                          alt="restaurnImage"
                          src={restaurant.logoPath}
                          style={{ width: '125px', height: '125px', objectFit: 'cover' }}
                        />
                        <div className="icon-container my-text myaddress-container">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className='my-icon' /><strong>{restaurant.address}</strong>
                        </div>
                        <div className="icon-container my-text">
                          <FontAwesomeIcon icon={faPhone} className='my-icon' /> <strong>+33 {restaurant.phoneNumber}</strong>
                        </div>
                        <div className="icon-container my-text">
                          <FontAwesomeIcon icon={faClock} className='my-icon' /><strong>{restaurant.openTime} ---  {restaurant.closingTime}</strong>
                        </div>
                      </div>
                      <div className='col-lg-8'>
                        <div className="cafa my-text">
                          <h4><a className="my-a" onClick={() => handleViewProduct(restaurant.id)}>{restaurant.name} </a></h4>
                          <div className="cafa-button">
                            <strong><a className="end my-a" href="#">{restaurant.tag}</a></strong>
                          </div>
                          <p className='my-text mydescription-container'>{restaurant.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  );
};

export default Restaurant;
