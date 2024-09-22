import '../assets/cssf/HistoryPage.css';
import React, { useState, useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Headerprofile from './haederprofil';
import Header from './header1';

interface Item {
  productName: string;
  quantity: number;
  productPrice: number;
  productImage: string;
}

interface Order {
  id: string;
  date: string;
  deliveryAddress: string;
  deliveryCost: number;
  discount: number;
  finalTotal: number;
  items: Item[];
  status: string;
}

const HistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDetail, setActiveDetail] = useState<string | null>(null);
  const [sortCriteria, setSortCriteria] = useState<string>('date');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const auth = getAuth();
  const db = getFirestore();
  const Loader = () => (
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
  );
  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Get the user document from Firestore
          const usersRef = collection(db, 'clients');
          const q = query(usersRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userId = userDoc.id;
            // Get the orders for this user
            const ordersRef = collection(db, 'command');
            const ordersQuery = query(ordersRef, where('userId', '==', userId));
            const ordersSnapshot = await getDocs(ordersQuery);

            const ordersList: Order[] = ordersSnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                date: data.date,
                deliveryAddress: data.deliveryAddress,
                deliveryCost: data.deliveryCost,
                discount: data.discount,
                finalTotal: data.finalTotal,
                items: data.items || [],
                status: data.status || 'En attente',
              };
            });

            setOrders(ordersList);
          } else {
            setError('Utilisateur non trouvé.');
          }
        } catch (error) {
          setError('Erreur lors de la récupération des commandes.');
          console.error('Erreur lors de la récupération des commandes:', error);
        } finally {
          setLoading(false);
          if (loading) return <Loader />;
        }
      } else {
        setError('Utilisateur non connecté.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth, db]);
  if (loading) return <Loader />;
  const sortOrders = (criteria: string, ordersToSort: Order[]): Order[] => {
    switch (criteria) {
      case 'date':
        return ordersToSort.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'total':
        return ordersToSort.sort((a, b) => b.finalTotal - a.finalTotal);
      case 'deliveryCost':
        return ordersToSort.sort((a, b) => b.deliveryCost - a.deliveryCost);
      default:
        return ordersToSort;
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const today = new Date().toLocaleDateString();
  const todaysOrders = orders.filter(order => new Date(order.date).toLocaleDateString() === today);
  const previousOrders = orders.filter(order => new Date(order.date).toLocaleDateString() !== today);

  const filteredTodaysOrders = todaysOrders.filter(order =>
    order.date.toLowerCase().includes(searchQuery) ||
    order.deliveryAddress.toLowerCase().includes(searchQuery) ||
    order.deliveryCost.toString().includes(searchQuery) ||
    order.finalTotal.toString().includes(searchQuery) ||
    order.items.some(item =>
      item.productName.toLowerCase().includes(searchQuery) ||
      item.productPrice.toString().includes(searchQuery)
    )
  );

  const filteredPreviousOrders = previousOrders.filter(order =>
    order.date.toLowerCase().includes(searchQuery) ||
    order.deliveryAddress.toLowerCase().includes(searchQuery) ||
    order.deliveryCost.toString().includes(searchQuery) ||
    order.finalTotal.toString().includes(searchQuery) ||
    order.items.some(item =>
      item.productName.toLowerCase().includes(searchQuery) ||
      item.productPrice.toString().includes(searchQuery)
    )
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const sortedTodaysOrders = sortOrders(sortCriteria, filteredTodaysOrders);
  const sortedPreviousOrders = sortOrders(sortCriteria, filteredPreviousOrders);

  const toggleDetail = (orderId: string) => {
    setActiveDetail(activeDetail === orderId ? null : orderId);
  };
  const calculateTotalQuantity = (): number => {
    const quantity = localStorage.getItem('cartTotalQuantity');
    return quantity ? parseInt(quantity, 10) : 0;
  };

  return (
    
    <div className="history-page">
      
      <Header calculateTotalQuantity={calculateTotalQuantity}/>
      <div className="history-container">
        <div className="history-header">
          <h4>Historique des Commandes</h4>
          <div className="sort-container">
            <label htmlFor="sort">Trier par :</label>
            <select id="sort" value={sortCriteria} onChange={handleSortChange}>
              <option value="date">Date</option>
              <option value="total">Total</option>
              <option value="deliveryCost">Coût de Livraison</option>
            </select>
          </div>
          <div className="search-container">
            <label htmlFor="search">Rechercher :</label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Rechercher dans l'historique..."
            />
          </div>
        </div>

        <h5>Commandes d'Aujourd'hui</h5>
        {sortedTodaysOrders.length === 0 ? (
          <p className="no-orders">Aucune commande trouvée pour aujourd'hui.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Adresse de Livraison</th>
                <th>Coût de Livraison</th>
                <th>Remise</th>
                <th>Total Final</th>
                <th>Statut</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {sortedTodaysOrders.map(order => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>{order.deliveryAddress}</td>
                    <td>{order.deliveryCost.toFixed(2)} €</td>
                    <td>{order.discount.toFixed(2)} €</td>
                    <td>{order.finalTotal.toFixed(2)} €</td>
                    <td>{order.status}</td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => toggleDetail(order.id)}
                      >
                        {activeDetail === order.id ? 'Masquer Détails' : 'Voir Détails'}
                      </button>
                    </td>
                  </tr>
                  {activeDetail === order.id && (
  <tr>
    <td colSpan={7} className="order-details">
      {order.items.length > 0 ? (
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className="item-detail">
              <img
                src={item.productImage}
                alt={item.productName}
                className="item-image"
              />
              <div className="item-info">
                <p><strong>Nom:</strong> {item.productName}</p>
                <p><strong>Quantité:</strong> {item.quantity}</p>
                <p><strong>Prix:</strong> {item.productPrice.toFixed(2)} €</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-orders">Aucun article</p>
      )}
    </td>
  </tr>
)}

                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}

        <h5>Commandes Précédentes</h5>
        {sortedPreviousOrders.length === 0 ? (
          <p className="no-orders">Aucune commande précédente trouvée.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Adresse de Livraison</th>
                <th>Coût de Livraison</th>
                <th>Remise</th>
                <th>Total Final</th>
                <th>Statut</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {sortedPreviousOrders.map(order => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>{order.deliveryAddress}</td>
                    <td>{order.deliveryCost.toFixed(2)} €</td>
                    <td>{order.discount.toFixed(2)} €</td>
                    <td>{order.finalTotal.toFixed(2)} €</td>
                    <td>{order.status}</td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => toggleDetail(order.id)}
                      >
                        {activeDetail === order.id ? 'Masquer Détails' : 'Voir Détails'}
                      </button>
                    </td>
                  </tr>
                  {activeDetail === order.id && (
                    <tr>
                      <td colSpan={7} className="order-details">
                        {order.items.length > 0 ? (
                          <ul>
                            {order.items.map((item, index) => (
                              <li key={index} className="item-detail">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="item-image"
                                />
                                <p><strong>Nom:</strong> {item.productName}</p>
                                <p><strong>Quantité:</strong> {item.quantity}</p>
                                <p><strong>Prix:</strong> {item.productPrice.toFixed(2)} €</p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Aucun article</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
