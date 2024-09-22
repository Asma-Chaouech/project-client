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
import { faBars, faXmark, faUser, faArrowLeft, faHome ,faShoppingCart, faEye} from '@fortawesome/free-solid-svg-icons'; 
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNavigate } from 'react-router-dom';
import Header from './header1';
import ReactAutocomplete from 'react-autocomplete';
//import Headerprofile from './haeder';


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
  const [searchQuery, setSearchQuery] = useState<Product[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>('');


  



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

  /*
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
*/
  useEffect(() => {
    // Load cart items from localStorage when the component mounts
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);
  }, []);


  const addToCart = (product: Product, productId: string) => {
    const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    console.log("mypro",product);
    
   
    const existingItem = cartItems.find((item: any) => item.productId === product.productId);
    console.log("exist", existingItem , product.productId)
    
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

    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cartTotalQuantity', JSON.stringify(totalQuantity));
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



  
/*const filteredProducts = () => {
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
};*/
const filteredProducts = () => {
  let filteredByName = searchQuery;

  if (selectedSubcategory) {
    filteredByName = filteredByName.filter(product => getsubCategoryName(product.productSpecCategory) === getsubCategoryName(selectedSubcategory));
  }

  if (selectedCategory && selectedCategory !== 'Voir tout') {
    filteredByName = filteredByName.filter(product => getCategoryName(product.productCategory) === selectedCategory);
  }

  return filteredByName;
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
    localStorage.setItem("productId",productId)
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
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  useEffect(() => {
    if (selectedValue === '') {
      setSearchQuery(products);
    } else {
      const searchLower = selectedValue.toLowerCase();
      setSearchQuery(products.filter(r => r.productName.toLowerCase().includes(searchLower)
      ));
    }
  }, [selectedValue, products]);

  const names = Array.from(new Set(products.map(r => r.productName))).sort();
  const [isLessThan8, setIsLessThan8] = useState(false);


  const [currentPage, setCurrentPage] = useState(0);
  const categoriesPerPage = 8;

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(mycategory.length / categoriesPerPage);

  // Filtrer les catégories à afficher pour la page actuelle
  const currentCategories = mycategory.slice(
    currentPage * categoriesPerPage,
    (currentPage + 1) * categoriesPerPage
  );
  useEffect(() => {
    setIsLessThan8(currentCategories.length < categoriesPerPage);
  }, [currentCategories]);
  

  // Calculer le nombre d'éléments restants après la page actuelle
  const remainingPages = totalPages - currentPage - 1;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
console.log(isLessThan8)
  
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
          

    <Header calculateTotalQuantity={calculateTotalQuantity}/>
    <main className={`content ${isSidebarOpen ? 'shifted ' : ''}`} style={{paddingTop:"50px" , overflowX:"hidden"}}>
    <div className="extras">
      <button className="openbtn my-open-btn" onClick={toggleSidebar} >☰</button>
    </div>
    <div className="extras">
      <div className={`bar-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} >
        <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars } style={{color:"orange"}} />
      </div>
    </div>
  <div className="row">
    {isSidebarOpen && (
        <div className="col-lg-3">
        <aside className="sidebar open" style={{top:"75px" , overflowY:"visible"}}>
          <h2 className="d-none d-lg-block">Categories</h2>
          {mycategory.map((category) => (
  <div key={category.name} className="category">
    <div className="category-header" onClick={() => toggleCategory(category.name)}>
      <img
        alt="categoryimg"
        className='sidebar-image'
        src={category.categoryImage}
        style={{  borderRadius: "50%" }}
      /> &nbsp;
      <h3  className='category-name'>{category.name}</h3>

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
    <div className={isSidebarOpen ? 'col-lg-9 product-grid-open category-filter-open crumbs-open' : 'col-lg-12'}>
      <div>
        <ul className="crumbs d-flex" style={{position:"relative", left:"95px"}}>
          <li><Link to="/IndexPage">Accueil</Link></li>
          <li><Link to="/restaurants">Restaurants</Link></li>
          <li className="two">
            <Link to="/ProductList">
              <i className="fa-solid fa-right-long"></i>Produits
            </Link>
          </li>
          <div className={`nice-select Advice my-search`} style={{top:"-12px" , width:"300px"}}>
                      <ReactAutocomplete
                        items={names.map(name => ({ label: name }))}
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
                        inputProps={{ className: 'current', placeholder: "Entrez le nom" ,style: { border: 'none', outline: 'none', boxShadow: 'none', width: '250px', paddingLeft: '15px', fontSize: '20px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#000' } }}
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
        </ul>
      </div>

<div className="category-filter-wrapper">


      <div className="category-filter">
              {/* Bouton précédent (à gauche) */}
      {currentPage > 0 && (
        <button className="my-pagination-button" onClick={handlePreviousPage}>
          -1 {/* Icône pour revenir en arrière */}
        </button>
      )}
        <button
          className={`filter-button ${selectedCategory === 'Voir tout' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('Voir tout')}
        >
          <FontAwesomeIcon icon={faEye} className="category-icon" />
          <span className="category-name">Voir tout</span>
        </button>

        {currentCategories.map((category, index) => (
          <button
            key={index}
            className={`filter-button ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.name)}
          >
            <img
              src={category.categoryImage}
              alt={category.name}
              className={isLessThan8 ? 'less-than-8' : 'category-image'}
            />
            <span className="category-name">{category.name}</span>
          </button>
        ))}
       {remainingPages > 0 && (
        <button className="my-pagination-button" onClick={handleNextPage}>
          {/* Afficher +1 ou le nombre exact de pages restantes */}
          {`+${remainingPages}`}
        </button>
      )}
      </div>


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
