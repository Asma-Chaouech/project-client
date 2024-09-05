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
import { collection, getDocs } from 'firebase/firestore';
import dileveryimg from '../assets/imgf/delivery-w.png';
import Headerprofile from './haeder';
import illustraion1 from '../assets/imgf/illustration-1.png'
import illustraion2 from '../assets/imgf/illustration-2.png'
import illustraion3 from '../assets/imgf/illustration-3.png'
import serviceicon1 from '../assets/imgf/service-icon-1.svg'
import serviceicon2 from '../assets/imgf/service-icon-2.svg'
import serviceicon3 from '../assets/imgf/service-icon-3.svg'
import serviceicon4 from '../assets/imgf/service-icon-4.svg'
import serviceicon5 from '../assets/imgf/service-icon-5.svg'
import serviceicon6 from '../assets/imgf/service-icon-6.svg'
import serviceicon7 from '../assets/imgf/service-icon-7.svg'
import serviceicon8 from '../assets/imgf/service-icon-8.svg'
import elements from '../assets/imgf/elements-1.jpg'
import { db } from '../firebaseConfig';

interface Command {
  deliveryAddress: string;
  deliveryCost: number;
  deliveryManId: string;
  discount: number;
  finalTotal: number;
  id: string;
  items: any[];
  paymentMethod: string;
  status: string;
  tip: number;
}

interface Restaurant {
  name: string;
  address: string;
  available: boolean;
}
interface Client{
  name: string;
}

    const AboutPage: React.FC = () => {
        const [loading, setLoading] = useState(true);
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [commandData, setCommandData] = useState<Command[]>([]);
        const [restaurantData, setRestaurantData] = useState<Restaurant[]>([]);
        const [commandCount, setCommandCount] = useState<number>(0);
        const [restaurantCount, setRestaurantCount] = useState<number>(0);
        const [clientData, setClientData] = useState<Client[]>([]);
        const [clientCount, setClientCount] = useState<number>(0);
      
        useEffect(() => {
          AOS.init();
          // Simulate loading time
          const timer = setTimeout(() => setLoading(false), 2000); // Change time as needed
          return () => clearTimeout(timer);
        }, []);




  useEffect(() => {
    const fetchCommands = async () => {
      const commandCollection = collection(db, 'command');
      const commandSnapshot = await getDocs(commandCollection);
      const commandList = commandSnapshot.docs.map(doc => doc.data() as Command);
      setCommandData(commandList);
      setCommandCount(commandList.length); // Compte des commandes
    };

    const fetchRestaurants = async () => {
      const restaurantCollection = collection(db, 'shopData');
      const restaurantSnapshot = await getDocs(restaurantCollection);
      const restaurantList = restaurantSnapshot.docs.map(doc => doc.data() as Restaurant);
      setRestaurantData(restaurantList);
      setRestaurantCount(restaurantList.length); // Compte des restaurants
    };

    const fetchClients = async () => {
      const clientCollection = collection(db, 'clients');
      const clientSnapshot = await getDocs(clientCollection);
      const clientList = clientSnapshot.docs.map(doc => doc.data() as Client);
      setClientData(clientList);
      setClientCount(clientList.length); // Compte des commandes
    };

    fetchCommands();
    fetchRestaurants();
    fetchClients();
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
            <Headerprofile/>
<section className="hero-section gap">
		<div className="container">
			<div className="row align-items-center">
				<div className="col-lg-6" data-aos="fade-up"  data-aos-delay="200" data-aos-duration="300">
					<div className="restaurant">
						<h2>Les Meilleurs Restaurnts Chez Vous</h2>
						<p>Commandez vos plats préférés en quelques clics et laissez-nous nous occuper du reste!</p>
						<div className="nice-select-one">
						<a href="/restaurants" className="my-button my-button-2" style={{paddingTop: "4"}}>Choisir Votre restaurant</a>
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
	<section className="works-section gap no-top" style={{paddingBottom:"50px"}}>
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
						<h4><span>03</span> Passez votre commande</h4>
						<p>Passez commande facilement en quelques clics grâce à notre interface conviviale. Choisissez votre mode de paiement préféré et confirmez votre commande en toute sécurité.</p>
					</div>
				</div>
			</div>
		</div>
	</section>
  <section className="about-counters-section gap" >
		<div className="container">
			<div className="row align-items-center">
      <div className="col-lg-12 col-md-6 col-sm-6">
						<div className="counter-hading">
							<p className='my-about-text'>Le service fait preuve de bon goût</p>
						</div>
					</div>
				<div className="col-lg-6 col-md-12 col-sm-12" data-aos="flip-up"  data-aos-delay="200" data-aos-duration="300">
					<div className="about-counters-img">
						<img alt="girl" src={elements} style={{borderRadius:"5px"}} />
					</div>
				</div>
				<div className="col-lg-6 col-md-12 col-sm-12" data-aos="flip-up"  data-aos-delay="300" data-aos-duration="400">
					<div className="row">
					<div className="col-lg-6 col-md-6 col-sm-6">
						<div className="count-time" style={{border:"2px solid #FF965A" , marginBottom:"30px" , alignItems:"center"}}>
								<h2 className="timer count-title count-number" data-to="976" data-speed="2000">{clientCount}</h2>
									<p>Client<br/>
									Satisfait</p>
						</div>
				</div>
				<div className="col-lg-6 col-md-6 col-sm-6" data-aos="flip-up"  data-aos-delay="300" data-aos-duration="400">
						<div className="count-time" style={{border:"2px solid #FF965A" , alignItems:"center"}}>
								<h2 className="timer count-title count-number" data-to="12" data-speed="2000">{restaurantCount}</h2>
									<p>Meilleurs<br/>
											Restaurants</p>
						</div>
				</div>
				<div className="col-lg-6 col-md-6 col-sm-6">
						<div className="count-time sp" style={{border:"2px solid #FF965A" , alignItems:"center"}}>
								<h2 className="timer count-title count-number" data-to="1" data-speed="2000">{commandCount}</h2>
								<span></span>
									<p>Repas<br/>
											Deliverée</p>
						</div>
				</div>
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
              <img className="on" alt="icon" src={serviceicon2} />
              <img className="off" alt="icon" src={serviceicon1} />
              <h3>Satisfaction Garantie</h3>
              <p>Un service irréprochable, de la commande à la livraison , Profitrez.</p>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="200" data-aos-duration="300">
            <div className="card-text-data">
              <img className="on" alt="icon" src={serviceicon3} />
              <img className="off" alt="icon" src={serviceicon4} />
              <h3>À Table en un Clin d’Œil</h3>
              <p>Votre repas livré en un temps record, toujours chaud et prêt à déguster</p>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="200" data-aos-duration="300">
            <div className="card-text-data">
              <img className="on" alt="icon" src={serviceicon7} />
              <img className="off" alt="icon" src={serviceicon8} />
              <h3>Le Goût de l’Excellence</h3>
              <p>Un Voyage Culinaire à Domicile, avec des plats savoureux et authentiques.</p>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="200" data-aos-duration="300">
            <div className="card-text-data">
              <img className="on" alt="icon" src={serviceicon5} />
              <img className="off" alt="icon" src={serviceicon6} />
              <h3>Savourez Sans Compter</h3>
              <p>Savourez une cuisine délicieuse sans vous ruiner grâce à nos offres pour tous les budgets.</p>
            </div>
          </div>
          {/* Add other cards similarly */}
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

