// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/BookingService';
import authService from '../services/AuthService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Загружаем детальную информацию о пользователе
        const token = authService.getToken();
        const userResponse = await fetch('http://localhost:8080/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'omit',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserDetails(userData);
        }

        // Загружаем бронирования пользователя
        try {
          const bookingsData = await bookingService.getMyBookings();
          
          // Если это Page объект, извлекаем content
          let bookingsList = [];
          if (Array.isArray(bookingsData)) {
            bookingsList = bookingsData;
          } else if (bookingsData && typeof bookingsData === 'object' && 'content' in bookingsData) {
            bookingsList = Array.isArray(bookingsData.content) ? bookingsData.content : [];
          }
          
          setBookings(bookingsList);
        } catch (bookingError) {
          console.error('Error loading bookings:', bookingError);
          setBookings([]);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError(err.message || 'Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      // Обновляем список бронирований
      const updatedBookingsData = await bookingService.getMyBookings();
      // Если это Page объект, извлекаем content
      let updatedBookingsList = [];
      if (Array.isArray(updatedBookingsData)) {
        updatedBookingsList = updatedBookingsData;
      } else if (updatedBookingsData && typeof updatedBookingsData === 'object' && 'content' in updatedBookingsData) {
        updatedBookingsList = Array.isArray(updatedBookingsData.content) ? updatedBookingsData.content : [];
      }
      setBookings(updatedBookingsList);
      alert('Бронирование успешно отменено');
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert(`Ошибка при отмене бронирования: ${error.message || 'Неизвестная ошибка'}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('ru-RU');
    } catch (e) {
      return dateString;
    }
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Если это LocalDate (строка YYYY-MM-DD), парсим напрямую
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
      }
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch (e) {
      return dateString;
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#ececec',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '30px'
    },
    section: {
      marginBottom: '40px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e0e0e0'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '20px'
    },
    infoRow: {
      display: 'flex',
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px'
    },
    infoLabel: {
      fontWeight: 'bold',
      width: '200px',
      color: '#333'
    },
    infoValue: {
      color: '#666',
      flex: 1
    },
    bookingCard: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px',
      backgroundColor: '#fff'
    },
    bookingHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px'
    },
    bookingReference: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#004758'
    },
    status: {
      padding: '5px 15px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    statusConfirmed: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    statusCanceled: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    flightInfo: {
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px'
    },
    passengersList: {
      marginTop: '10px',
      paddingLeft: '20px'
    },
    cancelButton: {
      padding: '8px 20px',
      backgroundColor: '#d32f2f',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    backButton: {
      padding: '10px 20px',
      backgroundColor: '#004758',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '20px',
      fontSize: '14px'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '16px',
      color: '#666'
    },
    error: {
      backgroundColor: '#ffebee',
      color: '#d32f2f',
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    noBookings: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
      fontSize: '16px'
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>Загрузка данных...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← Назад на главную
        </button>

        <div style={styles.title}>Профиль пользователя</div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Личная информация</div>
          {userDetails && (
            <>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>Имя:</div>
                <div style={styles.infoValue}>{userDetails.firstName} {userDetails.lastName}</div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>Email:</div>
                <div style={styles.infoValue}>{userDetails.email}</div>
              </div>
              {userDetails.phone && (
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>Телефон:</div>
                  <div style={styles.infoValue}>{userDetails.phone}</div>
                </div>
              )}
              {userDetails.country && (
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>Страна:</div>
                  <div style={styles.infoValue}>{userDetails.country}</div>
                </div>
              )}
              {userDetails.dateOfBirth && (
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>Дата рождения:</div>
                  <div style={styles.infoValue}>{formatDateOnly(userDetails.dateOfBirth)}</div>
                </div>
              )}
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>Роль:</div>
                <div style={styles.infoValue}>
                  {userDetails.role === 'ADMIN' ? 'Администратор' : 
                   userDetails.role === 'STAFF' ? 'Сотрудник' : 'Пользователь'}
                </div>
              </div>
            </>
          )}
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Мои бронирования</div>
          
          {loading ? (
            <div style={styles.loading}>Загрузка бронирований...</div>
          ) : bookings.length === 0 ? (
            <div style={styles.noBookings}>У вас пока нет бронирований</div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} style={styles.bookingCard}>
                <div style={styles.bookingHeader}>
                    <div style={styles.bookingReference}>
                      Бронирование: {booking.bookingReference}
                    </div>
                    <div style={{
                      ...styles.status,
                      ...(booking.status === 'CONFIRMED' ? styles.statusConfirmed : styles.statusCanceled)
                    }}>
                      {booking.status === 'CONFIRMED' ? 'Подтверждено' : 
                       booking.status === 'CANCELED' ? 'Отменено' : (booking.status || 'N/A')}
                    </div>
                  </div>

                {booking.flight && (
                  <div style={styles.flightInfo}>
                    <div><strong>Рейс:</strong> {booking.flight.flightNumber}</div>
                    <div>
                      <strong>Маршрут:</strong> {
                        booking.flight.departureAirport?.city || 
                        booking.flight.departureAirport?.name || 
                        booking.flight.departureAirport?.iataCode || 'N/A'
                      } → {
                        booking.flight.arrivalAirport?.city || 
                        booking.flight.arrivalAirport?.name || 
                        booking.flight.arrivalAirport?.iataCode || 'N/A'
                      }
                    </div>
                    <div>
                      <strong>Вылет:</strong> {formatDate(booking.flight.scheduledDeparture)}
                    </div>
                    <div>
                      <strong>Прибытие:</strong> {formatDate(booking.flight.scheduledArrival)}
                    </div>
                    <div>
                      <strong>Класс места:</strong> {
                        booking.seatClass === 'ECONOMY' ? 'Эконом' : 
                        booking.seatClass === 'BUSINESS' ? 'Бизнес' : booking.seatClass
                      }
                    </div>
                    <div>
                      <strong>Дата бронирования:</strong> {formatDateOnly(booking.bookingDate)}
                    </div>
                  </div>
                )}

                {booking.passengers && booking.passengers.length > 0 && (
                  <div>
                    <strong>Пассажиры:</strong>
                    <div style={styles.passengersList}>
                      {booking.passengers.map((passenger, idx) => (
                        <div key={idx}>
                          {passenger.firstName} {passenger.lastName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {booking.status === 'CONFIRMED' && booking.flight && 
                 new Date(booking.flight.scheduledDeparture) > new Date() && (
                  <button
                    style={styles.cancelButton}
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Отменить бронирование
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

