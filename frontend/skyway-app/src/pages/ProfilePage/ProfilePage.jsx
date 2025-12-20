import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import bookingService from '../../services/BookingService';
import authService from '../../services/AuthService';
import styles from './ProfilePage.module.css';

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

        try {
          const bookingsData = await bookingService.getMyBookings();

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
      const updatedBookingsData = await bookingService.getMyBookings();
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
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
      }
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch (e) {
      return dateString;
    }
  };


  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка данных...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← Назад на главную
        </button>

        <div className={styles.title}>Профиль пользователя</div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Личная информация</div>
          {userDetails && (
            <>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Имя:</div>
                <div className={styles.infoValue}>{userDetails.firstName} {userDetails.lastName}</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Email:</div>
                <div className={styles.infoValue}>{userDetails.email}</div>
              </div>
              {userDetails.phone && (
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Телефон:</div>
                  <div className={styles.infoValue}>{userDetails.phone}</div>
                </div>
              )}
              {userDetails.country && (
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Страна:</div>
                  <div className={styles.infoValue}>{userDetails.country}</div>
                </div>
              )}
              {userDetails.dateOfBirth && (
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Дата рождения:</div>
                  <div className={styles.infoValue}>{formatDateOnly(userDetails.dateOfBirth)}</div>
                </div>
              )}
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Роль:</div>
                <div className={styles.infoValue}>
                  {userDetails.role === 'ADMIN' ? 'Администратор' : 
                   userDetails.role === 'STAFF' ? 'Сотрудник' : 'Пользователь'}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Мои бронирования</div>
          
          {loading ? (
            <div className={styles.loading}>Загрузка бронирований...</div>
          ) : bookings.length === 0 ? (
            <div className={styles.noBookings}>У вас пока нет бронирований</div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                    <div className={styles.bookingReference}>
                      Бронирование: {booking.bookingReference}
                    </div>
                    <div className={`${styles.status} ${booking.status === 'CONFIRMED' ? styles.statusConfirmed : styles.statusCanceled}`}>
                      {booking.status === 'CONFIRMED' ? 'Подтверждено' : 
                       booking.status === 'CANCELED' ? 'Отменено' : (booking.status || 'N/A')}
                    </div>
                  </div>

                {booking.flight && (
                  <div className={styles.flightInfo}>
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
                    <div className={styles.passengersList}>
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
                    className={styles.cancelButton}
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

