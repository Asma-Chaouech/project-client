import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { FaShoppingCart, FaPlus, FaEye } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, } from 'firebase/firestore';
import '../assets/cssf/ProductList.css';
import '../assets/cssf/headerprofile.css';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Footer from '../components/footer';
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase Auth
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUser, faArrowLeft, faHome ,faShoppingCart} from '@fortawesome/free-solid-svg-icons'; 
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNavigate } from 'react-router-dom';
import Headerprofile from './haederprofil';


Modal.setAppElement('#root');


interface Category {
  id: string;
  name: string;
  categoryImage : string;
  subCategories: SubCategory[]
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}


interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  productDescription: string;
  productCategory: string;
  productImage: string;
  productSpecCategory: string;
  reviews?: Review[];
  averageRating?: number; 
  restaurantId: string;
}

interface Review {
  user: string;
  rating: number;
  comment: string;
  timestamp: string;
  replies?: Reply[];
}
interface Reply {
  user: string;
  comment: string;
}

interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  productImage: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Voir tout');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase Auth
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userName, setUserName] = useState<string>('Account'); // State for user's name
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors
  const [mycategory, setCategories] = useState<Category[]>([]);
  const [mysubCategory, setSubCategories] = useState<SubCategory[]>([]);
  const { restaurantId } = useParams<{ restaurantId: string }>();


  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
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
            setCartItems(data.cart || []);
            
            // Save user data to localStorage
            localStorage.setItem('userData', JSON.stringify(data));
            localStorage.setItem('userDocId', userDoc.id);

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
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign the user out
      localStorage.removeItem('userId'); // Clear the user ID from local storage
      navigate('/login'); // Redirect to the LandingPage after logout
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  useEffect(() => {
    AOS.init();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);


    useEffect(() => {
      const fetchProducts = async () => {
        console.log(restaurantId)
        if (!restaurantId) {
          console.error('L\'ID du restaurant est indéfini');
          setLoading(false);
          return;
        }
  
        try {
          const categorySnapshot = await getDocs(collection(db, 'category'));
          const categoryList: Category[] = categorySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            categoryImage: doc.data().categoryImage,
            subCategories: []
          }));
          setCategories(categoryList);
  
          const subCategorySnapshot = await getDocs(collection(db, 'subcategory'));
          const subCategoryList: SubCategory[] = subCategorySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            categoryId: doc.data().categoryId,
          }));
          setSubCategories(subCategoryList);
  
          const categoryMap = categoryList.map(category => ({
            ...category,
            subCategories: subCategoryList.filter(subCategory => subCategory.categoryId === category.id)
          }));
          setCategories(categoryMap);
  
          // Récupérer les produits en filtrant par restaurantId
          const productsCollection = collection(db, 'product');
          const productsQuery = query(productsCollection, where('restaurantId', '==', restaurantId));
          const productSnapshot = await getDocs(productsQuery);
          const productList = productSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              productId: doc.id,
              productName: data.productName,
              productPrice: data.productPrice,
              productDescription: data.productDescription || '',
              productCategory: data.productCategory,
              productImage: data.productImage,
              productSpecCategory: data.productSpecCategory,
              averageRating: data.averageRating,
              restaurantId: data.restaurantId
            };
          });
          setProducts(productList);
          console.log(restaurantId)
        } catch (error) {
          console.error('Erreur lors de la récupération des produits:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProducts();
    }, [restaurantId]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    // Block the back button
    const handlePopState = (event: PopStateEvent) => {
      navigate('/profile', { replace: true });
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);
  const addToCart = (product: Product, productId: string) => {
    const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
   
    const existingItem = cartItems.find((item: any) => item.productId === product.productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
      // Mettre à jour le panier avec la quantité appropriée
  const updatedCartItems = cartItems.map(item =>
    item.productId === productId
      ? { ...item, quantity: item.quantity  }
      : item
  );
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setCartItems(updatedCartItems);
  };

  const getCategoryName = (categoryId: string) => {
    const category = mycategory.find(cat => cat.id === categoryId);
    return category ? category.name : 'Inconnu';
  };


  const getsubCategoryName = (categoryId: string) => {
    const subcategory = mysubCategory.find(cat => cat.id === categoryId);
    return subcategory ? subcategory.name : 'Inconnu';
  };



  
const filteredProducts = () => {
  // Filtrer par sous-catégorie si elle est sélectionnée
  if (selectedSubcategory) {
    return products.filter(product => getsubCategoryName(product.productSpecCategory) === getsubCategoryName(selectedSubcategory));
  }

  // Filtrer par catégorie si elle est sélectionnée
  if (selectedCategory && selectedCategory !== 'Voir tout') {
    return products.filter(product => getCategoryName(product.productCategory) === selectedCategory);
  }

  // Retourner tous les produits si aucune catégorie ni sous-catégorie n'est sélectionnée
  return products;
};

const handleCategoryClick = (category: string) => {
  setSelectedCategory(category);
  setSelectedSubcategory(null); // Réinitialiser la sous-catégorie lors du changement de catégorie
};

const handleSubcategoryClick = (subcategory: string) => {
  setSelectedSubcategory(subcategory);
};




  const toggleCategory = (categoryName: string) => {
    setOpenCategory(prevCategory => prevCategory === categoryName ? null : categoryName);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/ProductDetails/${productId}`);
  };
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
      {!loading && (
        <div className="page-container">
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
              <Link to="/ProductList">Accueil</Link>
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
            </div>
          </div>
        </div>
      </div>
    </header>
          


    <main className={`content ${isSidebarOpen ? 'shifted' : ''}`} style={{paddingTop:"50px"}}>
  <div className="row">
    {isSidebarOpen && (
        <div className="col-lg-3">
        <aside className="sidebar open">
          <h2>Categories</h2>
          {mycategory.map((category) => (
  <div key={category.name} className="category">
    <div className="category-header" onClick={() => toggleCategory(category.name)}>
      <img
        alt="categoryimg"
        src={category.categoryImage}
        style={{ maxWidth: "15%", borderRadius: "50%" }}
      /> &nbsp;
      <h3>{category.name}</h3>

      {category.subCategories.length > 0 && (
        openCategory === category.name ? <AiOutlineUp /> : <AiOutlineDown />
      )}
    </div>

    {openCategory === category.name && category.subCategories.length > 0 && (
      <ul className="subcategory-list">
        {category.subCategories.map((subcategory) => (
          <li
            key={subcategory.id}
            onClick={() => handleSubcategoryClick(subcategory.id)}
          >
            {subcategory.name}
          </li>
        ))}
      </ul>
    )}
  </div>
))}




        </aside>
        </div>

    )}
    <div className={isSidebarOpen ? 'col-lg-9' : 'col-lg-12'}>
      <div>
        <ul className="crumbs d-flex">
          <li><Link to="/IndexPage">Accueil</Link></li>
          <li><Link to="/restaurants">Restaurants</Link></li>
          <li className="two">
            <Link to="/ProductList">
              <i className="fa-solid fa-right-long"></i>Produits
            </Link>
          </li>
        </ul>
      </div>

      <div className="category-filter">
        {windowWidth > 768
          ? ['Voir tout', ...mycategory.map((c) => c.name)].map((category) => (
              <button
                key={category}
                className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))
          : ['Voir tout', ...mycategory.map((c) => c.categoryImage)].map((icon, index) => (
              <button
                key={index}
                className={`filter-button ${selectedCategory === mycategory[index]?.name ? 'active' : ''}`}
                onClick={() => handleCategoryClick(mycategory[index]?.name)}
              >
                {icon}
              </button>
            ))}
      </div>

      <div className="product-grid">
        {filteredProducts().length === 0 ? (
          <p>Aucun produit affiché</p>
        ) : (
          filteredProducts().map((product) => (
            <div key={product.productId} className="product-card">
              <img src={product.productImage} alt={product.productName} className="product-image" />
              <div className="cart-iconS" onClick={() => addToCart(product, product.productId)}>
                <FaShoppingCart />
              </div>
              <div className="view-details-icon" onClick={() => handleViewDetails(product.productId)}>
                <FaEye />
              </div>
              <div className="product-rating">
                <div id="starslist" className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= (product.averageRating ?? 0) ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <h2 id="prodtitre" className="product-name">{product.productName}</h2>
              <p className="product-price">{product.productPrice}€</p>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
</main>

        </div>
      )}
    <Footer />
    </>
  );
};

export default ProductList;
