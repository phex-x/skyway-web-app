// src/pages/ManageBookingPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bookingService from '../../services/BookingService';

const ManageBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lastName, setLastName] = useState(location.state?.lastName || '');
  const [bookingCode, setBookingCode] = useState(location.state?.bookingCode || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const bookingData = await bookingService.searchBooking(bookingCode, lastName);
      setBooking(bookingData);
    } catch (err) {
      console.error('Search booking error:', err);
      setError(err.message || 'Бронирование не найдено');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelBooking = async () => {
    if (!booking || booking.status !== 'CONFIRMED') return;
    
    if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }
    
    try {
      await bookingService.cancelBooking(booking.id);
      // Обновляем статус локально, чтобы сразу отобразить результат
      setBooking({ ...booking, status: 'CANCELED' });
      alert('Бронирование успешно отменено');
    } catch (error) {
      console.error('Cancel booking error:', error);
      if (error.message && error.message.includes('401')) {
        alert('Для отмены бронирования необходимо войти в личный кабинет.');
      } else {
        alert(`Ошибка при отмене бронирования: ${error.message || 'Неизвестная ошибка'}`);
      }
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
      marginBottom: '20px'
    },
    form: {
      display: 'flex',
      gap: '15px',
      marginBottom: '30px',
      alignItems: 'flex-end'
    },
    formGroup: {
      flex: 1
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#333',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #000',
      borderRadius: '4px',
      boxSizing: 'border-box'
    },
    button: {
      padding: '12px 30px',
      backgroundColor: '#B79C72',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
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
    bookingInfo: {
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '4px',
      marginTop: '20px'
    },
    cancelButton: {
      padding: '10px 24px',
      backgroundColor: '#d32f2f',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '15px'
    },
    error: {
      color: '#d32f2f',
      marginTop: '10px'
    },
    loading: {
      textAlign: 'center',
      padding: '20px',
      color: '#666'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← Назад на главную
        </button>

        <div style={styles.title}>Управление бронированием</div>

        <form onSubmit={handleSearch} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Фамилия</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Код бронирования</label>
            <input
              type="text"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Поиск...' : 'Управление бронированием'}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        {loading && <div style={styles.loading}>Поиск бронирования...</div>}

        {booking && (
          <div style={styles.bookingInfo}>
            <h3>Информация о бронировании</h3>
            <p><strong>Код бронирования:</strong> {booking.bookingReference || booking.id}</p>
            <p><strong>Статус:</strong> {
              booking.status === 'CONFIRMED' ? 'Подтверждено' : 
              booking.status === 'CANCELED' ? 'Отменено' : 
              booking.status
            }</p>
            {booking.flight && (
              <>
                <p><strong>Рейс:</strong> {booking.flight.flightNumber}</p>
                <p><strong>Маршрут:</strong> {
                  booking.flight.departureAirport?.city || booking.flight.departureAirport?.name
                } → {
                  booking.flight.arrivalAirport?.city || booking.flight.arrivalAirport?.name
                }</p>
                <p><strong>Дата вылета:</strong> {
                  booking.flight.scheduledDeparture ? 
                  new Date(booking.flight.scheduledDeparture).toLocaleString('ru-RU') : 
                  'N/A'
                }</p>
                <p><strong>Дата прибытия:</strong> {
                  booking.flight.scheduledArrival ? 
                  new Date(booking.flight.scheduledArrival).toLocaleString('ru-RU') : 
                  'N/A'
                }</p>
                <p><strong>Класс места:</strong> {
                  booking.seatClass === 'ECONOMY' ? 'Эконом' : 
                  booking.seatClass === 'BUSINESS' ? 'Бизнес' : 
                  booking.seatClass
                }</p>
              </>
            )}
            {booking.passengers && booking.passengers.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <strong>Пассажиры:</strong>
                {booking.passengers.map((p, idx) => (
                  <div key={idx} style={{ marginLeft: '20px', marginTop: '5px' }}>
                    {p.firstName} {p.lastName}
                    {p.email && ` (${p.email})`}
                  </div>
                ))}
              </div>
            )}
            {booking.status === 'CONFIRMED' &&
             booking.flight &&
             new Date(booking.flight.scheduledDeparture) > new Date() && (
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleCancelBooking}
              >
                Отменить бронирование
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookingPage;

