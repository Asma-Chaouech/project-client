import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import IndexPage from './components/IndexPage';
import ContactPage from './components/cantact'; // Assurez-vous que le nom du fichier est correct
import Restaurants from './components/restaurants';
import Landingpage from './components/landing';
import Signup from './components/Signup';
import Profile from './components/profil';
import Login from './components/login';
import AddressPage from './components/AddressPage';
import Adresscrud from './components/Adresscrud';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import ValidationCommande from './components/ValidationCommande';
import Logout from './components/login';
import OrderConfirmation from './components/OrderConfirmation';
import PrivateRoute from './components/PrivateRoute'; // Chemin d'import correct
import PublicRoute from './components/PublicRoute'; // Chemin d'import correct
import HistoryPage from './components/HistoryPage';
import NotificationList from './components/Notif';
import AboutPage from './components/acceuil';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect the user to the login page by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/addresspage" element={<AddressPage />} /> {/* Make sure the path is lowercase */}
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/productlist/:restaurantId" element={<ProductList />} /> {/* Consistent naming convention */}
          <Route path="/indexpage" element={<IndexPage />} />
          <Route path="/contacts" element={<ContactPage />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/productdetails/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} /> {/* Consistent naming convention */}
          <Route path="/validationcommande" element={<ValidationCommande />} />
          <Route path="/orderconfirmation" element={<OrderConfirmation />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/Adresscrud" element={<Adresscrud />} /> {/* Make sure the path is lowercase */}
          <Route path="/Notif" element={<NotificationList/>}/>

          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
