import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/cssf/owl.carousel.min.css';
import '../assets/cssf/owl.theme.default.min.css';
import '../assets/cssf/nice-select.css';
import '../assets/cssf/aos.css';
import '../assets/cssf/style.css';
import '../assets/cssf/responsive.css';
import '../assets/cssf/color.css';
import Header from '../components/header1'; 
import Footer from '../components/footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './cantact.css';  // Assurez-vous que ce fichier CSS est importé

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const calculateTotalQuantity = (): number => {
    const quantity = localStorage.getItem('cartTotalQuantity');
    return quantity ? parseInt(quantity, 10) : 0;
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init();
    const timer = setTimeout(() => setLoading(false), 2000); // Change time as needed
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;

    if (!name || !email || !phone || !message) {
      setError('Tous les champs sont requis.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3008/api/cantact', { // Assurez-vous que l'URL est correcte
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          fromEmail: email,
          phoneNumber: phone,
          messageContent: message
        })
      });

      if (response.ok) {
        setSuccessMessage('Votre message a été envoyé avec succès.');
        setFormData({ name: '', email: '', phone: '', message: '' }); // Clear form data
        setError(null);
      } else {
        const errorData = await response.text();
        setError(`Erreur lors de l'envoi du message : ${errorData}`);
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi du message.');
    }
  };

  return (
    <div className="container contact-form">
      <form onSubmit={handleSubmit}>
        <h3>Nous serions ravis de recevoir vos questions et suggestions. N'hésitez pas à nous contacter.</h3>
        <div className="row">
          <div className="col-lg-6">
            <div className="form-group">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Votre nom *" />
            </div>
            <div className="form-group" style={{ paddingTop: "12px" }}>
              <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Votre email *" />
            </div>
            <div className="form-group" style={{ paddingTop: "12px", paddingBottom: "12px" }}>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Votre numéro du téléphone *" />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-group">
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Votre message *" style={{height:"209px"}}></textarea>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="form-group">
              <input type="submit" name="btnSubmit" className="btnContact" value="Envoyer" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ContactPage