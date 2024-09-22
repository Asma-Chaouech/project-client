import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase Auth
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore'; // Import Firestore
import '../notifcss/css/app.min.css';
import '../notifcss/css/icons.min.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNavigate } from 'react-router-dom';
//import '../assets/cssf/owl.carousel.min.css';
//import '../assets/cssf/owl.theme.default.min.css';
//import '../assets/cssf/nice-select.css';
import '../assets/cssf/aos.css';
import './newnotif.css'
//import '../assets/cssf/style.css';
//import '../assets/cssf/responsive.css';
//import '../assets/cssf/color.css';
import Header from '../components/header1';
import Footer from '../components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faXmark } from '@fortawesome/free-solid-svg-icons'; // Import icons
import avatar from '../notifcss/images/users/avatar-10.jpg'
import { useHref } from 'react-router-dom';
import { timeLog } from 'console';
import { FaEye } from 'react-icons/fa';
//import "./cantact.css";

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}
interface Notification {
  id: string;
  clientName: string;
  productName: string;
  reviewerName: string;
  productId: string;
  commandId: string;
  isViewed: boolean;
  timestamp: Timestamp;
  type: string;
}
const NotifPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  const [reelnotifications, setreelNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Account');
  const auth = getAuth();
  const db = getFirestore();
  const [productMap, setProductMap] = useState<Map<string, string>>(new Map()); 
  const [mycurrentTime, setCurrentTime] = useState('');
  const [formattedNotifications, setFormattedNotifications] = useState<Notification[]>([]);
  const [groupedNotifications, setGroupedNotifications] = useState<{
    today: Notification[];
    others: Notification[];
  }>({
    today: [],
    others: [],
  });


  useEffect(() => {
    AOS.init();
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

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
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'notif');
        const myuser = localStorage.getItem('userName');
        const q = query(usersRef, where('reviewerName', '==', myuser));
        const notificationSnapshot = await getDocs(q);

        const notificationList: Notification[] = notificationSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Notification[];
          const sortedNotifications = notificationList.sort((a, b) => b.timestamp - a.timestamp);
          const newFormattedNotifications = sortedNotifications.map(notif => {
            const notifTimestamp = notif.timestamp;
            const myseconds = notifTimestamp.seconds;
            const nanoseconds = notifTimestamp.nanoseconds;

            // Convert seconds to milliseconds
            const milliseconds = myseconds * 1000;

            // Convert nanoseconds to milliseconds
            const nanosecondsToMilliseconds = nanoseconds / 1000000;

            // Combine milliseconds from seconds and nanoseconds
            const timestampInMillis = milliseconds + nanosecondsToMilliseconds;
            //const timestampInMillis = notifTimestamp * 1000;
            

            // Create a new date
            const notifDate = new Date(timestampInMillis);
            console.log(notifDate)
            const hours = notifDate.getHours();
            const minutes = notifDate.getMinutes();
            const seconds = notifDate.getSeconds();

            // Format the time
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '?';
            const reviewerInitial = getInitial(notif.clientName);


            return {
              ...notif,
              formattedTime,
              reviewerInitial // Add initials to the notification object
            };
          });
          setFormattedNotifications(newFormattedNotifications);

        // Group notifications by date
        const grouped: Record<string, Notification[]> = {};
        newFormattedNotifications.forEach(notif => {
          const notifDate = new Date(notif.timestamp.seconds * 1000);
          const dateKey = notifDate.toLocaleDateString('fr-FR');
          console.log(dateKey);


          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }

          grouped[dateKey].push(notif);
        });

        setGroupedNotifications(grouped);

      } catch (error) {
        setError('Failed to fetch notifications');
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userName]); // Ajoutez les dépendances si nécessaire

  // Helper function to check if a date is today
  const isToday = (dateString: string): boolean => {
    const today = new Date();
    const todayString = today.toLocaleDateString('fr-FR');
    return dateString === todayString;
  };
  


  useEffect(() => {
    // Set up socket connection
    const socket: Socket = io('http://localhost:3008');

    socket.on('reviewNotification', (data: Notification) => {
      console.log('Notification reçue:', data);
      if (data.type === "replyreview" && data.reviewerName === userName) {
        setreelNotifications(prevNotifications => [data, ...prevNotifications]);
        console.log('Notifications en cours:', reelnotifications);
        
      }
    });

    return () => {
      socket.off('reviewNotification');
      socket.disconnect();
    };
  }, [userName]); // Dependency on userName
  const handleNotificationClick = (productId: string) => {
    navigate(`/productdetails/${productId}`);
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
    <div className="page-wrapper">
      <div className="page-content">
      <Header calculateTotalQuantity={calculateTotalQuantity} />
      <li className="my-mx-3 my-welcome-text">
        <h3 className="my-mb-0 my-fw-bold my-text-truncate" style={{fontFamily:"Helvetica Neue, Helvetica,"}}>Bonjour, {userName}</h3>
       </li> 
        <div className="container-xxl">
          <div className="row justify-content-center">
            <div className="col-12">
            {reelnotifications.map((notif, index) => (
              <div  key={notif.id} className="my-own-card" style={{ backgroundColor: "#ffd88e3b" , height: "130px"}}>
                <div className="my-card-body">
                  <div className="row">
                    <div className="col">
                      <h6 className="my-mb-2 my-mt-1 my-fw-medium my-text-dark my-fs-18">{notif.clientName}</h6>
                      <p className="my-text-body my-fs-14">
                      <strong>{notif.clientName}</strong> a répondu a votre avis pour le produit <strong>{notif.productName}</strong>
                      </p>
                    </div>

                    <div className="col-md-2 text-end align-self-center">
                      <FontAwesomeIcon icon={faEye} className="btn my-btn-primary btn-sm px-2 my-notif-btn profile-link" onClick={() => handleNotificationClick(notif.productId)}/>
                    </div>
           
                  </div>
                </div>
              </div>
            ))}
            
            {Object.keys(groupedNotifications).map(date => (
        <div key={date} className="card-body mb-3">
          {/* Check if the date is today's date */}
          <h5 className="my-text-body my-m-0 d-inline-block">
            {isToday(date) ? "Aujourd'hui" : date}
          </h5>
          <span className="my-text-pink my-bg-pink-subtle my-py-0 my-px-1 my-rounded my-fw-medium my-d-inline-block my-ms-1">
            {groupedNotifications[date].length}
          </span>
          {groupedNotifications[date].map((notif) => (
            <div key={notif.id} className="my-own-card">
              <div className="my-card-body">
                <div className="row">
                  <div className="col-md-10">
                    <a href="#">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="thumb-lg rounded-circle" style={{backgroundColor:"#FFB777"}}>
                            {notif.reviewerInitial}
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-2 text-truncate">
                          <h6 className="my-1 fw-medium text-dark fs-14">
                            {notif.clientName}
                            <small className="text-muted ps-2">{notif.formattedTime}</small>
                          </h6>
                          <p className="text-muted mb-0 text-wrap">
                            <strong>{notif.clientName}</strong> a répondu à votre avis pour le produit <strong>{notif.productName}</strong>
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-md-2 text-end align-self-center">
                    <FontAwesomeIcon icon={faEye} className="btn my-btn-primary btn-sm px-2 my-notif-btn" onClick={() => handleNotificationClick(notif.productId)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
            </div>
          </div>
        </div>
      </div>

    </div>
      )}
    </>
  );
};
export default NotifPage;
