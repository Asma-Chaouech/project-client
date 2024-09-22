import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, collection, getDocs , query , where} from 'firebase/firestore';
import { FaShoppingCart } from 'react-icons/fa';
import '../assets/cssf/ProductDetails.css';
import '../assets/cssf/ProductList.css';
import Header from './header1';
import { getAuth } from 'firebase/auth';
import { Link, useNavigate  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUser, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons'; 
import '../assets/cssf/header1.css';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  productImage: string;
}

interface Reply {
  user: string;
  comment: string;
}

interface Review {
  user: string;
  rating: number;
  comment: string;
  timestamp: string;
  replies?: Reply[];
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
  additionalImages: string[]; 
}


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

const ProductDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState('description');
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [mycategory, setCategories] = useState<Category[]>([]);
  const [mysubCategory, setSubCategories] = useState<SubCategory[]>([]);
  const [localQuantity, setLocalQuantity] = useState<number>(1);

  
  const [newReview, setNewReview] = useState<{ rating: number; comment: string }>({
    rating: 0,
    comment: '',
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyComment, setReplyComment] = useState<string>('');
  const [replyIndex, setReplyIndex] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const auth = getAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Account'); 
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors
const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  useEffect(() => {
    AOS.init();
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  const getCurrentUser = () => {
    const user = auth.currentUser;
    return user ? user.displayName || user.email || user.uid : 'Anonyme';
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        console.error('L ID du produit est indéfini');
        setLoading(false);
        return;
      }

      try {
        const productDoc = doc(db, 'product', productId);
        const productSnapshot = await getDoc(productDoc);

        if (productSnapshot.exists()) {
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

          
          const productData = productSnapshot.data() as Product;
          setProduct(productData);
          setReviews(productData.reviews || []);
        } else {
          console.log('Aucun produit trouvé!');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    // Load cart items from localStorage when the component mounts
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    setCartItems(storedCartItems);
  }, []);
  useEffect(() => {
    console.log('Cart items on load:', cartItems);
  }, [cartItems]);



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


  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStarClick = (rating: number) => {
    setNewReview(prevState => ({
      ...prevState,
      rating,
    }));
  };

  const getCategoryName = (categoryId: string) => {
    const category = mycategory.find(cat => cat.id === categoryId);
    return category ? category.name : 'Inconnu';
  };


  const getsubCategoryName = (categoryId: string) => {
    const subcategory = mysubCategory.find(cat => cat.id === categoryId);
    return subcategory ? subcategory.name : 'Inconnu';
  };



  const submitReview = async () => {
    if (!product || !productId) return;
  
    const currentUser = localStorage.getItem('userName')//getCurrentUser(); // Obtenir l'utilisateur actuel
  
    if (!newReview.comment.trim()) {
      setMessage('Le commentaire ne peut pas être vide.');
      setMessageType('error');
      return;
    }
  
    try {
      const productDoc = doc(db, 'product', productId);
      const productSnapshot = await getDoc(productDoc);
  
      if (!productSnapshot.exists()) {
        setMessage('Produit non trouvé');
        setMessageType('error');
        return;
      }
  
      const productData = productSnapshot.data();
      const existingReviews = productData.reviews || [];
  
      // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
      const userHasReviewed = existingReviews.some(
        (review: Review) => review.user === currentUser
      );
  
      if (userHasReviewed) {
        setMessage('Vous avez déjà laissé un avis pour ce produit.');
        setMessageType('error');
        return;
      }
  
      // Création du nouvel avis
      const review: Review = {
        user: currentUser || 'account',
        rating: newReview.rating,
        comment: newReview.comment,
        timestamp: new Date().toISOString(),
        replies: [],
      };
  
      // Ajouter le nouvel avis
      if (isLoggedIn){
      await updateDoc(productDoc, {
        reviews: arrayUnion(review),
      });

      // Mettre à jour la note moyenne
      const updatedReviews = [...existingReviews, review];
      const newAverageRating = calculateAverageRating(updatedReviews);
      await updateDoc(productDoc, {
        reviews: updatedReviews,
        averageRating: newAverageRating,
      });
  
      setReviews(updatedReviews);
      setNewReview({ rating: 0, comment: '' });
      setMessage('Avis ajouté avec succès !');
      setMessageType('success');
      const requestBody = {
        clientName: currentUser,
        productName: product.productName,
        productId : productId, 
        type: 'review',
        resId: localStorage.getItem('resId'),
      };
      console.log(requestBody)
      const response = await fetch('http://localhost:3008/api/add-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
    }
    else {
      setMessage('Vous devez vous conntecter !');
      setMessageType('error');
    }

    } catch (error) {
      setMessage('Erreur lors de l\'ajout de l\'avis.');
      setMessageType('error');
      console.error('Erreur lors de l\'ajout de l\'avis:', error);
    }
  };
  

  const submitReply = async (index: number) => {
    if (!product || !productId) return;

    const reply: Reply = {
      user: getCurrentUser(),
      comment: replyComment,
    };

    try {
      const updatedReviews = [...reviews];
      if (!updatedReviews[index].replies) {
        updatedReviews[index].replies = [];
      }
      updatedReviews[index].replies?.push(reply);

      const productDoc = doc(db, 'product', productId);
      await updateDoc(productDoc, {
        reviews: updatedReviews,
      });

      setReviews(updatedReviews);
      setReplyComment('');
      setReplyIndex(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
    }
  };

  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  const averageRating = product?.averageRating || calculateAverageRating(reviews);
  const isLoggedIn = localStorage.getItem('userId') !== null;

  if (loading) {
    return  <div className="page-loader">
    <div className="wrapper">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
      <span>Loading</span>
    </div>
  </div>;
  }

  if (!product) {
    return <div>Produit non trouvé</div>;
  }
  const increaseQuantity = () => {
    setLocalQuantity(localQuantity + 1);
  };
  
  const decreaseQuantity = () => {
    if (localQuantity > 0) {
      setLocalQuantity(localQuantity - 1);
    }
  };


  const calculateTotalQuantity = () => {
    return cartItems.reduce((totalQuantity, item) => totalQuantity + item.quantity,0);
  };

  return (
    <div className="product-details-container">
      {loading ? (
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
      ) : (
        <>
       <Header calculateTotalQuantity={calculateTotalQuantity} />

          <div className="afterheader">
            <ul className="crumbs d-flex">
              <li><a href="/indexpage">Accueil</a></li>
              <li><a href="/restaurants">Restaurants</a></li>
              <li><a href="/ProductList">Produits</a></li>
              <li className="two"><a href={`/ProductDetails/${productId}`}><i className="fa-solid fa-right-long"></i> Détails du Produit</a></li>
            </ul>
            <div className="product-content">
              <div className="product-container1">
                <div className="product-container-sous">
                  <img src={product.productImage} alt={product.productName} className="product-image-details" />
                  {product.additionalImages && product.additionalImages.length > 0 && (
                    <div className="additional-images">
                      {product.additionalImages.map((image, index) => (
                        <img key={index} src={image} alt={`${product.productName} additional view ${index + 1}`} className="additional-image" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="product-details">
                  <div className="product-rating">
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span id='firststar' key={star} className={`star ${averageRating >= star ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <h1>{product.productName}</h1>
                  <p className='px'><strong></strong> {product.productPrice.toFixed(2)}€</p>
                  <div className="category-container">
                    <p className='cat'><strong>Catégorie:</strong>{getCategoryName(product.productCategory)}</p>
                    <p className='cat1'><strong>&nbsp; / &nbsp;</strong> {getsubCategoryName(product.productSpecCategory)}</p>
                  </div>
                  <div className='product-actions-detail'>
                    <div className="quantity-box">
                    <button id={`decrease-button-${product.productId}`} className="quantity-button-detail" onClick={decreaseQuantity}> - </button>
                      <span className="quantity-display">
                         {localQuantity}
                      </span>
                      <button id={`increase-button-${product.productId}`} className="quantity-button-detail" onClick={increaseQuantity}> + </button>
                     
                    </div>
                    <div className="icon-box" onClick={() => addToCart(product, product.productId)}>
                         <FaShoppingCart />
                    </div>
                    
                  </div>
                </div>
              </div>

              <div className="product-details-container">
                <div className="tabs">
                  <button 
                    className={`tab ${activeTab === 'description' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                  <button 
                    className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('reviews')}
                  >
                    Avis
                  </button>
                </div>

                <div className="content">
                  {activeTab === 'description' && (
                    <div className="description-section">
                      <p><strong></strong> {product.productDescription}</p>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="reviews-section">
                      {reviews.length === 0 ? (
                        <p>Aucun avis pour le moment</p>
                      ) : (
                        reviews.map((review, index) => (
                          <div key={index} className="review">
                            <div className="review-header">
                              <p><strong>{review.user}</strong></p>
                              <div className='starXdate'>
                                <div className="starsR">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} className={`starR ${review.rating >= star ? 'filled' : ''}`}>★</span>
                                  ))}
                                </div>
                                <span className="review-date">
                                  {new Date(review.timestamp).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                            <p>{review.comment}</p>
                            {review.replies && (
                              <div className="new-review">
                                {review.replies.map((reply, replyIndex) => (
                                  <div key={replyIndex} className="reply">
                                    <p><strong>{reply.user}</strong> </p>
                                    <p>{reply.comment}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                            <button className='envoyer' onClick={() => setReplyIndex(index)}>Répondre</button>
                            {replyIndex === index && (
                              <div className="reply-form">
                                <textarea
                                  value={replyComment}
                                  onChange={e => setReplyComment(e.target.value)}
                                ></textarea>
                               <button className='envoyer' onClick={() => submitReply(index)}>Envoyer</button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                      <div className="new-review">
                        <h3 className="product-count">Ajouter un avis</h3>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              className={`star ${newReview.rating >= star ? 'filled' : ''}`}
                              onClick={() => handleStarClick(star)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <textarea
                          name="comment"
                          value={newReview.comment}
                          onChange={handleReviewChange}
                        ></textarea>
                        <button className='envoyer' onClick={submitReview}>Envoyer</button>
                         {message && (
      <div className={`message ${messageType}`}>
        {message}
      </div>
    )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;