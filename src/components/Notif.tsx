import React, { useEffect, useState } from 'react';
import { Container, Typography, IconButton } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase Auth
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore'; // Import Firestore
import { db } from '../firebaseConfig'; // Import Firebase config
import './notif.css';
import { timeStamp } from 'console';
import Header from '../components/header1'; 

interface Notification {
  id: string;
  clientName: string;
  productName: string;
  reviewerName: string;
  productId: string;
  commandId: string;
  isViewed: boolean;
  timestamp: Date[];
  type: string;
}

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Account');
  const auth = getAuth();
  const db = getFirestore();
  const [productMap, setProductMap] = useState<Map<string, string>>(new Map()); 
  const [cartItems, setCartItems] = useState<any[]>([]);


  const calculateTotalQuantity = (): number => {
    const quantity = localStorage.getItem('cartTotalQuantity');
    return quantity ? parseInt(quantity, 10) : 0;
  };


  useEffect(() => {
    // Fetch username from localStorage and update state
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      console.error('Username not found in localStorage');
    }
  }, []);

  useEffect(() => {
    // Fetch notifications when userName changes
    if (userName !== 'Account') {
      const fetchNotifications = async () => {
        setLoading(true); // Start loading
        try {
          const usersRef = collection(db, 'notif');
          
          // First, fetch the documents based on the where 
          const myuser = localStorage.getItem('userName')
          const q = query(usersRef, where('reviewerName', '==', myuser));
          const notificationSnapshot = await getDocs(q);
          
          // Then, sort the results in memory by the timestamp
          const notificationList: Notification[] = notificationSnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Notification[];

          const sortedNotifications = notificationList.sort((a, b) => b.timestamp - a.timestamp);
          
          setNotifications(sortedNotifications);
        } catch (error) {
          setError('Failed to fetch notifications');
          console.error('Failed to fetch notifications:', error);
        } finally {
          setLoading(false); // Stop loading
        }
      };
  
      fetchNotifications();
    }
  }, [userName]); // Dependency on userName
  

  useEffect(() => {
    // Set up socket connection
    const socket: Socket = io('http://localhost:3008');

    socket.on('reviewNotification', (data: Notification) => {
      if (data.type === "replyreview" && data.reviewerName === userName) {
        setNotifications(prevNotifications => [data, ...prevNotifications]);
      }
    });

    return () => {
      socket.off('reviewNotification');
      socket.disconnect();
    };
  }, [userName]); // Dependency on userName

  // Pagination logic
  const indexOfLastNotification = currentPage * itemsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - itemsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Container>
      <Header calculateTotalQuantity={calculateTotalQuantity} />
      <Typography variant="h4" gutterBottom style={{ marginTop: 90 }}>
        Notifications for {userName}
      </Typography>
      <div className="table-container">
        <table className='order-table'>
          <tbody>
            {loading ? (
              <tr>
                <td>Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td>Error: {error}</td>
              </tr>
            ) : (
              currentNotifications.map((notification, index) => {
                if (notification.type === 'replyreview') {
                  const productId = productMap.get(notification.productName);
                  return (
                    <tr key={notification.id} className={index % 2 === 0 ? 'odd-row' : 'even-row'}>
                      <td>
                        <strong>{notification.clientName}</strong> a répondu a votre <a style={{color: "#e88b53" , cursor: "pointer" }}  href={`/productdetails/${notification.productId}`}> avis </a> pour le produit <strong>{notification.productName}</strong>
                      </td>
                    </tr>
                  );
                }
                return null;
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <IconButton
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </IconButton>
        {pageNumbers.map(page => (
          <IconButton
            key={page}
            className={`pagination-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </IconButton>
        ))}
        <IconButton
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </IconButton>
      </div>
    </Container>
  );
};

export default NotificationList;
