import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  productImage: string;
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientSecret, amount, cartItems, deliveryAddress, tip, promoCode, discount, finalTotal } = location.state as {
    clientSecret: string;
    amount: string;
    cartItems: CartItem[];
    deliveryAddress: string;
    tip: number;
    promoCode: string;
    discount: number;
    finalTotal: string;
  };
  
  const [paymentStatus, setPaymentStatus] = useState<string>('loading');
  
  useEffect(() => {
    const verifyPayment = async (clientSecret: string) => {
      try {
        const paymentResult = await simulatePaymentVerification(clientSecret);
        if (paymentResult.success) {
          setPaymentStatus('success');
          await saveOrderDetails();
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus('failed');
      }
    };

    verifyPayment(clientSecret);
  }, [clientSecret]);

  const simulatePaymentVerification = async (clientSecret: string) => {
    return new Promise<{ success: boolean }>((resolve) =>
      setTimeout(() => resolve({ success: true }), 2000)
    );
  };

  const saveOrderDetails = async () => {
    try {
      const orderData = {
        cartItems,
        deliveryAddress,
        tip,
        promoCode,
        discount,
        totalAmount: finalTotal,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      console.log('Order details saved successfully');
    } catch (error) {
      console.error('Error saving order details:', error);
    }
  };

  const handleReturnHome = () => {
    navigate('/IndexPage');
  };

  return (
    <div className="order-confirmation-container">
      {paymentStatus === 'loading' ? (
        <div className="loading">
          <p>Vérification du paiement...</p>
        </div>
      ) : paymentStatus === 'success' ? (
        <div className="order-success">
          <h1>Merci pour votre commande !</h1>
          <p>Votre paiement de {amount} TND a été effectué avec succès.</p>
          <div className="order-details">
            <h2>Détails de la commande</h2>
            <p><strong>Adresse de livraison:</strong> {deliveryAddress}</p>
            <p><strong>Pourboire:</strong> {tip.toFixed(3)} TND</p>
            <p><strong>Code promo:</strong> {promoCode} (-{discount.toFixed(3)} TND)</p>
            <p><strong>Total payé:</strong> {finalTotal} TND</p>
            <div className="ordered-items">
              <h3>Articles commandés:</h3>
              {cartItems.map((item) => (
                <div key={item.productId} className="ordered-item">
                  <img src={item.productImage} alt={item.productName} className="item-image" />
                  <div className="item-details">
                    <p>{item.productName}</p>
                    <p>Quantité: {item.quantity}</p>
                    <p>Prix: {(item.productPrice * item.quantity).toFixed(3)} TND</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleReturnHome} className="return-home-button">Retour à l'accueil</button>
        </div>
      ) : (
        <div className="order-failed">
          <h1>Échec du paiement</h1>
          <p>Il y a eu un problème avec votre paiement. Veuillez réessayer.</p>
          <button onClick={handleReturnHome} className="return-home-button">Retour à l'accueil</button>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
