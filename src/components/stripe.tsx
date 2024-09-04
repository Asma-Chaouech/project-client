import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load your Stripe publishable key
const StripePromise = loadStripe('pk_test_51NaIyXLrmvfcbdCw6qYQRUAskIqMI9nHplJvoyg0kxJ0bSUgXNOsbMIvY72ylNz60stMNXo79Ro4IKZ0MuqWdyPh007gtwbCql');

const Panier: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Function to handle the button click
  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer sk_test_51NaIyXLrmvfcbdCwhxjtYMinGnA1vFLQazZaR8Em23ddZ3fC9l5QJbFX5hzau3xewOuwgGytmsKH5kUirsmJow3d00P8kuMyWI`,
        },
        body: new URLSearchParams({
          amount: '1000',
          currency: 'usd'
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.client_secret);
      setLoading(false);
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      setError(error.message || 'Failed to create payment intent.');
      setLoading(false);
    }
  };

  // Function to handle form submission and confirm payment
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement! },
    });

    if (result.error) {
      setError(result.error.message || 'Payment failed.');
    } else {
      if (result.paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        setError(null);
      }
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick} disabled={loading}>
        {loading ? 'Processing...' : 'Create Payment Intent'}
      </button>
      {clientSecret && (
        <form onSubmit={handleSubmit}>
          <CardElement />
          <button type="submit" disabled={!stripe}>
            Pay
          </button>
        </form>
      )}
      {error && <div>{error}</div>}
      {success && <div>Payment succeeded!</div>}
    </div>
  );
};

const Test: React.FC = () => (
  <Elements stripe={StripePromise}>
    <Panier />
  </Elements>
);

export default StripePromise;
