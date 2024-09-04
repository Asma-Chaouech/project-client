import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/cssf/landingpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/cssf/owl.carousel.min.css';
import '../assets/cssf/owl.theme.default.min.css';
import '../assets/cssf/nice-select.css';
import '../assets/cssf/aos.css';
import '../assets/cssf/style.css';
import '../assets/cssf/responsive.css';
import '../assets/cssf/color.css';
import '../assets/imgf/photo-1.png';
import illustration1 from '../assets/imgf/illustration-1.png';
import illustration2 from '../assets/imgf/illustration-2.png';
import illustration3 from '../assets/imgf/illustration-3.png';
import downArrowClr from '../assets/imgf/cheeseburger_home_dss_desktop_fr.719d2f06.ef577d1de947583569f7.png'; // Import de l'image
import Header from '../components/haeder';
import Footer from '../components/footer';
import AOS from 'aos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import 'aos/dist/aos.css';

 
const images = [
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/225x225/9398c11d3f/sushishop-225x225.png', alt: 'Sushi Shop' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/4fd0ed75e4/icon-pizza.jpg', alt: 'Pizza Icon' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x256/47c289a9f4/pizza-wide.jpg', alt: 'Pizza' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/54ae25d5da/kfc.jpg', alt: 'KFC' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x256/8bd9a1cb99/bowl-wide.jpg', alt: 'Bowl' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/6a385f47c7/icon-vegan.jpg', alt: 'Vegan Icon' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/2133x1200/aa167a689c/burger.jpg', alt: 'Burger' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x265/a92bab2326/fries-2-wide.png', alt: 'Fries' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/c59b8bc39f/pitayasq.png', alt: 'Pitaya' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/d0d1af7ecf/dominos-logo-2-256x256.png', alt: 'Dominos' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/11bf79a2b4/icon-donut.jpg', alt: 'Donut Icon' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x256/838078bb19/grocery-wide.png', alt: 'Grocery' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/250x250/731b62d61e/mcdonalds-logo-green-250x250.png', alt: 'McDonalds' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x256/e0988a5a22/curry-wide.jpg', alt: 'Curry' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x256/b07158449c/sushi-wide.jpg', alt: 'Sushi' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/9b19027dd1/icon-wine.jpg', alt: 'Wine Icon' },

];
const imagesReverse = [
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/2133x1200/aa167a689c/burger.jpg', alt: 'Burger' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/6a385f47c7/icon-vegan.jpg', alt: 'Vegan Icon' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x256/8bd9a1cb99/bowl-wide.jpg', alt: 'Bowl' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/54ae25d5da/kfc.jpg', alt: 'KFC' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x256/47c289a9f4/pizza-wide.jpg', alt: 'Pizza' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/4fd0ed75e4/icon-pizza.jpg', alt: 'Pizza Icon' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/225x225/9398c11d3f/sushishop-225x225.png', alt: 'Sushi Shop' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/9b19027dd1/icon-wine.jpg', alt: 'Wine Icon' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x256/b07158449c/sushi-wide.jpg', alt: 'Sushi' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x256/e0988a5a22/curry-wide.jpg', alt: 'Curry' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/250x250/731b62d61e/mcdonalds-logo-green-250x250.png', alt: 'McDonalds' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x256/838078bb19/grocery-wide.png', alt: 'Grocery' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/11bf79a2b4/icon-donut.jpg', alt: 'Donut Icon' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/d0d1af7ecf/dominos-logo-2-256x256.png', alt: 'Dominos' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/256x256/c59b8bc39f/pitayasq.png', alt: 'Pitaya' },
  { src: '//img2.storyblok.com/filters:format(webp)/f/62776/512x265/a92bab2326/fries-2-wide.png', alt: 'Fries' },
];

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init();
    const timer = setTimeout(() => setLoading(false), 2000);
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

        
<section className="hero">
      <div className="hero-content">
        <h1>Bienvenue chez Delivio</h1>
        <p>Nous sommes le plus rapide.</p>
      </div>
      <div className="ScrollingCarousel">
        <div className="ScrollingCarousel-inner">
          {images.map((image, index) => (
            <div key={index} className="ScrollingCarousel-card">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
      <div className="ScrollingCarousel">
        <div className="ScrollingCarousel-inner-reverse">
          {imagesReverse.map((image, index) => (
            <div key={index} className="ScrollingCarousel-card">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>

     
    <section data-qa="find-restaurants-section" className="_2O6BUj">
  <div className="_1W7fGa" data-qa="hero-image-section">
    <div className="left-text">
      <p className="left-phrase">Livraison rapide et fiable</p>
    </div>
    <div tabIndex={0} className="_1IbQjL" role="img" aria-label="Image sur fond orange composée des mots Vous avez dit au-dessus d’un hamburger avec des frites et du ketchup, et du logo JUST EAT en dessous">
      <figure className="_3MNml Nav7S" data-qa="hero-image-section-hero-image">
        <img className="_1xp4W" src={downArrowClr} alt="Image sur fond orange composée des mots Vous avez dit au-dessus d’un hamburger avec des frites et du ketchup, et du logo JUST EAT en dessous" />
      </figure>
    </div>
    <div className="right-text">
      <p className="right-phrase">Découvrez nos délicieuses options</p>
    </div>
  </div>
</section>
<section className="top-partners">
      <h2 className="top-partners__title">
        Top restaurants and more in Delivio
      </h2>
      <div className="top-partners__container">
        <div className="top-partner-item">
          <img
            src="https://images.deliveryhero.io/image/customer-assets-glovo/countries/Stores/bghikwl7kiy5zyytrhp3?t=W3siYXV0byI6eyJxIjoibG93In19XQ=="
            alt="McDonald's"
            className="top-partner-item__image"
          />
          <div className="top-partner-item__title-wrapper">
            <h3 className="top-partner-item__title">
              McDonald's
            </h3>
          </div>
        </div>
        <div className="top-partner-item">
          <img
            src="https://images.deliveryhero.io/image/customer-assets-glovo/countries/Stores/bjqayhyh0x0trsnujkfn?t=W3siYXV0byI6eyJxIjoibG93In19XQ=="
            alt="KFC"
            className="top-partner-item__image"
          />
          <div className="top-partner-item__title-wrapper">
            <h3 className="top-partner-item__title">
              KFC
            </h3>
          </div>
        </div>
        <div className="top-partner-item">
          <img
            src="https://images.deliveryhero.io/image/customer-assets-glovo/countries/Stores/htnphwqorq4rl3zhcr1z?t=W3siYXV0byI6eyJxIjoibG93In19XQ=="
            alt="BurgerKing"
            className="top-partner-item__image"
          />
          <div className="top-partner-item__title-wrapper">
            <h3 className="top-partner-item__title">
              BurgerKing
            </h3>
          </div>
        </div>
        <div className="top-partner-item">
          <img
            src="https://images.deliveryhero.io/image/customer-assets-glovo/countries/Stores/hvpjrukzrzcx2fr7aivr?t=W3siYXV0byI6eyJxIjoibG93In19XQ=="
            alt="Carrefour"
            className="top-partner-item__image"
          />
          <div className="top-partner-item__title-wrapper">
            <h3 className="top-partner-item__title">
              Carrefour
            </h3>
          </div>
        </div>
        <div className="top-partner-item">
          <img
            src="https://images.deliveryhero.io/image/customer-assets-glovo/countries/Stores/ytwytqxp9iracoscs2jf?t=W3siYXV0byI6eyJxIjoibG93In19XQ=="
            alt="PizzaHut"
            className="top-partner-item__image"
          />
          <div className="top-partner-item__title-wrapper">
            <h3 className="top-partner-item__title">
              PizzaHut
            </h3>
          </div>
        </div>
        <div className="top-partner-item">
          <img
            src="https://images.deliveryhero.io/image/customer-assets-glovo/countries/Stores/igq1ghjtalh1hzzu3wx1.png?t=W3siYXV0byI6eyJxIjoibG93In19XQ=="
            alt="PapaJohn's"
            className="top-partner-item__image"
          />
          <div className="top-partner-item__title-wrapper">
            <h3 className="top-partner-item__title">
              PapaJohn's
            </h3>
          </div>
        </div>
        <div className="top-partner-item">
          <img
            src="https://images.deliveryhero.io/image/customer-assets-glovo/countries/Stores/fgxofdbzk1n0mpxqfxwu?t=W3siYXV0byI6eyJxIjoibG93In19XQ=="
            alt="Subway"
            className="top-partner-item__image"
          />
          <div className="top-partner-item__title-wrapper">
            <h3 className="top-partner-item__title">
              Subway
            </h3>
          </div>
        </div>
        <div className="top-partner-item">
          <img
            src="https://images.deliveryhero.io/image/customer-assets-glovo/countries/Stores/grdqndkujhpgjt88ionz?t=W3siYXV0byI6eyJxIjoibG93In19XQ=="
            alt="TacoBell"
            className="top-partner-item__image"
          />
          <div className="top-partner-item__title-wrapper">
            <h3 className="top-partner-item__title">
              TacoBell
            </h3>
          </div>
        </div>
      </div>
    </section>
    <div className="row">
  <div
    className="col-lg-4 col-md-6 col-sm-12"
    data-aos="flip-up"
    data-aos-delay="200"
    data-aos-duration="300"
  >
    <div className="work-card">
      <img alt="Select Restaurant" src={illustration1} />
      <h4>
        <span>01</span> Choisissez un Restaurant
      </h4>
      <p>
        Explorez notre liste de restaurants pour trouver celui qui vous convient le mieux. Nous avons une grande variété de choix pour satisfaire toutes vos envies.
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
      <img alt="Select Menu" src={illustration2} />
      <h4>
        <span>02</span> Sélectionnez votre Menu
      </h4>
      <p>
        Parcourez les menus des restaurants et sélectionnez vos plats préférés. Nous vous garantissons une expérience culinaire exceptionnelle.
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
      <img alt="Wait for Delivery" src={illustration3} />
      <h4>
        <span>03</span> Attendez la Livraison
      </h4>
      <p>
        Détendez-vous et attendez la livraison de votre commande. Nos partenaires assurent une livraison rapide et efficace directement à votre porte.
      </p>
    </div>
  </div>
</div>

    <div className="button-container">
  <a href="/tn/fr/tunis/restaurants_1/sandwichs_34819/" className="button button-2">
    Sandwichs
  </a>
  <a href="/tn/fr/tunis/restaurants_1/pizza_34701/" className="button button-2">
    Pizza
  </a>
  <a href="/tn/fr/tunis/restaurants_1/salades_35101/" className="button button-2">
    Salades
  </a>
  <a href="/tn/fr/tunis/restaurants_1/tacos_34980/" className="button button-2">
    Tacos
  </a>
  <a href="/tn/fr/tunis/restaurants_1/poulet_34809/" className="button button-2">
    Poulet
  </a>
  <a href="/tn/fr/tunis/restaurants_1/tunisien_35656/" className="button button-2">
    Tunisien
  </a>
  <a href="/tn/fr/tunis/restaurants_1/burgers_34789/" className="button button-2">
    Burgers
  </a>
  <a href="/tn/fr/tunis/restaurants_1/italien_34685/" className="button button-2">
    Italien
  </a>
  <a href="/tn/fr/tunis/restaurants_1/pates_34881/" className="button button-2">
    Pâtes
  </a>
  <a href="/tn/fr/tunis/restaurants_1/crepes_34765/" className="button button-2">
    Crêpes
  </a>
</div>


      <section id="signup" className="signup">
        <h2>Sign Up for Exclusive Offers</h2>
        <p>Join our mailing list to receive updates and special offers.</p>
        <form className="signup-form">
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <p>If you have any questions, feel free to reach out to us.</p>
        <Link to="mailto:contact@delivio.com">Email Us</Link>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
